import Link from "next/link";
import { Building2, FileText, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function MarketingPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Imobe
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
            <Button asChild>
              <Link href="/cadastro">Criar conta</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-primary">
              Micro SaaS imobiliário
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Gerencie seus imóveis com clareza
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Cadastre imóveis, acompanhe rendimentos de aluguel e gere contratos
              em PDF — tudo em uma área privada, simples e organizada.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/cadastro">Começar gratuitamente</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Já tenho conta</Link>
              </Button>
            </div>
          </div>

          <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 text-center">
              <Building2 className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">Imóveis</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Cadastre, edite e organize sua carteira de aluguel e venda.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <TrendingUp className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">Rendimentos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Registre e acompanhe o rendimento mensal de cada imóvel alugado.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 text-center">
              <FileText className="mx-auto h-8 w-8 text-primary" />
              <h3 className="mt-4 font-semibold">Contratos</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Gere contratos de locação e venda em PDF com poucos cliques.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © {new Date().getFullYear()} Imobe. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
