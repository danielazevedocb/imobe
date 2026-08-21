import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Informe um email válido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  fullName: z.string().min(2, "Informe seu nome completo"),
  phone: z
    .string()
    .optional()
    .refine(
      (value) =>
        !value ||
        value.replace(/\D/g, "").length >= 10,
      "Informe um telefone válido",
    ),
});

export type SignupInput = z.infer<typeof signupSchema>;

export type SignupResult = {
  success: boolean;
  message?: string;
  requiresEmailConfirmation?: boolean;
  errors?: Record<string, string[]>;
};
