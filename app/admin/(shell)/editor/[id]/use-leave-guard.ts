"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/admin/ConfirmProvider";

/**
 * Warns before the admin leaves the editor with unsaved changes.
 *
 * - Reloads, closing the tab and full-page navigations get the browser's own prompt (beforeunload).
 * - Client-side links (sidebar, back link) never fire beforeunload, so clicks on same-origin
 *   links are intercepted and confirmed in-app. Only the default action is prevented, so other
 *   click handlers (e.g. closing the mobile menu) still run; Next's <Link> skips navigation
 *   when the event was already default-prevented.
 */
export function useLeaveGuard(isDirty: boolean) {
  const confirm = useConfirm();
  const router = useRouter();

  useEffect(() => {
    if (!isDirty) return;

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      // Older browsers only show the prompt when returnValue is set.
      event.returnValue = "";
    };

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const anchor = event.target.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      // Links inside the document being edited are content, not navigation.
      if (anchor.closest(".ProseMirror")) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href);
      // Other sites load a new page, which beforeunload already covers.
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;

      event.preventDefault();
      void confirm({
        title: "Leave without saving?",
        description: "You have unsaved changes to this post. They will be lost if you leave now.",
        confirmLabel: "Leave page",
        destructive: true,
      }).then((leave) => {
        if (leave) router.push(`${url.pathname}${url.search}${url.hash}`);
      });
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [isDirty, confirm, router]);
}
