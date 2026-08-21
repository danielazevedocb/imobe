import type { Metadata } from "next";

import { SignupForm } from "./_components/signup-form";

export const metadata: Metadata = {
  title: "Criar conta",
};

export default function CadastroPage() {
  return <SignupForm />;
}
