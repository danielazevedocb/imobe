import { z } from "zod";

const SOCIAL_USERNAME_REGEX = /^@?[A-Za-z0-9._]{1,100}$/;
const SOCIAL_LINK_REGEX = /^(https?:\/\/|www\.)/i;

function normalizeSocialUsername(value: string): string {
  const trimmed = value.trim();
  const withoutAt = trimmed.startsWith("@") ? trimmed.slice(1) : trimmed;
  return withoutAt;
}

function validateOptionalPhone(value: string | undefined | null): boolean {
  if (!value || value.trim() === "") {
    return true;
  }

  const trimmed = value.trim();

  if (trimmed.startsWith("+")) {
    const digits = trimmed.slice(1).replace(/\D/g, "");
    return digits.length >= 8 && digits.length <= 15 && /^[1-9]/.test(digits);
  }

  const digits = trimmed.replace(/\D/g, "");
  return digits.length === 10 || digits.length === 11;
}

export const profileSchema = z.object({
  full_name: z
    .string()
    .transform((value) => value.trim())
    .pipe(
      z
        .string()
        .min(2, "Informe um nome com pelo menos 2 caracteres")
        .max(120, "Nome muito longo"),
    ),
  phone: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : ""))
    .refine(validateOptionalPhone, "Informe um telefone válido"),
  instagram_username: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? normalizeSocialUsername(value) : ""))
    .superRefine((value, ctx) => {
      if (!value) return;

      if (SOCIAL_LINK_REGEX.test(value) || /\s/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe somente o nome de usuário do Instagram",
        });
        return;
      }

      if (!SOCIAL_USERNAME_REGEX.test(`@${value}`)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe um usuário válido do Instagram",
        });
      }
    }),
  tiktok_username: z
    .string()
    .optional()
    .transform((value) => (value?.trim() ? normalizeSocialUsername(value) : ""))
    .superRefine((value, ctx) => {
      if (!value) return;

      if (SOCIAL_LINK_REGEX.test(value) || /\s/.test(value)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe somente o nome de usuário do TikTok",
        });
        return;
      }

      if (!SOCIAL_USERNAME_REGEX.test(`@${value}`)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Informe um usuário válido do TikTok",
        });
      }
    }),
});

export type ProfileFormInput = z.input<typeof profileSchema>;
export type ProfileFormValues = z.output<typeof profileSchema>;
