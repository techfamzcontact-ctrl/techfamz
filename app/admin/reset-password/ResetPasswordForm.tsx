"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminInputClass, adminLabelClass } from "@/components/admin/AdminUI";
import { AuthAlert } from "@/components/admin/AuthCard";
import { resetPassword } from "../password-reset-actions";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mismatch = confirm.length > 0 && password !== confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Your new password must be at least 8 characters long.");
      return;
    }
    if (password !== confirm) {
      setError("The two passwords don't match.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      router.replace("/admin/login?reset=1");
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <>
      {error && <AuthAlert tone="error">{error}</AuthAlert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="new-password" className={adminLabelClass}>New password</label>
          <div className="relative">
            <input
              id="new-password"
              type={show ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${adminInputClass} pr-10`}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              title={show ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-text-muted hover:text-text-primary"
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          <p className="mt-1.5 text-xs text-text-muted">At least 8 characters.</p>
        </div>

        <div>
          <label htmlFor="confirm-password" className={adminLabelClass}>Confirm new password</label>
          <input
            id="confirm-password"
            type={show ? "text" : "password"}
            autoComplete="new-password"
            required
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            aria-invalid={mismatch}
            aria-describedby={mismatch ? "confirm-error" : undefined}
            className={adminInputClass}
          />
          {mismatch && (
            <p id="confirm-error" className="mt-1.5 text-xs text-red-600 dark:text-red-400">
              The passwords don&apos;t match.
            </p>
          )}
        </div>

        <Button type="submit" disabled={loading} size="sm" className="mt-2 w-full">
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Saving..." : "Save new password"}
        </Button>
      </form>
    </>
  );
}
