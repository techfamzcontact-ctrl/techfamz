"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminInputClass, adminLabelClass } from "@/components/admin/AdminUI";
import { AuthAlert, AuthCard } from "@/components/admin/AuthCard";
import { cn } from "@/lib/utils";

export default function LoginForm({ passwordWasReset }: { passwordWasReset: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
      } else if (res?.ok) {
        window.location.href = "/admin";
      } else {
        setError("Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Sign in to Techfamz Admin" description="Manage posts, jobs, comments and TIDs.">
      {passwordWasReset && !error && (
        <AuthAlert tone="success">Your password was changed. Sign in with your new password.</AuthAlert>
      )}
      {error && <AuthAlert tone="error">{error}</AuthAlert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="email" className={adminLabelClass}>Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={adminInputClass}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="password" className={cn(adminLabelClass, "mb-0")}>Password</label>
            <Link
              href="/admin/forgot-password"
              className="text-xs font-medium text-accent-blue-light hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={adminInputClass}
          />
        </div>

        <Button type="submit" disabled={loading} size="sm" className="mt-2 w-full">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthCard>
  );
}
