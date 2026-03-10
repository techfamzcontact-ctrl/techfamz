"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Image from "next/image";
import {
  ImageIcon, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink,
  Save, Send, Check, X
} from "lucide-react";
import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPost, savePost } from "../../../actions";

const CATEGORIES = [
  "Tutorial",
  "News",
  "Update",
  "Guide",
  "Opinion",
  "Case Study",
];

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [saveError, setSaveError] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputUrl, setLinkInputUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
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
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] p-6 md:p-8 bg-[rgba(0,0,0,0.2)] rounded-b-xl border border-t-0 border-border-glass [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_p]:m-0 [&_p]:min-h-[1.5em] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:mt-6 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary",
      },
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (resolvedParams.id !== "new") {
        const post = await getPost(resolvedParams.id);
        if (post) {
          setTitle(post.title);
          setExcerpt(post.excerpt || "");
          setCoverImage(post.coverImage || "");
          setCategory(post.category || "");
          editor?.commands.setContent(post.content);
        }
      }
      setLoading(false);
    };
    if (editor) fetchData();
  }, [resolvedParams.id, editor]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    setLinkInputUrl(previousUrl || "");
    setShowLinkInput(true);
  }, [editor]);

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor) return;

    if (linkInputUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setShowLinkInput(false);
      return;
    }
    
    const fixedUrl = /^https?:\/\//.test(linkInputUrl) || /^(mailto|tel):/.test(linkInputUrl) ? linkInputUrl : `https://${linkInputUrl}`;
    
    editor.chain().focus().extendMarkRange("link").setLink({ href: fixedUrl }).run();
    editor.commands.setTextSelection(editor.state.selection.to);
    
    setShowLinkInput(false);
    setLinkInputUrl("");
  };

  const handleSave = async (publish: boolean) => {
    if (!title) {
      setSaveError("Title is required before saving.");
      return;
    }
    setSaveError("");
    setSaving(true);
    try {
      await savePost({
        id: resolvedParams.id,
        title,
        content: editor?.getHTML() || "",
        excerpt,
        coverImage,
        category,
        published: publish,
      });
      router.push("/admin");
      router.refresh();
    } catch (e) {
      console.error(e);
      setSaveError("Failed to save post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file);
      setCoverImage(url);
    } catch {
      setSaveError("Failed to upload cover image.");
    }
  };

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file || !editor) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        setSaveError("Failed to upload image into post.");
      }
    };
    input.click();
  };

  if (loading || !editor) {
    return (
      <div className="flex justify-center items-center h-full min-h-[50vh]">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  const ToolbarButton = ({ onClick, isActive, icon: Icon, title, disabled = false }: {
    onClick: () => void;
    isActive?: boolean;
    icon: React.ElementType;
    title: string;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded transition-colors ${
        isActive 
          ? "bg-[rgba(59,130,246,0.2)] text-accent-blue-light" 
          : "text-text-muted hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={title}
      type="button"
    >
      <Icon size={16} />
    </button>
  );

  const Divider = () => <div className="w-px h-5 bg-border-glass mx-1" />;

  return (
    <div className="max-w-[1000px] mx-auto pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-text-primary">
          {resolvedParams.id === "new" ? "Write a new post" : "Edit post"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="py-2.5 px-6 flex items-center gap-2 rounded-lg font-medium text-sm text-text-secondary bg-[rgba(255,255,255,0.06)] border border-border-glass hover:bg-[rgba(255,255,255,0.1)] hover:text-text-primary transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-accent-blue text-white py-2.5 px-6 flex items-center gap-2 rounded-lg font-medium text-sm hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-blue-glow-soft)] disabled:opacity-50"
          >
            <Send size={16} />
            {saving ? "Publishing..." : "Publish Live"}
          </button>
        </div>
      </div>

      {/* Inline error banner */}
      {saveError && (
        <div className="mb-6 px-4 py-3 rounded-lg border border-red-500/30 bg-red-900/20 text-sm text-red-300 flex items-center justify-between gap-3">
          <span>{saveError}</span>
          <button onClick={() => setSaveError("")} className="text-red-400 hover:text-red-200 transition-colors shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Editor Column */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Post title..."
              className="w-full p-4 md:p-6 bg-[rgba(10,16,34,0.4)] border border-border-glass rounded-xl text-text-primary text-[clamp(1.5rem,3vw,2.5rem)] font-bold focus:outline-none focus:border-accent-blue focus:shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] placeholder:text-text-muted/40 transition-all font-sans"
            />
          </div>

          {/* TipTap Rich Text Editor */}
          <div className="bg-[rgba(10,16,34,0.4)] rounded-xl backdrop-blur-md flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 p-2 px-3 border border-border-glass rounded-t-xl bg-[rgba(255,255,255,0.02)] border-b-border-glass/50 sticky top-0 z-10 backdrop-blur-xl">
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} icon={Heading1} title="Heading 1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={Heading2} title="Heading 2" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} icon={Heading3} title="Heading 3" />
              <Divider />
              
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={Bold} title="Bold (Ctrl+B)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={Italic} title="Italic (Ctrl+I)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} icon={UnderlineIcon} title="Underline (Ctrl+U)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={Strikethrough} title="Strikethrough" />
              <Divider />
              
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
              <Divider />
              
              <div className="relative inline-block">
                <ToolbarButton onClick={openLinkInput} isActive={editor.isActive("link") || showLinkInput} icon={LinkIcon} title="Add Link" />
                {showLinkInput && (
                  <div className="absolute top-full mt-2 left-0 md:left-1/2 md:-translate-x-1/2 bg-[#0a1022] border border-border-glass p-1.5 rounded-lg shadow-xl z-50 w-[260px]">
                    <form onSubmit={handleLinkSubmit} className="flex items-center gap-1.5">
                      <input
                        type="url"
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        placeholder="https://..."
                        autoFocus
                        className="flex-1 min-w-0 bg-[rgba(0,0,0,0.3)] border border-border-glass rounded px-2 py-1 text-sm text-text-primary focus:outline-none focus:border-accent-blue placeholder:text-text-muted/50"
                      />
                      <button type="submit" className="bg-accent-blue text-white p-1 rounded hover:bg-blue-600 transition-colors flex-shrink-0" title="Save Link">
                        <Check size={14} />
                      </button>
                      <button type="button" onClick={() => setShowLinkInput(false)} className="bg-[rgba(255,255,255,0.05)] text-text-primary p-1 rounded border border-border-glass hover:bg-[rgba(255,255,255,0.1)] transition-colors flex-shrink-0" title="Cancel">
                        <X size={14} />
                      </button>
                    </form>
                  </div>
                )}
              </div>
              <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")} icon={Unlink} title="Remove Link" />
              <Divider />

              <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive("bulletList")} icon={List} title="Bullet List" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive("orderedList")} icon={ListOrdered} title="Numbered List" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive("blockquote")} icon={Quote} title="Quote" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive("codeBlock")} icon={Code} title="Code Block" />
              <ToolbarButton onClick={insertImage} icon={ImageIcon} title="Insert Image" />
            </div>

            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-[rgba(10,16,34,0.4)] border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <label className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">Cover Image</label>
            {coverImage ? (
              <div className="relative rounded-lg overflow-hidden aspect-video border border-border-glass group">
                {/* Fixed: use next/image instead of plain <img> */}
                <Image src={coverImage} alt="Cover" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <label className="cursor-pointer bg-[rgba(255,255,255,0.1)] hover:bg-accent-blue text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Change Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border-glass rounded-lg cursor-pointer hover:bg-[rgba(255,255,255,0.02)] hover:border-accent-blue transition-colors group">
                <div className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.05)] text-text-muted flex items-center justify-center mb-3 group-hover:text-accent-blue group-hover:bg-accent-blue-glow-soft transition-colors">
                  <ImageIcon size={20} />
                </div>
                <span className="text-sm text-text-secondary font-medium">Upload Cover</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="bg-[rgba(10,16,34,0.4)] border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <label className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? "" : cat)}
                  className={`py-1.5 px-3 rounded-full text-xs font-semibold border transition-all ${
                    category === cat
                      ? "bg-accent-blue text-white border-accent-blue shadow-[0_0_12px_var(--color-accent-blue-glow-soft)]"
                      : "bg-transparent text-text-secondary border-border-glass hover:border-accent-blue-light hover:text-text-primary"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* SEO Details */}
          <div className="bg-[rgba(10,16,34,0.4)] border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <label className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">SEO & Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary for search engines and post previews..."
              className="w-full p-3 bg-[rgba(0,0,0,0.3)] border border-border-glass rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue placeholder:text-text-muted/50 transition-all min-h-[120px] resize-y"
            />
            <p className="text-[0.65rem] text-text-muted mt-2">
              Recommended: 150-160 characters. This appears on Google and when sharing on social media.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
