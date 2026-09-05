import { Building2, FileText, LayoutDashboard } from "lucide-react";

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/imoveis", label: "Imóveis", icon: Building2 },
  { href: "/contratos", label: "Contratos", icon: FileText },
] as const;
