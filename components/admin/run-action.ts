"use client";

import { toast } from "sonner";
import type { ActionResult } from "@/app/admin/actions";

/** Window event fired after any successful admin mutation. */
export const ADMIN_DATA_CHANGED = "admin:data-changed";

/**
 * Await a server action that returns ActionResult and report the outcome as a toast.
 * Returns the data on success, or null on failure (the error has already been shown).
 */
export async function runAction<T>(
  action: Promise<ActionResult<T>>,
  successMessage?: string
): Promise<{ data: T } | null> {
  try {
    const result = await action;
    if (!result.ok) {
      toast.error(result.error);
      return null;
    }
    if (successMessage) toast.success(successMessage);
    // Lets the sidebar refresh its draft/hidden counts (see AdminMetricsProvider)
    window.dispatchEvent(new Event(ADMIN_DATA_CHANGED));
    return { data: result.data };
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong. Check your connection and try again.");
    return null;
  }
}
