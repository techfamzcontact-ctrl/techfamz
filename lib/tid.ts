/**
 * TID (Techfamz Identity) Generator
 *
 * Format: TF + 7 random chars from a safe charset
 * Safe charset excludes ambiguous characters (0/O, 1/I/L)
 * Produces ~27 billion unique combinations (31^7)
 *
 * Examples: TF4K9XMR2, TFNP7H3WE, TF8YDQK6J
 */

const SAFE_CHARSET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"; // 31 chars
const TID_PREFIX = "TF";
const TID_RANDOM_LENGTH = 7;

export function generateTID(): string {
  let result = TID_PREFIX;
  const charsetLength = SAFE_CHARSET.length;

  // Use crypto for better randomness when available
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const randomValues = new Uint32Array(TID_RANDOM_LENGTH);
    crypto.getRandomValues(randomValues);
    for (let i = 0; i < TID_RANDOM_LENGTH; i++) {
      result += SAFE_CHARSET[randomValues[i] % charsetLength];
    }
  } else {
    for (let i = 0; i < TID_RANDOM_LENGTH; i++) {
      result += SAFE_CHARSET[Math.floor(Math.random() * charsetLength)];
    }
  }

  return result;
}

/** Validates that a string looks like a valid TID format */
export function isValidTID(tid: string): boolean {
  if (!tid || tid.length !== TID_PREFIX.length + TID_RANDOM_LENGTH) return false;
  if (!tid.startsWith(TID_PREFIX)) return false;

  const randomPart = tid.slice(TID_PREFIX.length);
  return [...randomPart].every((char) => SAFE_CHARSET.includes(char));
}
