"use client";

import { LogOut } from "lucide-react";

import { logoutAction } from "@/app/(painel)/_actions/logout-action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  collapsed?: boolean;
};

export function LogoutButton({
  className,
  collapsed = false,
}: LogoutButtonProps) {
  const button = (
    <button
      type="submit"
      aria-label={collapsed ? "Sair" : undefined}
      className={cn(
        "flex w-full items-center rounded-lg text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
        collapsed ? "justify-center px-2 py-2" : "gap-3 px-3 py-2",
        className
      )}
    >
      <LogOut className="h-4 w-4 shrink-0" />
      {!collapsed ? <span>Sair</span> : null}
    </button>
  );

  const content = collapsed ? (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent side="right">Sair</TooltipContent>
    </Tooltip>
  ) : (
    button
  );

  return <form action={logoutAction}>{content}</form>;
}
