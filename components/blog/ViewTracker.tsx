"use client";

import { useEffect, useRef } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // Ensure we only track once per page load, even in React Strict Mode
    if (tracked.current) return;
    tracked.current = true;

    fetch("/api/views", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      // Keepalive ensures the request finishes even if the user closes the tab quickly
      keepalive: true,
    }).catch(() => {
      // Intentionally swallow fetch errors silently
    });
  }, [slug]);

  // This component renders nothing to the DOM
  return null;
}
