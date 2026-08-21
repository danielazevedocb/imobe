"use client";

import type { Control, FieldValues, Path } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PERSON_TYPE_LABELS } from "@/lib/constants/contract-labels";

type PartyFieldsProps<T extends FieldValues> = {
  control: Control<T>;
  prefix: "party_a" | "party_b";
  title: string;
  disabled?: boolean;
  addressLabel?: string;
  addressDescription?: string;
};

export function PartyFields<T extends FieldValues>({
  control,
  prefix,
  title,
  disabled,
  addressLabel = "Endereço completo",
  addressDescription,
}: PartyFieldsProps<T>) {
  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="font-semibold">{title}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={control}
          name={`${prefix}.person_type` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de pessoa</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={disabled}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {(
                    Object.entries(PERSON_TYPE_LABELS) as [
                      keyof typeof PERSON_TYPE_LABELS,
                      string,
                    ][]
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.name` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome / Razão social</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.document` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>CPF / CNPJ</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.registration` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>RG / Inscrição (opcional)</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.phone` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${prefix}.email` as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" {...field} disabled={disabled} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={control}
        name={`${prefix}.address` as Path<T>}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{addressLabel}</FormLabel>
            {addressDescription ? (
              <FormDescription>{addressDescription}</FormDescription>
            ) : null}
            <FormControl>
              <Textarea {...field} disabled={disabled} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
