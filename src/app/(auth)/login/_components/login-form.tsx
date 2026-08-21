"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { loginAction } from "@/app/(auth)/login/_actions/login-action";
import {
  loginSchema,
  type LoginInput,
} from "@/app/(auth)/login/_actions/login-schema";
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

export function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSubmit(values: LoginInput) {
    startTransition(async () => {
      const result = await loginAction(values);

      if (!result.success) {
        if (result.errors) {
          Object.entries(result.errors).forEach(([field, messages]) => {
            if (messages?.[0]) {
              form.setError(field as keyof LoginInput, {
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

      toast.success("Login realizado com sucesso!");
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            Criar conta
          </Link>
        </p>
      </form>
    </Form>
  );
}
