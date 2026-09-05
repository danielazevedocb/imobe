"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/types/action-result";
import {
  profileSchema,
  type ProfileFormInput,
} from "@/lib/validations/profile-schema";

export async function updateProfileAction(
  input: ProfileFormInput,
): Promise<ActionResult> {
  const validation = profileSchema.safeParse(input);

  if (!validation.success) {
    return {
      success: false,
      errors: validation.error.flatten().fieldErrors,
    };
  }

  const user = await requireAuth();
  const supabase = await createClient();
  const values = validation.data;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: values.full_name,
      phone: values.phone || null,
      instagram_username: values.instagram_username || null,
      tiktok_username: values.tiktok_username || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return {
      success: false,
      message: "Não foi possível salvar o perfil. Verifique os dados informados.",
    };
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/imoveis");
  revalidatePath("/contratos");

  return {
    success: true,
    message: "Perfil atualizado com sucesso.",
  };
}
