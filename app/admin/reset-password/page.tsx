import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { parseResetToken, verifyResetToken } from "@/lib/password-reset";
import { AuthCard } from "@/components/admin/AuthCard";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Choose a new admin password",
  robots: { index: false, follow: false },
  // The URL carries the reset token; never send it to other sites
  referrer: "no-referrer",
};

export const dynamic = "force-dynamic";

async function isValidToken(token: string): Promise<boolean> {
  const parsed = parseResetToken(token);
  if (!parsed) return false;
  const user = await prisma.user.findUnique({
    where: { id: parsed.userId },
    select: { id: true, password: true },
  });
  return Boolean(user && verifyResetToken(token, user));
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const valid = token ? await isValidToken(token) : false;

  if (!valid) {
    return (
      <AuthCard
        title="Link expired"
        description="This reset link is invalid, has expired, or has already been used."
        footer={
          <Link href="/admin/login" className="font-medium text-text-secondary hover:text-text-primary">
            Back to sign in
          </Link>
        }
      >
        <p className="mb-5 text-sm text-text-secondary">
          Reset links work once and expire after 30 minutes. Request a new one to continue.
        </p>
        <Button asChild size="sm" className="w-full">
          <Link href="/admin/forgot-password">Request a new link</Link>
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" description="Use at least 8 characters.">
      <ResetPasswordForm token={token} />
    </AuthCard>
  );
}
