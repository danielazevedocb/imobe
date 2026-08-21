"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function PainelError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center">
      <h2 className="text-lg font-semibold">Não foi possível carregar esta área</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Ocorreu um erro inesperado. Tente novamente em instantes.
      </p>
      <Button className="mt-6" onClick={reset}>
        Tentar novamente
      </Button>
    </div>
  );
}
