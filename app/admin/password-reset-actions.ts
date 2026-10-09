"use server";

/**
 * Public server actions for "Forgot password?" on the admin login.
 * They do not require a session, so every input is validated and rate limited here.
 */

import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { createResetToken, parseResetToken, verifyResetToken, RESET_TOKEN_TTL_MS } from "@/lib/password-reset";
import { PasswordResetEmail } from "@/components/emails/PasswordResetEmail";
import type { ActionResult } from "./actions";

const HOUR = 60 * 60 * 1000;

// Simple in-memory rate limiting (per server instance), same approach as /api/tid
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || now > entry.resetAt) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= limit) return true;
  entry.count++;
  return false;
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

const SENT_MESSAGE =
  "If that email belongs to an admin account, a reset link is on its way. It expires in 30 minutes. Check your spam folder if it doesn't arrive.";
const INVALID_LINK =
  "This reset link is invalid, has expired, or has already been used. Request a new one.";

export async function requestPasswordReset(email: string): Promise<ActionResult<{ message: string }>> {
  const normalized = typeof email === "string" ? email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) || normalized.length > 254) {
    return { ok: false, error: "Enter a valid email address." };
  }

  const ip = await getClientIp();
  if (isRateLimited(`request:ip:${ip}`, 5, HOUR) || isRateLimited(`request:email:${normalized}`, 3, HOUR)) {
    return { ok: false, error: "Too many reset requests. Please wait an hour and try again." };
  }

  if (!resend) {
    return {
      ok: false,
      error: "Reset emails can't be sent because email (Resend) isn't configured on this server.",
    };
  }

  const user = await prisma.user.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" } },
    select: { id: true, email: true, password: true },
  });

  // Same response whether or not the account exists, so this can't be used to find admin emails
  if (user) {
    const token = createResetToken(user);
    const baseUrl = (process.env.NEXTAUTH_URL || "https://www.techfamz.com").replace(/\/$/, "");
    const resetUrl = `${baseUrl}/admin/reset-password?token=${encodeURIComponent(token)}`;

    try {
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Techfamz <no-reply@techfamz.com>",
        to: [user.email],
        subject: "Reset your Techfamz admin password",
        react: PasswordResetEmail({ resetUrl, expiresInMinutes: RESET_TOKEN_TTL_MS / 60000 }),
      });
      if (error) console.error("Password reset email failed:", error);
    } catch (err) {
      console.error("Password reset email failed:", err);
    }
  }

  return { ok: true, data: { message: SENT_MESSAGE } };
}

export async function resetPassword(token: string, newPassword: string): Promise<ActionResult> {
  const ip = await getClientIp();
  if (isRateLimited(`reset:ip:${ip}`, 10, HOUR)) {
    return { ok: false, error: "Too many attempts. Please wait an hour and try again." };
  }

  if (typeof newPassword !== "string" || newPassword.length < 8) {
    return { ok: false, error: "Your new password must be at least 8 characters long." };
  }
  if (newPassword.length > 200) {
    return { ok: false, error: "Your new password is too long (200 characters at most)." };
  }

  const parsed = parseResetToken(token);
  if (!parsed) return { ok: false, error: INVALID_LINK };

  const user = await prisma.user.findUnique({
    where: { id: parsed.userId },
    select: { id: true, password: true },
  });
  if (!user || !verifyResetToken(token, user)) {
    return { ok: false, error: INVALID_LINK };
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    return { ok: false, error: "Choose a password that's different from your current one." };
  }

  try {
    const hashed = await bcrypt.hash(newPassword, 12);
    // Only update if the password is still the one the link was issued for (no double use)
    const result = await prisma.user.updateMany({
      where: { id: user.id, password: user.password },
      data: { password: hashed },
    });
    if (result.count === 0) return { ok: false, error: INVALID_LINK };
  } catch (err) {
    console.error("resetPassword failed:", err);
    return { ok: false, error: "Couldn't update the password. Please try again." };
  }

  return { ok: true, data: null };
}
