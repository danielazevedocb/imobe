"use client";

import Link from "next/link";
import { UserRound } from "lucide-react";

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
    </div>
  );
}
