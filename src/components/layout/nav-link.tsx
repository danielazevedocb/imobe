"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type NavLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  collapsed?: boolean;
  className?: string;
  onClick?: () => void;
};

export function NavLink({
  href,
  label,
  icon,
  collapsed = false,
  className,
  onClick,
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const link = (
    <Link
      href={href}
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      aria-label={collapsed ? label : undefined}
      className={cn(
        "flex items-center rounded-lg text-sm font-medium transition-colors",
        collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground"
          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        className
      )}
    >
      {icon}
      {!collapsed ? <span>{label}</span> : null}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}
