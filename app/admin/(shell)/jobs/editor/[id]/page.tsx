"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import slugify from "slugify";
import { toast } from "sonner";
import {
  AlertCircle,
  ArrowLeft,
  Bold,
  Briefcase,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  Heading2,
  Heading3,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Quote,
  Save,
  Send,
  Underline as UnderlineIcon,
  Unlink,
  X,
} from "lucide-react";
import { getJob, saveJob } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  adminInputClass,
  adminLabelClass,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { cn } from "@/lib/utils";

// Keep JOB_TYPES in sync with ../../JobsClient.tsx
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const JOB_CATEGORIES = [
  "Engineering", "Design", "Product", "Marketing",
  "Sales", "Operations", "Data Science", "DevOps",
  "Mobile", "Frontend", "Backend", "Fullstack", "Other",
];

type JobForm = {
  title: string;
  slug: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  applyUrl: string;
  category: string;
};
type FieldKey = keyof JobForm;
type FieldErrors = Partial<Record<FieldKey, string>>;
type LoadState = "loading" | "ready" | "not-found" | "error";

const EMPTY_FORM: JobForm = {
  title: "",
  slug: "",
  company: "",
  location: "",
  type: "Full-time",
  salary: "",
  applyUrl: "",
  category: "",
};

/** Fields saveJob requires, in the order they appear on the page. */
const REQUIRED_FIELDS: { key: FieldKey; label: string }[] = [
  { key: "title", label: "Job title" },
  { key: "company", label: "Company" },
  { key: "location", label: "Location" },
  { key: "type", label: "Job type" },
  { key: "applyUrl", label: "Apply link or email" },
];

const toSlug = (value: string) => slugify(value, { lower: true, strict: true });
const fieldId = (key: FieldKey) => `job-${key}`;

const invalidInputClass =
  "border-red-500/60 hover:border-red-500/60 focus-visible:border-red-500 focus-visible:ring-red-500/20";

function validate(form: JobForm): FieldErrors {
  const errors: FieldErrors = {};
  for (const { key, label } of REQUIRED_FIELDS) {
    if (!form[key].trim()) errors[key] = `${label} is required.`;
  }
  if (!errors.title && !toSlug(form.slug || form.title)) {
    errors.slug = "The URL slug needs at least one letter or number.";
  }
  return errors;
}

/** Turn "example.com" into "https://example.com" and bare emails into mailto: links. */
function normalizeHref(url: string) {
  if (/^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url)) return url;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url)) return `mailto:${url}`;
  return `https://${url}`;
}

