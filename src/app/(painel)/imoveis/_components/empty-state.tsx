import type { ReactNode } from "react";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  title = "Nenhum imóvel cadastrado",
  description = "Comece cadastrando seu primeiro imóvel para organizar sua carteira.",
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 py-16 text-center">
      <div className="mb-4 rounded-full bg-primary/10 p-4">
        <Building2 className="h-8 w-8 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action ?? (
        <Button asChild className="mt-6">
          <Link href="/imoveis/novo">
            <Plus className="h-4 w-4" />
            Cadastrar primeiro imóvel
          </Link>
        </Button>
      )}
    </div>
  );
}
