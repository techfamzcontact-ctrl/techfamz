/** Small helpers shared by the post editor page and its toolbar. */

/** Good meta-description length for the excerpt (search results cut off around 155 characters). */
export const EXCERPT_MIN = 120;
export const EXCERPT_MAX = 155;

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Same estimate as the public post page (~225 words per minute). */
export function readingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 225));
}

/**
 * Accepts what admins usually type into a link field.
 * Bare domains get https://; absolute, mailto:, tel:, relative and #anchor links are kept as typed.
 */
export function normalizeUrl(raw: string): string {
  const url = raw.trim();
  if (!url) return "";
  if (/^(https?:\/\/|mailto:|tel:)/i.test(url) || url.startsWith("/") || url.startsWith("#")) return url;
  return `https://${url}`;
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith("image/");
}

/** Uploads an image to Cloudinary through /api/upload and returns its URL. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data: { url?: unknown; error?: unknown } = await res.json().catch(() => ({}));
  if (!res.ok || typeof data.url !== "string") {
    throw new Error(typeof data.error === "string" ? data.error : "Upload failed");
  }
  return data.url;
}
