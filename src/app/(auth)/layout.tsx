import Link from "next/link";
import { Building2 } from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
            <Building2 className="h-6 w-6 text-primary" />
            Imobe
          </Link>
          <p className="text-sm text-muted-foreground">
            Gestão simples de imóveis e contratos
          </p>
        </div>
        <Card>
          <CardContent className="pt-6">{children}</CardContent>
        </Card>
      </div>
    </div>
  );
}
