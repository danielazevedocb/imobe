"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { deleteRentalIncomeAction } from "@/app/(painel)/imoveis/[id]/_actions/delete-rental-income";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RENTAL_INCOME_STATUS_LABELS } from "@/lib/constants/rental-income-labels";
import { formatCurrency } from "@/lib/format/currency";
import { formatReferenceMonth } from "@/lib/format/date";
import type { RentalIncome } from "@/lib/types/rental-income";

type DeleteRentalIncomeDialogProps = {
  income: RentalIncome;
  propertyId: string;
};

export function DeleteRentalIncomeDialog({
  income,
  propertyId,
}: DeleteRentalIncomeDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const monthLabel = formatReferenceMonth(income.reference_month);
  const amountLabel = formatCurrency(Number(income.amount));
  const statusLabel = RENTAL_INCOME_STATUS_LABELS[income.status];

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteRentalIncomeAction({
        id: income.id,
        property_id: propertyId,
      });

      if (!result.success) {
        toast.error(result.message ?? "Não foi possível excluir o rendimento.");
        return;
      }

      toast.success("Rendimento excluído com sucesso.");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
          aria-label={`Excluir rendimento de ${monthLabel}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir rendimento?</AlertDialogTitle>
          <AlertDialogDescription>
            O lançamento de <strong>{monthLabel}</strong> no valor de{" "}
            <strong>{amountLabel}</strong> ({statusLabel}) será removido
            permanentemente. Você poderá registrar novamente essa competência
            depois.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Excluindo..." : "Confirmar exclusão"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
