import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { UserArea } from "@/components/layout/user-area";
import { getProfile } from "@/app/(painel)/_data-access/get-profile";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <div className="flex min-h-full flex-1">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
      >
        Ir para o conteúdo principal
      </a>
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <MobileNav
          userSlot={<UserArea fullName={profile?.full_name ?? "Usuário"} />}
        />
        <header className="hidden h-16 items-center justify-end border-b bg-background px-6 md:flex">
          <UserArea fullName={profile?.full_name ?? "Usuário"} />
        </header>
        <main id="conteudo-principal" className="flex-1 p-4 sm:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
