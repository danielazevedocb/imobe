"use client";

import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { logoutAction } from "@/app/(painel)/_actions/logout-action";
import { Button } from "@/components/ui/button";

type UserMenuProps = {
  fullName: string;
};

export function UserMenu({ fullName }: UserMenuProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-muted-foreground sm:inline">
        {fullName}
      </span>
      <Button variant="outline" size="sm" asChild>
        <Link href="/perfil">
          <UserRound className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Meu perfil</span>
        </Link>
      </Button>
      <form action={logoutAction}>
        <Button type="submit" variant="outline" size="sm">
          <LogOut className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-2">Sair</span>
        </Button>
      </form>
    </div>
  );
}
