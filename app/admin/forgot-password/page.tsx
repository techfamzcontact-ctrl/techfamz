"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminInputClass, adminLabelClass } from "@/components/admin/AdminUI";
import { AuthAlert, AuthCard } from "@/components/admin/AuthCard";
import { requestPasswordReset } from "../password-reset-actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentMessage, setSentMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await requestPasswordReset(email);
      if (result.ok) {
        setSentMessage(result.data.message);
      } else {
        setError(result.error);
      }
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Reset your password"
      description="We'll email a link to choose a new password."
      footer={
        <Link href="/admin/login" className="font-medium text-text-secondary hover:text-text-primary">
          Back to sign in
        </Link>
      }
    >
      {sentMessage ? (
        <div className="flex flex-col items-center text-center">
          <MailCheck size={28} className="mb-3 text-accent-blue-light" />
          <p className="text-sm font-medium text-text-primary">Check your email</p>
          <p className="mt-1 text-sm text-text-muted">{sentMessage}</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-5 w-full"
            onClick={() => {
              setSentMessage("");
              setEmail("");
            }}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <>
          {error && <AuthAlert tone="error">{error}</AuthAlert>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className={adminLabelClass}>Admin email</label>
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
            <Button type="submit" disabled={loading} size="sm" className="mt-2 w-full">
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        </>
      )}
    </AuthCard>
  );
}
