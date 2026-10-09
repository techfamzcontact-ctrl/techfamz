"use client";

import Image from "next/image";
import { Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

/**
 * Shows the post laid out like the public article page (app/(site)/blog/[slug]):
 * category label, title, excerpt, reading time, cover image and the "prose article" body.
 */
export function PreviewDialog({
  open,
  onOpenChange,
  html,
  title,
  excerpt,
  category,
  coverImage,
  minutes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  html: string;
  title: string;
  excerpt: string;
  category: string;
  coverImage: string;
  minutes: number;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden border border-border-glass bg-bg-primary p-0 ring-0 sm:max-w-3xl">
        <div className="flex h-12 shrink-0 items-center gap-2 border-b border-border-glass pl-4 pr-14 text-xs text-text-muted">
          <Eye size={14} aria-hidden="true" />
          Preview: how readers will see this post
        </div>

        <div className="overflow-y-auto px-5 py-8 md:px-10 md:py-10">
          <article className="mx-auto max-w-180">
            <header className="mb-8">
              {category && <span className="eyebrow">{category}</span>}
              <DialogTitle className="mb-5 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-text-primary">
                {title.trim() || "Untitled post"}
              </DialogTitle>
              {excerpt.trim() ? (
                <DialogDescription className="mb-6 text-lg leading-relaxed text-text-secondary">
                  {excerpt}
                </DialogDescription>
              ) : (
                <DialogDescription className="sr-only">Preview of the post as readers will see it.</DialogDescription>
              )}
              <p className="text-sm text-text-muted">{minutes} min read</p>
            </header>

            {coverImage && (
              <div className="relative mb-10 aspect-video w-full overflow-hidden rounded-xl border border-border-glass bg-bg-secondary">
                <Image src={coverImage} alt={title || "Cover image"} fill sizes="(min-width: 768px) 720px, 100vw" className="object-cover" />
              </div>
            )}

            {html ? (
              <div className="prose article" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <p className="text-sm text-text-muted">Nothing written yet.</p>
            )}
          </article>
        </div>
      </DialogContent>
    </Dialog>
  );
}
