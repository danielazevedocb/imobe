import type { Metadata } from "next";

import { ProfileForm } from "@/app/(painel)/perfil/_components/profile-form";
import { getProfileForEdit } from "@/app/(painel)/perfil/_data-access/get-profile-for-edit";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Meu perfil",
};

function ProfileUnavailable() {
  return (
    <div className="mx-auto max-w-2xl space-y-4 rounded-lg border p-6">
      <h1 className="text-2xl font-semibold">Perfil indisponível</h1>
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar seus dados agora. Tente novamente em instantes.
      </p>
      <form action="/perfil">
        <Button type="submit">Tentar novamente</Button>
      </form>
    </div>
  );
}

export default async function ProfilePage() {
  let profile;

  try {
    profile = await getProfileForEdit();
  } catch {
    return <ProfileUnavailable />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meu perfil</h1>
        <p className="text-muted-foreground">
          Consulte e atualize seus dados de contato.
        </p>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
