"use client";

import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserArea } from "@/components/layout/user-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSidebarPreference } from "@/hooks/use-sidebar-preference";
import { SIDEBAR_PREFERENCE_KEY } from "@/lib/utils/sidebar-preference";
import { cn } from "@/lib/utils";

type PainelShellProps = {
  fullName: string;
  children: React.ReactNode;
};

function SidebarPreferenceScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            try {
              var raw = localStorage.getItem(${JSON.stringify(SIDEBAR_PREFERENCE_KEY)});
              if (raw === "recolhida") {
                document.documentElement.dataset.sidebarCollapsed = "true";
              }
            } catch (e) {}
          })();
        `,
      }}
    />
  );
}

export function PainelShell({ fullName, children }: PainelShellProps) {
  const { isCollapsed, toggleCollapsed } = useSidebarPreference();

  return (
    <>
      <SidebarPreferenceScript />
      <TooltipProvider delayDuration={0}>
        <div
          className="flex min-h-full flex-1 md:h-dvh md:overflow-hidden"
          data-sidebar-collapsed={isCollapsed ? "true" : "false"}
        >
          <AppSidebar
            isCollapsed={isCollapsed}
            onToggleCollapsed={toggleCollapsed}
          />
          <div
            className={cn(
              "flex min-h-0 flex-1 flex-col transition-[padding] duration-200",
              isCollapsed ? "md:pl-16" : "md:pl-64"
            )}
          >
            <MobileNav userSlot={<UserArea fullName={fullName} />} />
            <header className="hidden h-16 shrink-0 items-center justify-end border-b bg-background px-6 md:flex">
              <UserArea fullName={fullName} />
            </header>
            <main
              id="conteudo-principal"
              className="flex-1 overflow-y-auto p-4 sm:p-6 md:min-h-0"
            >
              <div className="mx-auto max-w-7xl">{children}</div>
            </main>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
