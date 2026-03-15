"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import {
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered,
  Quote, Heading2, Heading3, Link as LinkIcon, Unlink,
  Save, Send, Check, X, ArrowLeft
} from "lucide-react";
import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getJob, saveJob } from "../../../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];
const JOB_CATEGORIES = [
  "Engineering", "Design", "Product", "Marketing",
  "Sales", "Operations", "Data Science", "DevOps",
  "Mobile", "Frontend", "Backend", "Fullstack", "Other",
];

export default function JobEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [applyUrl, setApplyUrl] = useState("");
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputUrl, setLinkInputUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      TiptapLink.configure({ openOnClick: false }),
      Underline,
    ],
    content: "",
    onUpdate: () => setIsDirty(true),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-base max-w-none min-h-[300px] max-h-[500px] overflow-y-auto p-5 focus:outline-none bg-bg-primary border border-border-glass rounded-b-xl",
      },
    },
  });

  useEffect(() => {
    async function load() {
      const job = await getJob(resolvedParams.id);
      if (job) {
        setTitle(job.title);
        setSlug(job.slug);
        setCompany(job.company);
        setLocation(job.location);
        setType(job.type);
        setSalary(job.salary || "");
        setApplyUrl(job.applyUrl.replace(/^mailto:/, ""));
        setCategory(job.category || "");
        editor?.commands.setContent(job.description);
      }
      setLoading(false);
    }
    if (editor) load();
  }, [resolvedParams.id, editor]);

  // Unsaved changes warning
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const handleSave = useCallback(
    async (publish: boolean) => {
      if (!title.trim()) {
        setSaveError("Job title is required");
        return;
      }
      if (!company.trim()) {
        setSaveError("Company name is required");
        return;
      }
      if (!applyUrl.trim()) {
        setSaveError("Apply URL is required");
        return;
      }

      setSaving(true);
      setSaveError("");
      try {
        const result = await saveJob({
          id: resolvedParams.id,
          title,
          slug: slug || undefined,
          company,
          location,
          type,
          salary,
          description: editor?.getHTML() || "",
          applyUrl,
          category,
          published: publish,
        });
        setIsDirty(false);
        if (publish) {
          router.push("/admin/jobs");
        } else if (resolvedParams.id === "new") {
          router.replace(`/admin/jobs/editor/${result.id}`);
        }
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : "Save failed");
      } finally {
        setSaving(false);
      }
    },
    [title, slug, company, location, type, salary, applyUrl, category, editor, resolvedParams.id, router]
  );

  const handleSetLink = () => {
    if (linkInputUrl) {
      editor?.chain().focus().setLink({ href: linkInputUrl, target: "_blank" }).run();
    }
    setShowLinkInput(false);
    setLinkInputUrl("");
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[900px] mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/jobs"
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            {resolvedParams.id === "new" ? "Post New Job" : "Edit Job"}
          </h1>
        </div>
        {isDirty && (
          <span className="text-xs text-amber-400 font-semibold px-3 py-1 rounded-full border border-amber-400/30 bg-amber-400/10">
            Unsaved changes
          </span>
        )}
      </div>

      {saveError && (
        <div className="mb-6 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium">
          {saveError}
        </div>
      )}

      {/* Job Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="md:col-span-2">
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Job Title *</Label>
          <Input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
            placeholder="e.g. Senior React Developer"
            className="bg-bg-primary border-border-glass text-text-primary text-lg font-semibold h-12"
          />
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Company *</Label>
          <Input
            value={company}
            onChange={(e) => { setCompany(e.target.value); setIsDirty(true); }}
            placeholder="e.g. Andela"
            className="bg-bg-primary border-border-glass text-text-primary"
          />
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Location</Label>
          <Input
            value={location}
            onChange={(e) => { setLocation(e.target.value); setIsDirty(true); }}
            placeholder="e.g. Remote · Lagos, Nigeria"
            className="bg-bg-primary border-border-glass text-text-primary"
          />
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Job Type</Label>
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setIsDirty(true); }}
            className="w-full h-10 rounded-md border border-border-glass bg-bg-primary text-text-primary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Salary Range (optional)</Label>
          <Input
            value={salary}
            onChange={(e) => { setSalary(e.target.value); setIsDirty(true); }}
            placeholder="e.g. $80k–$120k / ₦500k–₦800k"
            className="bg-bg-primary border-border-glass text-text-primary"
          />
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Category</Label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setIsDirty(true); }}
            className="w-full h-10 rounded-md border border-border-glass bg-bg-primary text-text-primary px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
          >
            <option value="">Select category</option>
            {JOB_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Apply URL or Email *</Label>
          <Input
            value={applyUrl}
            onChange={(e) => { setApplyUrl(e.target.value); setIsDirty(true); }}
            placeholder="https://... or hiring@company.com"
            className="bg-bg-primary border-border-glass text-text-primary"
          />
        </div>

        <div>
          <Label className="text-text-muted text-xs uppercase tracking-wider mb-2 block">Custom URL Slug</Label>
          <Input
            value={slug}
            onChange={(e) => { setSlug(e.target.value); setIsDirty(true); }}
            placeholder="auto-generated from title"
            className="bg-bg-primary border-border-glass text-text-primary"
          />
        </div>
      </div>

      {/* Job Description Editor */}
      <div className="mb-8">
        <Label className="text-text-muted text-xs uppercase tracking-wider mb-3 block">Job Description</Label>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-bg-card border border-border-glass rounded-t-xl border-b-0">
          <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("bold") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><Bold size={16} /></button>
          <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("italic") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><Italic size={16} /></button>
          <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("underline") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><UnderlineIcon size={16} /></button>

          <div className="w-px h-6 bg-border-glass mx-1" />

          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("heading", { level: 2 }) ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><Heading2 size={16} /></button>
          <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("heading", { level: 3 }) ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><Heading3 size={16} /></button>

          <div className="w-px h-6 bg-border-glass mx-1" />

          <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("bulletList") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><List size={16} /></button>
          <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("orderedList") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><ListOrdered size={16} /></button>
          <button onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-md transition-colors ${editor?.isActive("blockquote") ? "bg-accent-blue/20 text-accent-blue-light" : "text-text-muted hover:text-text-primary hover:bg-bg-primary"}`}><Quote size={16} /></button>

          <div className="w-px h-6 bg-border-glass mx-1" />

          {showLinkInput ? (
            <div className="flex items-center gap-2">
              <Input
                value={linkInputUrl}
                onChange={(e) => setLinkInputUrl(e.target.value)}
                placeholder="https://..."
                className="h-8 w-48 bg-bg-primary border-border-glass text-text-primary text-xs"
                onKeyDown={(e) => e.key === "Enter" && handleSetLink()}
              />
              <button onClick={handleSetLink} className="p-1.5 rounded-md text-green-400 hover:bg-green-400/10"><Check size={14} /></button>
              <button onClick={() => { setShowLinkInput(false); setLinkInputUrl(""); }} className="p-1.5 rounded-md text-red-400 hover:bg-red-400/10"><X size={14} /></button>
            </div>
          ) : (
            <>
              <button onClick={() => setShowLinkInput(true)} className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"><LinkIcon size={16} /></button>
              <button onClick={() => editor?.chain().focus().unsetLink().run()} className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors"><Unlink size={16} /></button>
            </>
          )}
        </div>

        <EditorContent editor={editor} />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => handleSave(false)}
          disabled={saving}
          variant="outline"
          className="flex items-center gap-2 border-border-glass text-text-secondary hover:text-text-primary"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Draft"}
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={saving}
          className="flex items-center gap-2 bg-accent-blue hover:bg-blue-600 text-white shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
        >
          <Send size={16} />
          {saving ? "Publishing..." : "Publish Job"}
        </Button>
      </div>
    </div>
  );
}
