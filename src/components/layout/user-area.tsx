"use client";

import { UserMenu } from "@/app/(painel)/_components/user-menu";

type UserAreaProps = {
  fullName: string;
};

export function UserArea({ fullName }: UserAreaProps) {
  return <UserMenu fullName={fullName} />;
}
