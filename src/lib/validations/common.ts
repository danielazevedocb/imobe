import { z } from "zod";

export const optionalNumber = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  });

export const positiveMoney = z
  .union([z.string(), z.number()])
  .transform((value) => {
    const parsed = typeof value === "number" ? value : Number(value);
    return Number.isNaN(parsed) ? null : parsed;
  })
  .pipe(z.number().positive("Informe um valor maior que zero"));

export const monthKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}$/, "Informe o mês no formato AAAA-MM")
  .superRefine((value, ctx) => {
    const [yearPart, monthPart] = value.split("-");
    const year = Number(yearPart);
    const month = Number(monthPart);

    if (year < 1 || year > 9999) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe um ano válido",
      });
    }

    if (month < 1 || month > 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Informe um mês válido",
      });
    }
  });

function stripDocument(value: string): string {
  return value.replace(/\D/g, "");
}

function isValidCpf(cpf: string): boolean {
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  if (digit !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  digit = (sum * 10) % 11;
  if (digit === 10) digit = 0;
  return digit === Number(cpf[10]);
}

function isValidCnpj(cnpj: string): boolean {
  if (cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(cnpj[i]) * weights1[i];
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (digit !== Number(cnpj[12])) return false;
  sum = 0;
  for (let i = 0; i < 13; i++) sum += Number(cnpj[i]) * weights2[i];
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  return digit === Number(cnpj[13]);
}

export const documentSchema = z
  .string()
  .min(1, "Informe o CPF ou CNPJ")
  .max(18, "Documento inválido")
  .refine((value) => {
    const digits = stripDocument(value);
    if (digits.length === 11) return isValidCpf(digits);
    if (digits.length === 14) return isValidCnpj(digits);
    return false;
  }, "CPF ou CNPJ inválido");

export const emailSchema = z
  .string()
  .email("Informe um e-mail válido")
  .max(120, "E-mail muito longo");

export const phoneSchema = z
  .string()
  .min(10, "Informe um telefone válido")
  .max(20, "Telefone muito longo");

export const shortText = (label: string, max = 120) =>
  z.string().min(1, `Informe ${label}`).max(max, `${label} muito longo`);

export const optionalLongText = z.string().max(2000, "Texto muito longo").optional();
