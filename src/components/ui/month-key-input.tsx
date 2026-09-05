"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const MONTH_OPTIONS = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
] as const;

function buildYearOptions(centerYear: number) {
  const years: number[] = [];
  for (let year = centerYear - 10; year <= centerYear + 5; year += 1) {
    years.push(year);
  }
  return years;
}

function parseMonthKey(value: string): { year: string; month: string } | null {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: match[1], month: match[2] };
}

type MonthKeyInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
  "aria-invalid"?: boolean;
};

export function MonthKeyInput({
  value,
  onChange,
  disabled = false,
  id,
  className,
  "aria-invalid": ariaInvalid,
}: MonthKeyInputProps) {
  const parsed = parseMonthKey(value);
  const currentYear = new Date().getFullYear();
  const selectedYear = parsed?.year ?? String(currentYear);
  const selectedMonth = parsed?.month ?? String(new Date().getMonth() + 1).padStart(2, "0");
  const yearOptions = buildYearOptions(Number(selectedYear) || currentYear);

  function emitChange(year: string, month: string) {
    onChange(`${year}-${month}`);
  }

  return (
    <div className={cn("grid grid-cols-2 gap-2", className)}>
      <Select
        value={selectedMonth}
        onValueChange={(month) => emitChange(selectedYear, month)}
        disabled={disabled}
      >
        <SelectTrigger id={id} aria-invalid={ariaInvalid} className="w-full">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {MONTH_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedYear}
        onValueChange={(year) => emitChange(year, selectedMonth)}
        disabled={disabled}
      >
        <SelectTrigger aria-invalid={ariaInvalid} className="w-full">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {yearOptions.map((year) => (
            <SelectItem key={year} value={String(year)}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
