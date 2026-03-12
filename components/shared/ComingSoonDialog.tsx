"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

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
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent 
        className="w-full max-w-[440px] overflow-hidden rounded-2xl border border-border-glass backdrop-blur-[24px] shadow-[0_24px_80px_rgba(0,0,0,0.6)] p-0 sm:rounded-2xl gap-0"
        style={{ backgroundColor: "var(--surface-dialog)" }}
        showCloseButton={false}
      >
        {/* Glow accents */}
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-accent-blue opacity-[0.08] blur-[50px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-cta-yellow opacity-[0.06] blur-[40px] pointer-events-none" />

        {/* Close button */}
        <DialogClose asChild>
          <button
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-text-muted hover:text-text-primary hover:bg-[rgba(255,255,255,0.1)] transition-all duration-300 ease-smooth cursor-pointer"
            aria-label="Close dialog"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </DialogClose>

        <div className="relative p-8 md:p-10 text-center flex flex-col items-center">
          {/* Animated icon */}
          <div className="mb-6 w-16 h-16 rounded-2xl bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue-light">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </div>

          {/* Status badge */}
          <div className="mb-5">
            <Badge variant="warning">
              <span className="relative flex h-1.5 w-1.5 mr-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cta-yellow opacity-75 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cta-yellow" />
              </span>
              In Development
            </Badge>
          </div>

          <DialogHeader className="mb-3 p-0 items-center">
            <DialogTitle className="text-[1.4rem] font-bold leading-[1.2] tracking-tight text-text-primary text-center">
              {title}
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="text-[0.92rem] leading-relaxed text-text-secondary mb-8 text-center m-0">
            {description}
          </DialogDescription>

          {/* Divider */}
          <div className="h-px w-full max-w-[200px] mb-6 bg-[linear-gradient(90deg,transparent,var(--color-border-glass),transparent)]" />

          {/* Footer hint */}
          <p className="text-[0.78rem] text-text-muted m-0">
            Follow our updates to be the first to know when we launch.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
