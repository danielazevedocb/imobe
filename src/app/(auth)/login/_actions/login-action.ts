"use server";

import { createClient } from "@/lib/supabase/server";

import {
  loginSchema,
  type LoginInput,
  type LoginResult,
} from "./login-schema";

export async function loginAction(input: LoginInput): Promise<LoginResult> {
  const validation = loginSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validation.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase().includes("email not confirmed")
      ? "Confirme seu email antes de entrar"
      : "Email ou senha incorretos";

    return {
      success: false,
      message,
    };
  }

  return { success: true };
}
