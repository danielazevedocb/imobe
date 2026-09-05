"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProfileAction } from "@/app/(painel)/perfil/_actions/update-profile";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { ProfileForEdit } from "@/lib/types/profile";
import {
  profileSchema,
  type ProfileFormInput,
} from "@/lib/validations/profile-schema";

type ProfileFormProps = {
  profile: ProfileForEdit;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile.full_name,
      phone: profile.phone ?? "",
      instagram_username: profile.instagram_username ?? "",
      tiktok_username: profile.tiktok_username ?? "",
    },
  });

  function handleSubmit(values: ProfileFormInput) {
    startTransition(async () => {
      const result = await updateProfileAction(values);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof ProfileFormInput, {
                message: messages[0],
              });
            }
          });
        }

        if (result.message) {
          toast.error(result.message);
        }

        return;
      }

      toast.success(result.message ?? "Perfil atualizado com sucesso.");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>E-mail</FormLabel>
          <FormControl>
            <Input value={profile.email} disabled readOnly />
          </FormControl>
          <FormDescription>
            O e-mail de acesso não pode ser alterado nesta entrega.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>WhatsApp / telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="(11) 99999-9999 ou +5511999999999"
                  {...field}
                  disabled={isPending}
                />
              </FormControl>
              <FormDescription>Opcional.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="instagram_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Instagram</FormLabel>
              <FormControl>
                <Input placeholder="@seu_usuario" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Informe somente o nome de usuário, sem link completo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tiktok_username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TikTok</FormLabel>
              <FormControl>
                <Input placeholder="@seu_usuario" {...field} disabled={isPending} />
              </FormControl>
              <FormDescription>
                Informe somente o nome de usuário, sem link completo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Form>
  );
}
