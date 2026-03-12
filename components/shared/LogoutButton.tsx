"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ mobile = false }: { mobile?: boolean }) {
  const handleSignOut = () => signOut({ callbackUrl: "/admin/login" });

  if (mobile) {
    return (
      <button
        onClick={handleSignOut}
        className="text-sm text-text-muted hover:text-red-400 transition-colors"
      >
        Logout
      </button>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-3 w-full px-3 py-2 mt-2 rounded-lg text-sm text-red-400 hover:bg-[rgba(248,113,113,0.1)] transition-colors"
    >
      <LogOut size={18} />
      Logout
    </button>
  );
}
