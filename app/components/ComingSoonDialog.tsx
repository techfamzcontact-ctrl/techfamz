"use client";

import { useCallback, useEffect } from "react";

interface ComingSoonDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export default function ComingSoonDialog({
  open,
  onClose,
  title = "Coming Soon",
  description = "We're building something incredible. Stay tuned for updates.",
}: ComingSoonDialogProps) {

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[300] bg-[rgba(0,0,0,0.65)] backdrop-blur-sm transition-opacity duration-400 ease-smooth ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className={`fixed z-[301] inset-0 flex items-center justify-center p-5 transition-all duration-500 ease-premium ${
          open
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="relative w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-glass bg-[rgba(8,14,30,0.97)] backdrop-blur-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Glow accents */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-accent-blue opacity-[0.08] blur-[50px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-cta-yellow opacity-[0.06] blur-[40px] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 ease-smooth cursor-pointer"
            aria-label="Close dialog"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <div className="relative p-8 md:p-10 text-center">
            {/* Animated icon */}
            <div className="mx-auto mb-6 w-16 h-16 rounded-2xl bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue-light">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>

            {/* Status badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-cta-yellow border border-cta-yellow-glow rounded-full bg-[rgba(212,168,75,0.08)] mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cta-yellow opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta-yellow" />
              </span>
              In Development
            </div>

            {/* Title */}
            <h3 className="text-[1.4rem] font-bold leading-[1.2] tracking-tight text-text-primary mb-3">
              {title}
            </h3>

            {/* Description */}
            <p className="text-[0.92rem] leading-relaxed text-text-secondary mb-8 m-0">
              {description}
            </p>

            {/* Divider */}
            <div className="h-px mx-auto max-w-[200px] mb-6 bg-[linear-gradient(90deg,transparent,var(--color-border-glass),transparent)]" />

            {/* Footer hint */}
            <p className="text-[0.78rem] text-text-muted m-0">
              Follow our updates to be the first to know when we launch.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
