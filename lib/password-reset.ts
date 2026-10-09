import crypto from "node:crypto";

/**
 * Stateless admin password-reset tokens (server only).
 *
 * Token = base64url(userId) . expiry(base36) . HMAC-SHA256 signature
 *
 * The signature covers the user's current password hash, so a token stops working
 * as soon as the password changes: every link is single-use without storing anything.
 * Tokens expire after RESET_TOKEN_TTL_MS. Signed with NEXTAUTH_SECRET.
 */

export const RESET_TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes

type ResetUser = { id: string; password: string };

function getSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return secret;
}

function sign(userId: string, expires: number, passwordHash: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(`techfamz-admin-password-reset:${userId}:${expires}:${passwordHash}`)
    .digest("base64url");
}

export function createResetToken(user: ResetUser, now = Date.now()): string {
  const expires = now + RESET_TOKEN_TTL_MS;
  const id = Buffer.from(user.id, "utf8").toString("base64url");
  return `${id}.${expires.toString(36)}.${sign(user.id, expires, user.password)}`;
}

/** Reads the user id and expiry out of a token without trusting it yet. */
export function parseResetToken(token: string): { userId: string; expires: number; signature: string } | null {
  if (typeof token !== "string" || token.length > 512) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [idPart, expiresPart, signature] = parts;
  try {
    const userId = Buffer.from(idPart, "base64url").toString("utf8");
    const expires = parseInt(expiresPart, 36);
    if (!userId || !Number.isFinite(expires) || !signature) return null;
    return { userId, expires, signature };
  } catch {
    return null;
  }
}

/** True when the token was issued for this user's current password and has not expired. */
export function verifyResetToken(token: string, user: ResetUser, now = Date.now()): boolean {
  const parsed = parseResetToken(token);
  if (!parsed || parsed.userId !== user.id || parsed.expires < now) return false;

  const expected = Buffer.from(sign(user.id, parsed.expires, user.password));
  const actual = Buffer.from(parsed.signature);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}
