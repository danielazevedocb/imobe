import { z } from "zod";

import { profileSchema } from "@/lib/validations/profile-schema";

export const signupSchema = z.object({
  email: z.string().email("Informe um email válido"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres"),
  fullName: profileSchema.shape.full_name,
  phone: profileSchema.shape.phone,
});

export type SignupFormInput = z.input<typeof signupSchema>;
export type SignupFormValues = z.output<typeof signupSchema>;
export type SignupInput = SignupFormValues;

export type SignupResult = {
  success: boolean;
  message?: string;
  requiresEmailConfirmation?: boolean;
  errors?: Record<string, string[]>;
};
