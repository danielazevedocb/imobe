"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { signupAction } from "@/app/(auth)/cadastro/_actions/signup-action";
import {
  signupSchema,
  type SignupInput,
} from "@/app/(auth)/cadastro/_actions/signup-schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function SignupForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      phone: "",
    },
  });

  function handleSubmit(values: SignupInput) {
    startTransition(async () => {
      const result = await signupAction(values);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof SignupInput, {
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

      toast.success(result.message ?? "Conta criada!");

      if (result.requiresEmailConfirmation) {
        router.push("/login");
        router.refresh();
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="voce@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="(11) 99999-9999" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Mínimo 8 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  );
}
