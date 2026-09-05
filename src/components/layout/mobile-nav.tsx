"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Menu, X } from "lucide-react";

import { LogoutButton } from "@/components/layout/logout-button";
import { navItems } from "@/components/layout/nav-items";
import { NavLink } from "@/components/layout/nav-link";
import { Button } from "@/components/ui/button";

type MobileNavProps = {
  userSlot?: React.ReactNode;
};

export function MobileNav({ userSlot }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 font-semibold"
        >
          <Building2 className="h-5 w-5 text-primary" />
          Imobe
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 flex h-full w-72 flex-col bg-sidebar shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <span className="font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-1 flex-col gap-1 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={<item.icon className="h-4 w-4" />}
                  onClick={() => setIsOpen(false)}
                />
              ))}
            </nav>
            <div className="flex flex-col gap-3 border-t border-sidebar-border p-4">
              {userSlot}
              <LogoutButton />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
