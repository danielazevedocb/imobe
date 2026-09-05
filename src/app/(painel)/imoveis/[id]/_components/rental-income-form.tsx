"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createRentalIncomeAction } from "@/app/(painel)/imoveis/[id]/_actions/create-rental-income";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MonthKeyInput } from "@/components/ui/month-key-input";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RENTAL_INCOME_STATUS_OPTIONS } from "@/lib/constants/rental-income-labels";
import { getCurrentMonthKey } from "@/lib/format/date";
import {
  rentalIncomeSchema,
  type RentalIncomeFormInput,
  type RentalIncomeFormValues,
} from "@/lib/validations/rental-income-schema";

type RentalIncomeFormProps = {
  propertyId: string;
};

export function RentalIncomeForm({ propertyId }: RentalIncomeFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<RentalIncomeFormInput, unknown, RentalIncomeFormValues>({
    resolver: zodResolver(rentalIncomeSchema),
    defaultValues: {
      property_id: propertyId,
      reference_month: getCurrentMonthKey(),
      amount: "",
      status: "pending",
    },
  });

  function handleSubmit(values: RentalIncomeFormValues) {
    startTransition(async () => {
      const result = await createRentalIncomeAction(values);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof RentalIncomeFormInput, {
                message: messages[0],
              });
            }
          });
        }
        if (result.message) {
          toast.error(result.message);
        }
        return;
      }

      toast.success("Rendimento registrado com sucesso.");
      form.reset({
        property_id: propertyId,
        reference_month: getCurrentMonthKey(),
        amount: "",
        status: "pending",
      });
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <input type="hidden" {...form.register("property_id")} />

        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="reference_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mês de referência</FormLabel>
                <FormControl>
                  <MonthKeyInput
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isPending}
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
                    min="0"
                    step="0.01"
                    placeholder="0,00"
                    {...field}
                    disabled={isPending}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isPending}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {RENTAL_INCOME_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Registrar rendimento"}
        </Button>
      </form>
    </Form>
  );
}
