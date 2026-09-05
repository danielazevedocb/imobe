import { PainelShell } from "@/components/layout/painel-shell";
import { getProfile } from "@/app/(painel)/_data-access/get-profile";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  return (
    <>
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
      >
        Ir para o conteúdo principal
      </a>
      <PainelShell fullName={profile?.full_name ?? "Usuário"}>
        {children}
      </PainelShell>
    </>
  );
}
