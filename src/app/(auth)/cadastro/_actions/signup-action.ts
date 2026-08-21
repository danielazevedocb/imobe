"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  signupSchema,
  type SignupInput,
  type SignupResult,
} from "./signup-schema";

export async function signupAction(input: SignupInput): Promise<SignupResult> {
  const validation = signupSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const { email, password, fullName, phone } = validation.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone ?? null,
      },
    },
  });

  if (error) {
    const message =
      error.message.includes("already registered") ||
      error.message.includes("User already registered")
        ? "Este email já está cadastrado"
        : error.message.includes("Password")
          ? "A senha não atende aos requisitos mínimos"
          : "Não foi possível criar a conta. Tente novamente.";

    return { success: false, message };
  }

  if (data.session) {
    redirect("/dashboard");
  }

  return {
    success: true,
    requiresEmailConfirmation: true,
    message:
      "Conta criada! Verifique seu email para confirmar o cadastro antes de entrar.",
  };
}
