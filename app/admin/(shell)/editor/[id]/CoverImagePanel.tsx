"use client";

import { useRef, useState, type DragEvent } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, LoaderCircle, Replace, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";
import { isImageFile, uploadImage } from "./editor-utils";

/** Cover image picker: upload (click or drop), preview, replace and remove (with undo). */
export function CoverImagePanel({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file || uploading) return;
    if (!isImageFile(file)) {
      toast.error("Choose an image file (JPG, PNG, WebP or GIF).");
      return;
    }
    setUploading(true);
    try {
      onChange(await uploadImage(file));
    } catch (err) {
      console.error("Cover upload failed:", err);
      toast.error("Couldn't upload the cover image. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove() {
    const previous = value;
    onChange("");
    toast("Cover image removed", { action: { label: "Undo", onClick: () => onChange(previous) } });
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    setDragging(false);
    handleFile(event.dataTransfer.files?.[0]);
  }

  return (
    <Panel
      title="Cover image"
      description="Shown at the top of the post and when it's shared. Use 16:9, at least 1200px wide."
      bodyClassName="p-4"
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {value ? (
        <>
          <div className="relative aspect-video overflow-hidden rounded-lg border border-border-glass bg-bg-secondary">
            <Image src={value} alt="Cover image preview" fill sizes="(min-width: 1024px) 320px, 100vw" className="object-cover" />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-bg-primary/80 text-sm text-text-secondary">
                <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
                Uploading…
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              <Replace size={14} />
              Replace
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              disabled={uploading}
              onClick={remove}
              className="text-text-muted hover:text-red-600 dark:hover:text-red-400"
            >
              <Trash2 size={14} />
              Remove
            </Button>
          </div>
        </>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex aspect-video w-full flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-border-glass-hover px-4 text-center transition-colors",
            "hover:border-accent-blue hover:bg-accent-blue-glow-soft disabled:pointer-events-none",
            dragging && "border-accent-blue bg-accent-blue-glow-soft"
          )}
        >
          {uploading ? (
            <LoaderCircle size={18} className="animate-spin text-text-muted" aria-hidden="true" />
          ) : (
            <ImagePlus size={18} className="text-text-muted" aria-hidden="true" />
          )}
          <span className="text-sm font-medium text-text-primary">
            {uploading ? "Uploading…" : "Upload cover image"}
          </span>
          {!uploading && <span className="text-xs text-text-muted">Click to choose, or drop an image here</span>}
        </button>
      )}
    </Panel>
  );
}
