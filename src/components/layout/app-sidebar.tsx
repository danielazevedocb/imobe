"use client";

import Link from "next/link";
import { Building2, PanelLeft, PanelLeftClose } from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
import { navItems } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AppSidebarProps = {
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
};

export function AppSidebar({
  isCollapsed,
  onToggleCollapsed,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        "hidden shrink-0 border-r border-sidebar-border bg-sidebar transition-[width] duration-200 md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center gap-1 px-1" : "justify-between px-4"
        )}
      >
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-2 font-semibold",
            isCollapsed && "justify-center"
          )}
          aria-label={isCollapsed ? "Imobe" : undefined}
        >
          <Building2 className="h-5 w-5 shrink-0 text-primary" />
          {!isCollapsed ? <span>Imobe</span> : null}
        </Link>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onToggleCollapsed}
          aria-label={
            isCollapsed ? "Expandir barra lateral" : "Recolher barra lateral"
          }
          aria-expanded={!isCollapsed}
          className="h-8 w-8 shrink-0"
        >
          {isCollapsed ? (
            <PanelLeft className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>
      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            icon={<item.icon className="h-4 w-4 shrink-0" />}
            collapsed={isCollapsed}
          />
        ))}
      </nav>
      <div className="shrink-0 border-t border-sidebar-border p-4">
        <LogoutButton collapsed={isCollapsed} />
      </div>
    </aside>
  );
}