export default function JobEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const confirm = useConfirm();

  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [published, setPublished] = useState(false);
  const [savedSlug, setSavedSlug] = useState("");
  const [loadState, setLoadState] = useState<LoadState>(isNew ? "ready" : "loading");
  const [reloadKey, setReloadKey] = useState(0);

  const [saving, setSaving] = useState<"draft" | "publish" | null>(null);
  const [saveError, setSaveError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isDirty, setIsDirty] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  // Counts edits, so a save only clears "unsaved" if nothing changed while it was running
  const changeCount = useRef(0);
  const markDirty = useCallback(() => {
    changeCount.current += 1;
    setIsDirty(true);
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    // StarterKit v3 already includes Link and Underline; configure them here instead of adding duplicates
    extensions: [StarterKit.configure({ link: { openOnClick: false } })],
    content: "",
    onUpdate: () => markDirty(),
    editorProps: {
      attributes: {
        class: "prose article min-h-[360px] px-5 py-4 focus:outline-none",
        "aria-labelledby": "job-description-label",
        "aria-multiline": "true",
        role: "textbox",
      },
    },
  });

  // Load the job (existing jobs only)
  useEffect(() => {
    if (isNew || !editor) return;
    let cancelled = false;

    getJob(id)
      .then((job) => {
        if (cancelled) return;
        if (!job) {
          setLoadState("not-found");
          return;
        }
        setForm({
          title: job.title,
          slug: job.slug,
          company: job.company,
          location: job.location,
          type: job.type,
          salary: job.salary || "",
          applyUrl: job.applyUrl.replace(/^mailto:/, ""),
          category: job.category || "",
        });
        setPublished(job.published);
        setSavedSlug(job.slug);
        // emitUpdate: false, so loading the description doesn't count as an unsaved change
        editor.commands.setContent(job.description, { emitUpdate: false });
        setIsDirty(false);
        setLoadState("ready");
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setLoadState("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id, isNew, editor, reloadKey]);

  // Unsaved changes warning when closing or reloading the tab
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateField = (key: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    markDirty();
  };

  const handleSave = async (publish: boolean) => {
    if (!editor || saving) return;

    const errors = validate(form);
    setFieldErrors(errors);
    const firstInvalid = (Object.keys(errors) as FieldKey[])[0];
    if (firstInvalid) {
      setSaveError("");
      toast.error("Fill in the required fields before saving.");
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    const editsAtStart = changeCount.current;
    const wasPublished = published;
    setSaving(publish ? "publish" : "draft");
    setSaveError("");

    try {
      const result = await saveJob({
        id,
        title: form.title.trim(),
        slug: form.slug.trim() || undefined,
        company: form.company.trim(),
        location: form.location.trim(),
        type: form.type,
        salary: form.salary.trim(),
        description: editor.getHTML(),
        applyUrl: form.applyUrl.trim(),
        category: form.category,
        published: publish,
      });

      if (!result.ok) {
        setSaveError(result.error);
        toast.error(result.error);
        return;
      }

      if (changeCount.current === editsAtStart) setIsDirty(false);
      setPublished(publish);
      setSavedSlug(result.data.slug);
      setForm((prev) => ({ ...prev, slug: result.data.slug }));

      if (publish) {
        toast.success(wasPublished ? "Job updated" : "Job published");
        router.push("/admin/jobs");
      } else {
        toast.success(wasPublished ? "Job unpublished and saved as a draft" : "Draft saved");
        if (isNew) router.replace(`/admin/jobs/editor/${result.data.id}`);
      }
    } catch (err) {
      console.error(err);
      const message = "Couldn't reach the server. Check your connection and try again.";
      setSaveError(message);
      toast.error(message);
    } finally {
      setSaving(null);
    }
  };

  const handleBack = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab/window) through, and don't ask when nothing changed
    if (!isDirty || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const discard = await confirm({
      title: "Discard unsaved changes?",
      description: "Your changes to this job haven't been saved and will be lost.",
      confirmLabel: "Discard changes",
      destructive: true,
    });
    if (discard) {
      setIsDirty(false);
      router.push("/admin/jobs");
    }
  };

  const openPreview = () => {
    if (!editor) return;
    setPreviewHtml(editor.isEmpty ? "" : editor.getHTML());
  };

  const retryLoad = () => {
    setLoadState("loading");
    setReloadKey((k) => k + 1);
  };

  const ready = loadState === "ready";
  const busy = saving !== null || !editor;

  const inputClass = (key: FieldKey, extra?: string) =>
    cn(adminInputClass, extra, fieldErrors[key] && invalidInputClass);
  const a11y = (key: FieldKey, hasHint = false) => ({
    id: fieldId(key),
    "aria-invalid": fieldErrors[key] ? true : undefined,
    "aria-describedby": fieldErrors[key]
      ? `${fieldId(key)}-error`
      : hasHint
        ? `${fieldId(key)}-hint`
        : undefined,
  });

  const slugPreview = toSlug(form.slug || form.title);
  const slugChangedOnLiveJob = published && savedSlug !== "" && slugPreview !== savedSlug;
  const typeOptions = form.type && !JOB_TYPES.includes(form.type) ? [form.type, ...JOB_TYPES] : JOB_TYPES;
  const categoryOptions =
    form.category && !JOB_CATEGORIES.includes(form.category)
      ? [form.category, ...JOB_CATEGORIES]
      : JOB_CATEGORIES;

  const headerDescription = (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <span>
        {isNew
          ? "Save it as a draft, or publish it to the job board."
          : published
            ? "This job is live on the job board."
            : "This draft isn't visible on the job board yet."}
      </span>
      {isDirty && <StatusBadge status="hidden" label="Unsaved changes" />}
    </span>
  );

  const headerActions = ready ? (
    <>
      <Button type="button" variant="ghost" size="xs" onClick={openPreview} disabled={!editor}>
        <Eye size={14} />
        Preview
      </Button>
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={() => handleSave(false)}
        disabled={busy}
      >
        {saving === "draft" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : published ? (
          <EyeOff size={14} />
        ) : (
          <Save size={14} />
        )}
        {published ? "Unpublish" : "Save draft"}
      </Button>
      <Button type="button" size="xs" onClick={() => handleSave(true)} disabled={busy}>
        {saving === "publish" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : published ? (
          <Check size={14} />
        ) : (
          <Send size={14} />
        )}
        {published ? "Update" : "Publish"}
      </Button>
    </>
  ) : undefined;

  return (
    <div>
      <Link
        href="/admin/jobs"
        onClick={handleBack}
        className="mb-3 inline-flex items-center gap-1 text-xs font-medium text-text-muted transition-colors hover:text-text-primary"
      >
        <ArrowLeft size={14} />
        Back to jobs
      </Link>

      <PageHeader
        title={isNew ? "New job" : "Edit job"}
        description={ready ? headerDescription : undefined}
        actions={headerActions}
      />

      {loadState === "loading" && <EditorSkeleton />}

      {loadState === "not-found" && (
        <Panel>
          <EmptyState
            icon={Briefcase}
            title="Job not found"
            description="This listing doesn't exist any more. It may have been deleted."
            action={
              <Button asChild variant="outline" size="xs">
                <Link href="/admin/jobs">
                  <ArrowLeft size={14} />
                  Back to jobs
                </Link>
              </Button>
            }
          />
        </Panel>
      )}

      {loadState === "error" && (
        <Panel>
          <EmptyState
            icon={AlertCircle}
            title="Couldn't load this job"
            description="Check your connection and try again. If you were signed out, sign in again first."
            action={
              <Button type="button" variant="outline" size="xs" onClick={retryLoad}>
                Try again
              </Button>
            }
          />
        </Panel>
      )}

      {ready && (
        <>
          {saveError && (
            <div
              role="alert"
              className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/6 px-4 py-3 text-sm text-red-700 dark:text-red-400"
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <div className="font-medium">The job wasn&apos;t saved</div>
                <div className="mt-0.5">{saveError}</div>
              </div>
              <button
                type="button"
                onClick={() => setSaveError("")}
                aria-label="Dismiss error"
                title="Dismiss"
                className="inline-flex size-6 shrink-0 items-center justify-center rounded opacity-70 transition-opacity hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            {/* Main column */}
            <div className="min-w-0 space-y-5">
              <div>
                <label htmlFor={fieldId("title")} className={adminLabelClass}>
                  Job title <span className="text-text-muted">*</span>
                </label>
                <input
                  {...a11y("title")}
                  type="text"
                  value={form.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="e.g. Senior React Developer"
                  className={inputClass("title", "h-10 text-base font-medium")}
                />
                <FieldError id={fieldId("title")} error={fieldErrors.title} />
              </div>

              <div>
                <div id="job-description-label" className={adminLabelClass}>
                  Description
                </div>
                <div className="rounded-xl border border-border-glass bg-bg-card transition-colors focus-within:border-border-glass-hover">
                  <EditorToolbar editor={editor} />
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            {/* Side column */}
            <Panel title="Details" bodyClassName="space-y-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-text-secondary">Status</span>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={published ? "published" : "draft"}
                    label={isNew ? "Not saved yet" : undefined}
                  />
                  {published && savedSlug && (
                    <a
                      href={`/jobs/${savedSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent-blue-light hover:underline"
                    >
                      View live
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor={fieldId("company")} className={adminLabelClass}>
                  Company <span className="text-text-muted">*</span>
                </label>
                <input
                  {...a11y("company")}
                  type="text"
                  value={form.company}
                  onChange={(e) => updateField("company", e.target.value)}
                  placeholder="e.g. Andela"
                  className={inputClass("company")}
                />
                <FieldError id={fieldId("company")} error={fieldErrors.company} />
              </div>

              <div>
                <label htmlFor={fieldId("location")} className={adminLabelClass}>
                  Location <span className="text-text-muted">*</span>
                </label>
                <input
                  {...a11y("location")}
                  type="text"
                  value={form.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  placeholder="e.g. Remote · Lagos, Nigeria"
                  className={inputClass("location")}
                />
                <FieldError id={fieldId("location")} error={fieldErrors.location} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor={fieldId("type")} className={adminLabelClass}>
                    Type <span className="text-text-muted">*</span>
                  </label>
                  <select
                    {...a11y("type")}
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    className={inputClass("type")}
                  >
                    {typeOptions.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  <FieldError id={fieldId("type")} error={fieldErrors.type} />
                </div>
                <div>
                  <label htmlFor={fieldId("category")} className={adminLabelClass}>
                    Category
                  </label>
                  <select
                    {...a11y("category")}
                    value={form.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={inputClass("category")}
                  >
                    <option value="">None</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={fieldId("salary")} className={adminLabelClass}>
                  Salary range
                </label>
                <input
                  {...a11y("salary", true)}
                  type="text"
                  value={form.salary}
                  onChange={(e) => updateField("salary", e.target.value)}
                  placeholder="e.g. $80k–$120k / ₦500k–₦800k"
                  className={inputClass("salary")}
                />
                <FieldHint id={fieldId("salary")}>Optional.</FieldHint>
              </div>

              <div>
                <label htmlFor={fieldId("applyUrl")} className={adminLabelClass}>
                  Apply link or email <span className="text-text-muted">*</span>
                </label>
                <input
                  {...a11y("applyUrl", true)}
                  type="text"
                  inputMode="url"
                  value={form.applyUrl}
                  onChange={(e) => updateField("applyUrl", e.target.value)}
                  placeholder="https://… or hiring@company.com"
                  className={inputClass("applyUrl")}
                />
                {fieldErrors.applyUrl ? (
                  <FieldError id={fieldId("applyUrl")} error={fieldErrors.applyUrl} />
                ) : (
                  <FieldHint id={fieldId("applyUrl")}>
                    An email address becomes a mailto: link.
                  </FieldHint>
                )}
              </div>

              <div>
                <label htmlFor={fieldId("slug")} className={adminLabelClass}>
                  URL slug
                </label>
                <input
                  {...a11y("slug", true)}
                  type="text"
                  value={form.slug}
                  onChange={(e) => updateField("slug", e.target.value)}
                  placeholder="Generated from the title"
                  className={inputClass("slug", "font-mono text-xs")}
                />
                {fieldErrors.slug ? (
                  <FieldError id={fieldId("slug")} error={fieldErrors.slug} />
                ) : (
                  <FieldHint id={fieldId("slug")}>
                    <span className="break-all font-mono">/jobs/{slugPreview || "…"}</span>
                    {slugChangedOnLiveJob && (
                      <span className="mt-1 block text-amber-600 dark:text-amber-400">
                        This job is live. Changing the slug changes its public URL.
                      </span>
                    )}
                  </FieldHint>
                )}
              </div>
            </Panel>
          </div>
        </>
      )}

      {/* Preview */}
      <Dialog open={previewHtml !== null} onOpenChange={(open) => !open && setPreviewHtml(null)}>
        <DialogContent className="max-h-[85vh] gap-5 overflow-y-auto p-6 sm:max-w-2xl">
          <DialogHeader className="pr-8">
            <div className="text-xs font-medium text-text-muted">Preview</div>
            <DialogTitle className="text-xl font-bold leading-tight tracking-tight text-text-primary">
              {form.title || "Untitled job"}
            </DialogTitle>
            <DialogDescription className="text-sm text-text-secondary">
              {[form.company || "Company not set", form.location, form.type, form.salary, form.category]
                .filter(Boolean)
                .join(" · ")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border-glass bg-bg-secondary px-3 py-2 text-xs">
            <span className="shrink-0 text-text-muted">Apply via</span>
            <span className="truncate font-mono text-text-primary">{form.applyUrl || "Not set"}</span>
          </div>

          {previewHtml ? (
            <div className="prose article" dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <div className="text-sm text-text-muted">No description yet.</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function FieldError({ id, error }: { id: string; error?: string }) {
  if (!error) return null;
  return (
    <div id={`${id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
      {error}
    </div>
  );
}

function FieldHint({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div id={`${id}-hint`} className="mt-1.5 text-xs text-text-muted">
      {children}
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div
      role="status"
      className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]"
    >
      <span className="sr-only">Loading job…</span>
      <div className="space-y-5">
        <div>
          <Skeleton className="mb-2 h-3 w-16 bg-text-primary/6" />
          <Skeleton className="h-10 w-full bg-text-primary/6" />
        </div>
        <div>
          <Skeleton className="mb-2 h-3 w-20 bg-text-primary/6" />
          <Skeleton className="h-105 w-full rounded-xl bg-text-primary/6" />
        </div>
      </div>
      <Skeleton className="h-120 w-full rounded-xl bg-text-primary/6" />
    </div>
  );
}

/* ─── Formatting toolbar ─── */

function ToolbarButton({
  label,
  icon: Icon,
  active,
  disabled,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-xs"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      aria-pressed={active === undefined ? undefined : active}
      className={cn(
        "text-text-muted hover:text-text-primary",
        active && "bg-text-primary/[0.07] text-text-primary"
      )}
    >
      <Icon size={15} />
    </Button>
  );
}

function ToolbarDivider() {
  return <div className="mx-1 h-5 w-px bg-border-glass" aria-hidden="true" />;
}

function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");

  // Re-render the toolbar on selection/content changes so active states stay correct
  const active = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e?.isActive("bold") ?? false,
      italic: e?.isActive("italic") ?? false,
      underline: e?.isActive("underline") ?? false,
      h2: e?.isActive("heading", { level: 2 }) ?? false,
      h3: e?.isActive("heading", { level: 3 }) ?? false,
      bulletList: e?.isActive("bulletList") ?? false,
      orderedList: e?.isActive("orderedList") ?? false,
      blockquote: e?.isActive("blockquote") ?? false,
      link: e?.isActive("link") ?? false,
    }),
  });

  const disabled = !editor;

  const openLinkInput = () => {
    if (!editor) return;
    setLinkUrl((editor.getAttributes("link").href as string | undefined) ?? "");
    setLinkOpen(true);
  };

  const closeLinkInput = () => {
    setLinkOpen(false);
    setLinkUrl("");
  };

  const applyLink = () => {
    if (!editor) return;
    const url = linkUrl.trim();
    const chain = editor.chain().focus().extendMarkRange("link");
    if (url) chain.setLink({ href: normalizeHref(url), target: "_blank" }).run();
    else chain.unsetLink().run();
    closeLinkInput();
  };

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-14 z-10 flex flex-wrap items-center gap-0.5 rounded-t-xl border-b border-border-glass bg-bg-card px-2 py-1.5 md:top-0"
    >
      <ToolbarButton
        label="Bold"
        icon={Bold}
        active={active?.bold}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        icon={Italic}
        active={active?.italic}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        icon={UnderlineIcon}
        active={active?.underline}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="Heading 2"
        icon={Heading2}
        active={active?.h2}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="Heading 3"
        icon={Heading3}
        active={active?.h3}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <ToolbarDivider />

      <ToolbarButton
        label="Bulleted list"
        icon={List}
        active={active?.bulletList}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Numbered list"
        icon={ListOrdered}
        active={active?.orderedList}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="Quote"
        icon={Quote}
        active={active?.blockquote}
        disabled={disabled}
        onClick={() => editor?.chain().focus().toggleBlockquote().run()}
      />

      <ToolbarDivider />

      {linkOpen ? (
        <div className="flex items-center gap-1">
          <input
            type="text"
            inputMode="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                applyLink();
              } else if (e.key === "Escape") {
                e.preventDefault();
                closeLinkInput();
                editor?.commands.focus();
              }
            }}
            placeholder="https://…"
            aria-label="Link URL"
            autoFocus
            className={cn(adminInputClass, "h-8 w-48 text-xs sm:w-60")}
          />
          <ToolbarButton label="Apply link" icon={Check} onClick={applyLink} />
          <ToolbarButton
            label="Cancel"
            icon={X}
            onClick={() => {
              closeLinkInput();
              editor?.commands.focus();
            }}
          />
        </div>
      ) : (
        <>
          <ToolbarButton
            label={active?.link ? "Edit link" : "Add link"}
            icon={LinkIcon}
            active={active?.link}
            disabled={disabled}
            onClick={openLinkInput}
          />
          <ToolbarButton
            label="Remove link"
            icon={Unlink}
            disabled={disabled || !active?.link}
            onClick={() => editor?.chain().focus().extendMarkRange("link").unsetLink().run()}
          />
        </>
      )}
    </div>
  );
}
