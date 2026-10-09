"use client";

import { use, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, useEditorState, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import YoutubeExtension from "@tiptap/extension-youtube";
import slugify from "slugify";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { ArrowLeft, Check, ExternalLink, Eye, LoaderCircle, Plus, Save, Send, Sparkles, X } from "lucide-react";
import { CustomButtonExtension } from "@/components/editor/CustomButtonExtension";
import { getPost, getPostCategories, savePost } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  adminInputClass,
  adminLabelClass,
  adminTextareaClass,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { runAction } from "@/components/admin/run-action";
import { cn } from "@/lib/utils";
import { EditorToolbar } from "./EditorToolbar";
import { CoverImagePanel } from "./CoverImagePanel";
import { PreviewDialog } from "./PreviewDialog";
import { useLeaveGuard } from "./use-leave-guard";
import { EXCERPT_MAX, EXCERPT_MIN, countWords, readingMinutes } from "./editor-utils";

// Keep in sync with DEFAULT_POST_CATEGORIES in app/admin/actions.ts
const DEFAULT_CATEGORIES = [
  "Tutorial",
  "Tech News",
  "Tech Tips",
  "Opinion",
  "Case Study",
  "Engineering",
  "Daily Courses",
];

type LoadState = "loading" | "ready" | "not-found" | "error";
type SavedPost = { published: boolean; slug: string; updatedAt: Date };

const toSlug = (value: string) => slugify(value, { lower: true, strict: true });

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const confirm = useConfirm();
  const titleRef = useRef<HTMLTextAreaElement>(null);

  const [loadState, setLoadState] = useState<LoadState>(isNew ? "ready" : "loading");
  const [saved, setSaved] = useState<SavedPost | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  const [isDirty, setIsDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [saveError, setSaveError] = useState("");
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [preview, setPreview] = useState<{ open: boolean; html: string }>({ open: false, html: "" });

  const editor = useEditor({
    extensions: [
      // Link and Underline are registered below with their own options, so StarterKit
      // must not register second copies (duplicates made links open on click).
      StarterKit.configure({ link: false, underline: false }),
      Underline,
      TiptapLink.extend({
        inclusive: false,
      }).configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent-blue-light underline decoration-accent-blue-light/50 underline-offset-2 hover:text-accent-blue transition-colors cursor-pointer",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      TextStyle,
      Color,
      CustomButtonExtension,
      YoutubeExtension.configure({
        HTMLAttributes: {
          class: "w-full aspect-video rounded-xl border border-border-glass my-6",
        },
      }),
      TiptapImage.configure({
        HTMLAttributes: {
          class: "rounded-none border border-border-glass max-w-full h-auto my-6",
        },
      }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose article min-h-[420px] px-5 py-6 focus:outline-none md:px-8 md:py-8",
        "aria-label": "Post content",
      },
    },
    onUpdate: ({ editor: e }) => {
      setIsDirty(true);
      setWordCount(countWords(e.getText()));
    },
  });

  const editorIsEmpty = useEditorState({ editor, selector: ({ editor: e }) => e?.isEmpty ?? true });

  useLeaveGuard(isDirty);

  // Categories: defaults plus every category already used by a post.
  useEffect(() => {
    let cancelled = false;
    getPostCategories()
      .then((loaded) => {
        if (!cancelled && loaded.length > 0) {
          setCategories((prev) => Array.from(new Set([...loaded, ...prev])).sort());
        }
      })
      .catch((err) => console.error("Failed to load categories:", err));
    return () => {
      cancelled = true;
    };
  }, []);

  // Existing post: load it into the form and the editor.
  useEffect(() => {
    if (isNew || !editor) return;
    let cancelled = false;
    getPost(id)
      .then((post) => {
        if (cancelled) return;
        if (!post) {
          setLoadState("not-found");
          return;
        }
        const postCategory = post.category ?? "";
        setTitle(post.title);
        setSlug(post.slug);
        setExcerpt(post.excerpt ?? "");
        setCoverImage(post.coverImage ?? "");
        setCategory(postCategory);
        if (postCategory) {
          setCategories((prev) => (prev.includes(postCategory) ? prev : [...prev, postCategory].sort()));
        }
        setSaved({ published: post.published, slug: post.slug, updatedAt: new Date(post.updatedAt) });
        // emitUpdate: false so loading the post doesn't count as an unsaved change
        editor.commands.setContent(post.content, { emitUpdate: false });
        setWordCount(countWords(editor.getText()));
        setIsDirty(false);
        setLoadState("ready");
      })
      .catch((err) => {
        console.error("Failed to load post:", err);
        if (!cancelled) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [editor, id, isNew]);

  // The title is a textarea so long titles wrap; grow it to fit its content.
  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [title, loadState, editor]);

  const isPublished = saved?.published ?? false;
  const autoSlug = toSlug(title);
  const finalSlug = slug ? toSlug(slug) : autoSlug;
  const slugChangesLiveUrl = Boolean(saved?.published && finalSlug && finalSlug !== saved.slug);
  const excerptLength = excerpt.trim().length;
  const minutes = readingMinutes(wordCount);

  async function handleSave(publish: boolean) {
    if (!editor || saving) return;

    if (!title.trim()) {
      setSaveError("Add a title before saving.");
      titleRef.current?.focus();
      return;
    }

    if (!publish && isPublished) {
      const ok = await confirm({
        title: "Unpublish this post?",
        description: "Your changes will be saved and the post will be taken off the blog until you publish it again.",
        confirmLabel: "Unpublish",
      });
      if (!ok) return;
    }

    setSaveError("");
    setSaving(publish ? "publish" : "draft");

    const successMessage = publish
      ? isPublished
        ? "Post updated"
        : "Post published"
      : isPublished
        ? "Post unpublished and saved as a draft"
        : "Draft saved";

    const result = await runAction(
      savePost({
        id,
        title,
        slug,
        content: editor.getHTML(),
        excerpt,
        coverImage,
        category,
        published: publish,
      }).then((res) => {
        // Keep the reason on the page as well as in the toast, so it can be fixed (e.g. a slug clash).
        if (!res.ok) setSaveError(res.error);
        return res;
      }),
      successMessage
    );

    if (!result) {
      setSaving(null);
      return;
    }

    setIsDirty(false);
    router.push("/admin/posts");
    router.refresh();
  }

  async function generateSummary() {
    if (!editor || generatingSummary) return;

    const text = editor.getText().trim();
    if (text.length < 50) {
      toast.error("Write a few sentences first. The summary is generated from the post content.");
      return;
    }

    setGeneratingSummary(true);
    try {
      const res = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
      const data: { summary?: unknown; error?: unknown } = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.summary !== "string") {
        throw new Error(typeof data.error === "string" ? data.error : "Couldn't generate a summary. Please try again.");
      }

      const previous = excerpt;
      setExcerpt(data.summary);
      setIsDirty(true);
      toast.success(
        "Summary generated",
        previous.trim() ? { action: { label: "Undo", onClick: () => setExcerpt(previous) } } : undefined
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't generate a summary. Please try again.");
    } finally {
      setGeneratingSummary(false);
    }
  }

  function addCategory(event: FormEvent) {
    event.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    const formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    setCategories((prev) => (prev.includes(formatted) ? prev : [...prev, formatted].sort()));
    setCategory(formatted);
    setIsDirty(true);
    setNewCategory("");
    setAddingCategory(false);
  }

  function cancelAddCategory() {
    setNewCategory("");
    setAddingCategory(false);
  }

  function openPreview() {
    if (!editor) return;
    setPreview({ open: true, html: editor.isEmpty ? "" : editor.getHTML() });
  }

  const backLink = (
    <Link
      href="/admin/posts"
      className="mb-3 inline-flex items-center gap-1 rounded text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
    >
      <ArrowLeft size={14} aria-hidden="true" />
      All posts
    </Link>
  );

  if (loadState === "not-found" || loadState === "error") {
    return (
      <div>
        {backLink}
        <PageHeader title="Edit post" />
        <Panel>
          <EmptyState
            title={loadState === "not-found" ? "Post not found" : "Couldn't load this post"}
            description={
              loadState === "not-found"
                ? "It may have been deleted. Go back to the list to pick another post."
                : "Check your connection and reload the page. If your session expired, sign in again."
            }
            action={
              loadState === "error" ? (
                <Button variant="outline" size="xs" onClick={() => window.location.reload()}>
                  Reload
                </Button>
              ) : (
                <Button asChild variant="outline" size="xs">
                  <Link href="/admin/posts">Back to posts</Link>
                </Button>
              )
            }
          />
        </Panel>
      </div>
    );
  }

  if (loadState === "loading" || !editor) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-text-muted" role="status">
        <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
        Loading editor…
      </div>
    );
  }

  return (
    <div>
      {backLink}
      <PageHeader
        title={isNew ? "New post" : "Edit post"}
        description={
          saved ? (
            <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
              <StatusBadge status={isPublished ? "published" : "draft"} />
              {isPublished && (
                <a
                  href={`/blog/${saved.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
                >
                  View on blog
                  <ExternalLink size={12} aria-hidden="true" />
                </a>
              )}
            </span>
          ) : (
            "Drafts stay private until you publish them."
          )
        }
        actions={
          <>
            <Button type="button" variant="ghost" size="xs" onClick={openPreview}>
              <Eye size={14} />
              Preview
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              disabled={saving !== null}
              onClick={() => handleSave(false)}
              title={isPublished ? "Save your changes and take the post off the blog" : undefined}
            >
              {saving === "draft" ? <LoaderCircle size={14} className="animate-spin" /> : <Save size={14} />}
              {isPublished ? "Unpublish" : "Save draft"}
            </Button>
            <Button type="button" size="xs" disabled={saving !== null} onClick={() => handleSave(true)}>
              {saving === "publish" ? <LoaderCircle size={14} className="animate-spin" /> : <Send size={14} />}
              {isPublished ? "Update" : "Publish"}
            </Button>
          </>
        }
      />

      {saveError && (
        <div
          role="alert"
          className="-mt-4 mb-6 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/6 px-3 py-2.5 text-sm text-red-700 dark:text-red-300"
        >
          <span className="min-w-0 flex-1">{saveError}</span>
          <button
            type="button"
            onClick={() => setSaveError("")}
            aria-label="Dismiss message"
            title="Dismiss"
            className="shrink-0 rounded p-0.5 opacity-70 transition-opacity hover:opacity-100"
          >
            <X size={14} aria-hidden="true" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* ─── Main column: title + content ─── */}
        <div className="min-w-0 rounded-xl border border-border-glass bg-bg-primary">
          <div className="px-5 pt-6 pb-3 md:px-8 md:pt-8">
            <label htmlFor="post-title" className="sr-only">
              Title
            </label>
            <textarea
              id="post-title"
              ref={titleRef}
              rows={1}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value.replace(/\s*\n+\s*/g, " "));
                setIsDirty(true);
              }}
              onKeyDown={(e) => {
                // Enter moves on to the content instead of adding a line break
                if (e.key === "Enter") {
                  e.preventDefault();
                  editor.commands.focus("start");
                }
              }}
              placeholder="Post title"
              className="-mx-2 block w-[calc(100%+1rem)] resize-none overflow-hidden rounded-md bg-transparent px-2 text-[1.75rem] font-bold leading-tight tracking-tight text-text-primary outline-none placeholder:text-text-muted/60 focus-visible:ring-2 focus-visible:ring-accent-blue/20 md:text-[2rem]"
            />
          </div>

          <EditorToolbar
            editor={editor}
            className="sticky top-14 z-20 overflow-x-auto border-y border-border-glass bg-bg-secondary px-2 py-1 [scrollbar-width:none] md:top-0 md:flex-wrap md:overflow-visible"
          />

          <div className="relative">
            {editorIsEmpty && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-5 top-6 text-[1.0625rem] leading-[1.75] text-text-muted md:left-8 md:top-8 md:text-[1.125rem]"
              >
                Start writing your post…
              </div>
            )}
            <EditorContent editor={editor} />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border-glass px-5 py-2.5 text-xs text-text-muted md:px-8">
            <span className="tabular-nums">
              {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"} · {minutes} min read
            </span>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cta-yellow" aria-hidden="true" />
                Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* ─── Side column: settings ─── */}
        <div className="space-y-6">
          <Panel title="Post settings" bodyClassName="space-y-5 p-4">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-text-secondary">Status</span>
                <StatusBadge
                  status={isPublished ? "published" : "draft"}
                  label={saved ? undefined : "Draft, not saved yet"}
                />
              </div>
              <p className="mt-1 text-xs text-text-muted">
                {isPublished ? "Visible on the blog." : "Only admins can see drafts."}
                {saved && ` Updated ${formatDistanceToNow(saved.updatedAt, { addSuffix: true })}.`}
              </p>
            </div>

            <div>
              <label htmlFor="post-slug" className={adminLabelClass}>
                URL slug
              </label>
              <div className="flex h-9 items-center rounded-md border border-border-glass bg-bg-primary transition-colors hover:border-border-glass-hover focus-within:border-accent-blue focus-within:ring-2 focus-within:ring-accent-blue/20">
                <span className="select-none pl-3 text-sm text-text-muted">/blog/</span>
                <input
                  id="post-slug"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsDirty(true);
                  }}
                  placeholder={autoSlug || "post-url"}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-describedby="post-slug-hint"
                  className="h-full min-w-0 flex-1 bg-transparent pr-3 font-mono text-[13px] text-text-primary outline-none placeholder:text-text-muted"
                />
              </div>
              <p id="post-slug-hint" className="mt-1.5 text-xs text-text-muted">
                {slug ? (
                  <>
                    Saved as <span className="font-mono text-text-secondary">/blog/{finalSlug || "…"}</span>
                  </>
                ) : (
                  "Leave empty to build it from the title."
                )}
              </p>
              {slugChangesLiveUrl && (
                <p className="mt-1.5 text-xs text-amber-600 dark:text-amber-400">
                  This post is live. Changing the slug changes its URL, and existing links to it will stop working.
                </p>
              )}
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <label htmlFor={addingCategory ? "post-new-category" : "post-category"} className="text-xs font-medium text-text-secondary">
                  {addingCategory ? "New category" : "Category"}
                </label>
                {!addingCategory && (
                  <button
                    type="button"
                    onClick={() => setAddingCategory(true)}
                    className="inline-flex items-center gap-1 rounded text-xs font-medium text-accent-blue-light hover:underline"
                  >
                    <Plus size={12} aria-hidden="true" />
                    New category
                  </button>
                )}
              </div>
              {addingCategory ? (
                <form onSubmit={addCategory} className="flex items-center gap-1.5">
                  <input
                    id="post-new-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") cancelAddCategory();
                    }}
                    placeholder="e.g. AI & ML"
                    autoFocus
                    autoComplete="off"
                    className={adminInputClass}
                  />
                  <Button
                    type="submit"
                    size="icon-xs"
                    disabled={!newCategory.trim()}
                    aria-label="Add category"
                    title="Add category"
                  >
                    <Check size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    onClick={cancelAddCategory}
                    aria-label="Cancel"
                    title="Cancel"
                  >
                    <X size={14} />
                  </Button>
                </form>
              ) : (
                <select
                  id="post-category"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  className={adminInputClass}
                >
                  <option value="">No category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </Panel>

          <Panel
            title="Summary"
            description="Shown under the title, in search results and when the post is shared."
            bodyClassName="p-4"
          >
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="post-excerpt" className="text-xs font-medium text-text-secondary">
                Excerpt
              </label>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={generateSummary}
                disabled={generatingSummary}
                className="-mr-2 h-7 px-2 text-text-secondary"
              >
                {generatingSummary ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}
                {generatingSummary ? "Generating…" : "Generate with AI"}
              </Button>
            </div>
            <textarea
              id="post-excerpt"
              value={excerpt}
              onChange={(e) => {
                setExcerpt(e.target.value);
                setIsDirty(true);
              }}
              rows={4}
              placeholder="One or two sentences that tell readers what they will learn."
              aria-describedby="post-excerpt-hint"
              className={cn(adminTextareaClass, "min-h-28 resize-y")}
            />
            <p id="post-excerpt-hint" className="mt-1.5 text-xs tabular-nums text-text-muted">
              {excerptLength === 0 ? (
                `Aim for ${EXCERPT_MIN}–${EXCERPT_MAX} characters.`
              ) : excerptLength < EXCERPT_MIN ? (
                `${excerptLength} characters. A little short; aim for ${EXCERPT_MIN}–${EXCERPT_MAX}.`
              ) : excerptLength <= EXCERPT_MAX ? (
                <span className="inline-flex items-center gap-1 text-text-secondary">
                  <Check size={12} aria-hidden="true" />
                  {excerptLength} characters. Good length.
                </span>
              ) : (
                <span className="text-amber-600 dark:text-amber-400">
                  {excerptLength} characters. Search results may cut it off after {EXCERPT_MAX}.
                </span>
              )}
            </p>
          </Panel>

          <CoverImagePanel
            value={coverImage}
            onChange={(url) => {
              setCoverImage(url);
              setIsDirty(true);
            }}
          />
        </div>
      </div>

      <PreviewDialog
        open={preview.open}
        onOpenChange={(open) => setPreview((prev) => ({ ...prev, open }))}
        html={preview.html}
        title={title}
        excerpt={excerpt}
        category={category}
        coverImage={coverImage}
        minutes={minutes}
      />
    </div>
  );
}
