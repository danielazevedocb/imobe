"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { commitQuickPaymentAction } from "@/app/(painel)/dashboard/_actions/commit-quick-payment";
import { lookupQuickPaymentCompetencyAction } from "@/app/(painel)/dashboard/_actions/lookup-quick-payment-competency";
import { formatQuickPaymentPropertyLabel } from "@/lib/format/quick-payment-property";
import type { QuickPaymentPropertyOption } from "@/lib/types/quick-payment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MonthKeyInput } from "@/components/ui/month-key-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RENTAL_INCOME_STATUS_LABELS } from "@/lib/constants/rental-income-labels";
import { formatCurrency } from "@/lib/format/currency";
import { formatReferenceMonth, getCurrentMonthKey } from "@/lib/format/date";
import type { QuickPaymentCompetencyResult } from "@/lib/types/quick-payment";
import { quickPaymentAmountSchema } from "@/lib/validations/quick-payment-schema";
import { monthKeySchema } from "@/lib/validations/common";

const quickPaymentFormSchema = z.object({
  property_id: z.string().uuid("Selecione um imóvel"),
  reference_month: monthKeySchema,
  amount: quickPaymentAmountSchema,
});

type QuickPaymentFormInput = z.input<typeof quickPaymentFormSchema>;
type QuickPaymentFormValues = z.output<typeof quickPaymentFormSchema>;

type QuickPaymentDialogProps = {
  properties: QuickPaymentPropertyOption[];
};

type PendingConfirmation = {
  incomeId: string;
  previousAmount: number;
  previousStatus: "pending" | "overdue";
  previousUpdatedAt: string;
  nextAmount: number;
  referenceMonth: string;
  propertyLabel: string;
};

function toAmountInput(value?: number | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "";
  }

  return String(value);
}

