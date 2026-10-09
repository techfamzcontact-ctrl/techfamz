"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex h-9 w-full items-center gap-2.5 rounded-md px-3 text-sm text-text-secondary transition-colors hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
    >
      <LogOut size={16} className="text-text-muted" />
      Sign out
    </button>
  );
}
