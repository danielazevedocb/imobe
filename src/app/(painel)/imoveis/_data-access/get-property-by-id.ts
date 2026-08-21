import { notFound } from "next/navigation";

import { requireAuth } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/lib/types/property";

export async function getPropertyById(id: string): Promise<Property> {
  const user = await requireAuth();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    notFound();
  }

  return data as Property;
}