export function QuickPaymentDialog({ properties }: QuickPaymentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLookupPending, startLookupTransition] = useTransition();
  const [competency, setCompetency] = useState<QuickPaymentCompetencyResult | null>(
    null,
  );
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation | null>(null);
  const [operationKey, setOperationKey] = useState(() => crypto.randomUUID());
  const lookupTokenRef = useRef(0);
  const amountEditedRef = useRef(false);

  const form = useForm<QuickPaymentFormInput, unknown, QuickPaymentFormValues>({
    resolver: zodResolver(quickPaymentFormSchema),
    defaultValues: {
      property_id: "",
      reference_month: getCurrentMonthKey(),
      amount: "",
    },
  });

  const selectedPropertyId = form.watch("property_id");
  const selectedMonth = form.watch("reference_month");

  const selectedProperty = useMemo(
    () => properties.find((property) => property.id === selectedPropertyId),
    [properties, selectedPropertyId],
  );

  const propertyLabel = selectedProperty
    ? formatQuickPaymentPropertyLabel(selectedProperty)
    : "";

  const canSubmit =
    Boolean(selectedPropertyId) &&
    !isLookupPending &&
    competency !== null &&
    competency.status !== "property_ineligible" &&
    competency.status !== "invalid_month" &&
    competency.status !== "unauthorized" &&
    competency.status !== "received";

  function resetDialogState() {
    lookupTokenRef.current += 1;
    amountEditedRef.current = false;
    setCompetency(null);
    setLookupError(null);
    setPendingConfirmation(null);
    setOperationKey(crypto.randomUUID());
    form.reset({
      property_id: "",
      reference_month: getCurrentMonthKey(),
      amount: "",
    });
  }

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (!nextOpen) {
      resetDialogState();
    }
  }

  function lookupCompetency(propertyId: string, referenceMonth: string) {
    if (!propertyId) {
      setCompetency(null);
      setLookupError(null);
      return;
    }

    const token = ++lookupTokenRef.current;

    startLookupTransition(async () => {
      const result = await lookupQuickPaymentCompetencyAction({
        property_id: propertyId,
        reference_month: referenceMonth,
      });

      if (token !== lookupTokenRef.current) {
        return;
      }

      if (!result.success || !result.data) {
        setCompetency(null);
        setLookupError(
          result.message ?? "Não foi possível consultar a competência.",
        );
        return;
      }

      setLookupError(null);
      setCompetency(result.data);

      if (!amountEditedRef.current) {
        const suggested =
          result.data.suggestedAmount ??
          selectedProperty?.rent_value ??
          undefined;

        if (suggested !== undefined) {
          form.setValue("amount", toAmountInput(suggested), {
            shouldValidate: true,
          });
        }
      }
    });
  }

  useEffect(() => {
    if (!isOpen || !selectedPropertyId) {
      return;
    }

    lookupCompetency(selectedPropertyId, selectedMonth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedPropertyId, selectedMonth]);

  function handleSubmit(values: QuickPaymentFormValues) {
    startTransition(async () => {
      const result = await commitQuickPaymentAction({
        operation_key: operationKey,
        property_id: values.property_id,
        reference_month: values.reference_month,
        amount: values.amount,
        confirm_update: false,
        expected_income_id:
          competency?.incomeId &&
          (competency.status === "pending" || competency.status === "overdue")
            ? competency.incomeId
            : undefined,
        expected_status:
          competency?.status === "pending" || competency?.status === "overdue"
            ? competency.status
            : undefined,
        expected_amount:
          competency?.amount &&
          (competency.status === "pending" || competency.status === "overdue")
            ? competency.amount
            : undefined,
        expected_updated_at: competency?.updatedAt,
      });

      if (result.success) {
        toast.success(result.message ?? "Pagamento registrado com sucesso.");
        handleOpenChange(false);
        return;
      }

      if (result.data?.status === "needs_confirmation" && competency?.incomeId) {
        setPendingConfirmation({
          incomeId: competency.incomeId,
          previousAmount: competency.amount ?? values.amount,
          previousStatus: competency.status as "pending" | "overdue",
          previousUpdatedAt: competency.updatedAt ?? new Date().toISOString(),
          nextAmount: values.amount,
          referenceMonth: values.reference_month,
          propertyLabel,
        });
        return;
      }

      if (result.data?.status === "already_received") {
        setCompetency({
          status: "received",
          incomeId: result.data.incomeId,
          amount: result.data.amount,
          referenceMonth: result.data.referenceMonth,
        });
      }

      if (result.data?.status === "conflict_changed") {
        lookupCompetency(values.property_id, values.reference_month);
      }

      toast.error(result.message ?? "Não foi possível registrar o pagamento.");
    });
  }

  function handleConfirmUpdate() {
    if (!pendingConfirmation) {
      return;
    }

    const values = form.getValues();

    startTransition(async () => {
      const result = await commitQuickPaymentAction({
        operation_key: operationKey,
        property_id: values.property_id,
        reference_month: values.reference_month,
        amount: pendingConfirmation.nextAmount,
        confirm_update: true,
        expected_income_id: pendingConfirmation.incomeId,
        expected_status: pendingConfirmation.previousStatus,
        expected_amount: pendingConfirmation.previousAmount,
        expected_updated_at: pendingConfirmation.previousUpdatedAt,
      });

      if (!result.success) {
        if (result.data?.status === "conflict_changed") {
          lookupCompetency(values.property_id, values.reference_month);
        }

        toast.error(
          result.message ?? "Não foi possível concluir o recebimento.",
        );
        return;
      }

      toast.success(result.message ?? "Pagamento registrado com sucesso.");
      setPendingConfirmation(null);
      handleOpenChange(false);
    });
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button>Registrar pagamento de aluguel</Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Registrar pagamento de aluguel</DialogTitle>
            <DialogDescription>
              Selecione o imóvel, a competência e confirme o valor recebido.
            </DialogDescription>
          </DialogHeader>

          {properties.length === 0 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você ainda não possui imóveis elegíveis para registrar aluguel.
                Cadastre um imóvel com finalidade de aluguel para usar este
                atalho.
              </p>
              <Button asChild>
                <Link href="/imoveis/novo">Cadastrar imóvel</Link>
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imóvel</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          amountEditedRef.current = false;
                          field.onChange(value);
                        }}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o imóvel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties.map((property) => (
                            <SelectItem key={property.id} value={property.id}>
                              {formatQuickPaymentPropertyLabel(property)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="reference_month"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mês de referência</FormLabel>
                        <FormControl>
                          <MonthKeyInput
                            value={field.value}
                            disabled={isPending}
                            onChange={(nextMonth) => {
                              amountEditedRef.current = false;
                              field.onChange(nextMonth);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Valor (R$)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0.01"
                            step="0.01"
                            placeholder="0,00"
                            {...field}
                            value={field.value ?? ""}
                            disabled={isPending}
                            onChange={(event) => {
                              amountEditedRef.current = true;
                              field.onChange(event);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {isLookupPending ? (
                  <p className="text-sm text-muted-foreground">
                    Consultando competência...
                  </p>
                ) : null}

                {lookupError ? (
                  <p className="text-sm font-medium text-destructive">
                    {lookupError}
                  </p>
                ) : null}

                {competency?.status === "received" ? (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
                    <p className="font-medium">
                      Este mês já possui um recebimento registrado.
                    </p>
                    <p className="mt-1">
                      {formatReferenceMonth(`${competency.referenceMonth ?? selectedMonth}-01`)} —{" "}
                      {formatCurrency(competency.amount)}
                    </p>
                  </div>
                ) : null}

                {competency?.status === "pending" ||
                competency?.status === "overdue" ? (
                  <div className="rounded-lg border p-4 text-sm">
                    <p className="font-medium">
                      Lançamento existente:{" "}
                      {RENTAL_INCOME_STATUS_LABELS[competency.status]}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Valor atual: {formatCurrency(competency.amount)}. Ao
                      confirmar, o mesmo lançamento será marcado como recebido.
                    </p>
                  </div>
                ) : null}

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleOpenChange(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={!canSubmit || isPending}>
                    {isPending ? "Salvando..." : "Registrar pagamento"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(pendingConfirmation)}
        onOpenChange={(open) => {
          if (!open) {
            setPendingConfirmation(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar recebimento</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  Imóvel:{" "}
                  <span className="font-medium text-foreground">
                    {pendingConfirmation?.propertyLabel}
                  </span>
                </p>
                <p>
                  Competência:{" "}
                  <span className="font-medium text-foreground">
                    {pendingConfirmation
                      ? formatReferenceMonth(
                          `${pendingConfirmation.referenceMonth}-01`,
                        )
                      : ""}
                  </span>
                </p>
                <p>
                  Valor anterior:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(pendingConfirmation?.previousAmount)}
                  </span>
                </p>
                <p>
                  Valor confirmado:{" "}
                  <span className="font-medium text-foreground">
                    {formatCurrency(pendingConfirmation?.nextAmount)}
                  </span>
                </p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmUpdate}
              disabled={isPending}
            >
              {isPending ? "Confirmando..." : "Confirmar recebimento"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
