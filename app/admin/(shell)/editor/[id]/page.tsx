"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Image from "next/image";
import {
  ImageIcon, Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, Link as LinkIcon, Unlink,
  Save, Send, Check, X, MousePointerClick, Sparkles
} from "lucide-react";
import { CustomButtonExtension } from "@/components/editor/CustomButtonExtension";
import { useState, useEffect, use, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPost, savePost } from "../../../actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CATEGORIES = [
  "Tutorial",
  "Tech News",
  "Tech Tips",
  "Opinion",
  "Case Study",
  "Engineering",
  "Daily Courses",
];

export default function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [category, setCategory] = useState("");
  const [saveError, setSaveError] = useState("");
  
  const [isDirty, setIsDirty] = useState(false);
  const [wordCount, setWordCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkInputUrl, setLinkInputUrl] = useState("");

  const [showBtnInput, setShowBtnInput] = useState(false);
  const [btnText, setBtnText] = useState("Click Me");
  const [btnUrl, setBtnUrl] = useState("https://");
  const [btnBg, setBtnBg] = useState("#3b82f6");
  const [btnTextCol, setBtnTextCol] = useState("#ffffff");
  const [btnRad, setBtnRad] = useState("8");
  const [btnSize, setBtnSize] = useState("md");
  
  const [generatingSummary, setGeneratingSummary] = useState(false);

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
      TextStyle,
      Color,
      CustomButtonExtension,
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
          "prose dark:prose-invert max-w-none focus:outline-none min-h-[400px] max-h-[600px] overflow-y-auto p-6 md:p-8 bg-bg-primary/50 border border-border-glass [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_p]:m-0 [&_p]:min-h-[1.5em] [&_h1]:mt-8 [&_h1]:mb-4 [&_h2]:mt-8 [&_h2]:mb-4 [&_h3]:mt-6 [&_h3]:mb-3 [&_blockquote]:border-l-4 [&_blockquote]:border-accent-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary w-full",
      },
    },
    onUpdate: ({ editor }) => {
      setIsDirty(true);
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((w) => w.length > 0);
      setWordCount(words.length);
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (resolvedParams.id !== "new") {
        const post = await getPost(resolvedParams.id);
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setExcerpt(post.excerpt || "");
          setCoverImage(post.coverImage || "");
          setCategory(post.category || "");
          editor?.commands.setContent(post.content);
          
          // Initial word count
          const text = editor?.getText() || "";
          setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
        }
      }
      setLoading(false);
      // Wait a tick for editor to initialize before resetting dirtiness
      setTimeout(() => setIsDirty(false), 10);
    };
    if (editor) fetchData();
  }, [resolvedParams.id, editor]);

  // Unsaved changes warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

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

  const handleBtnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editor || btnText === "") return;
    
    // @ts-ignore - custom extension commands
    editor.chain().focus().setCustomButton({
      text: btnText,
      url: btnUrl,
      bgColor: btnBg,
      textColor: btnTextCol,
      borderRadius: btnRad,
      size: btnSize
    }).run();
    
    setShowBtnInput(false);
  };

  const generateAiSummary = async () => {
    if (!editor || generatingSummary) return;
    
    const textContent = editor.getText();
    if (!textContent || textContent.trim().length < 50) {
      setSaveError("Please write some content first before generating a summary.");
      return;
    }

    try {
      setGeneratingSummary(true);
      setSaveError("");
      
      const response = await fetch("/api/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: textContent }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate summary");
      }

      const data = await response.json();
      setExcerpt(data.summary);
      setIsDirty(true);
      
    } catch (err: any) {
      setSaveError(err.message || "An error occurred while generating the summary.");
    } finally {
      setGeneratingSummary(false);
    }
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
        slug,
        content: editor?.getHTML() || "",
        excerpt,
        coverImage,
        category,
        published: publish,
      });
      setIsDirty(false);
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
          ? "bg-accent-blue-glow-soft text-accent-blue-light" 
          : "text-text-muted hover:bg-bg-card hover:text-text-primary"
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
          <Button
            variant="outline-glow"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Draft"}
          </Button>
          <Button
            variant="cta"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            {saving ? "Publishing..." : "Publish Live"}
          </Button>
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
          <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="p-4 md:p-6 border-b border-border-glass">
              <Input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                placeholder="Post title..."
                className="w-full h-auto p-0 bg-transparent border-none text-text-primary text-[clamp(1.5rem,3vw,2.5rem)] font-bold focus-visible:ring-0 shadow-none placeholder:text-text-muted/40 transition-all font-sans mb-3 rounded-none"
              />
              <div className="flex items-center gap-1 text-sm text-text-muted px-1">
                <span className="opacity-60 hidden sm:inline">techfamz.com/blog/</span>
                <span className="opacity-60 sm:hidden">/blog/</span>
                <Input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(e.target.value); setIsDirty(true); }}
                  placeholder={title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : "your-post-slug"}
                  className="flex-1 min-w-[100px] h-6 p-0 bg-transparent border-none text-accent-blue-light focus-visible:ring-0 shadow-none font-mono"
                />
              </div>
            </div>

            {/* TipTap Rich Text Editor */}
            <div className="flex flex-col">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-0.5 p-2 px-3 bg-bg-primary/50 border-b border-border-glass sticky top-0 z-10 backdrop-blur-xl">
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive("heading", { level: 1 })} icon={Heading1} title="Heading 1" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive("heading", { level: 2 })} icon={Heading2} title="Heading 2" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive("heading", { level: 3 })} icon={Heading3} title="Heading 3" />
              <Divider />
              
              <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive("bold")} icon={Bold} title="Bold (Ctrl+B)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive("italic")} icon={Italic} title="Italic (Ctrl+I)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive("underline")} icon={UnderlineIcon} title="Underline (Ctrl+U)" />
              <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} isActive={editor.isActive("strike")} icon={Strikethrough} title="Strikethrough" />
              <div className="relative flex items-center justify-center p-1 rounded hover:bg-bg-card transition-colors" title="Text Color">
                <input
                  type="color"
                  onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
                  value={editor.getAttributes("textStyle").color || "#ffffff"}
                  className="w-5 h-5 p-0 border-0 rounded cursor-pointer bg-transparent"
                />
              </div>
              <Divider />
              
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
              <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} isActive={editor.isActive({ textAlign: 'justify' })} icon={AlignJustify} title="Justify" />
              <Divider />
              
              <div className="relative inline-block">
                <ToolbarButton onClick={openLinkInput} isActive={editor.isActive("link") || showLinkInput} icon={LinkIcon} title="Add Link" />
                {showLinkInput && (
                  <div className="absolute top-full mt-2 left-0 md:left-1/2 md:-translate-x-1/2 bg-bg-primary border border-border-glass p-1.5 rounded-lg shadow-xl z-50 w-[260px]">
                    <form onSubmit={handleLinkSubmit} className="flex items-center gap-1.5">
                      <Input
                        type="url"
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        placeholder="https://..."
                        autoFocus
                        className="flex-1 min-w-0 bg-bg-primary/50 border-border-glass focus-visible:ring-accent-blue placeholder:text-text-muted/50 h-8"
                      />
                      <button type="submit" className="bg-accent-blue text-white p-1 rounded hover:bg-blue-600 transition-colors flex-shrink-0" title="Save Link">
                        <Check size={14} />
                      </button>
                      <button type="button" onClick={() => setShowLinkInput(false)} className="bg-bg-card text-text-primary p-1 rounded border border-border-glass hover:bg-bg-card transition-colors flex-shrink-0" title="Cancel">
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
              
              <div className="relative inline-block">
                <ToolbarButton onClick={() => setShowBtnInput(!showBtnInput)} isActive={showBtnInput} icon={MousePointerClick} title="Insert Button" />
                {showBtnInput && (
                  <div className="absolute top-full mt-2 left-0 md:left-1/2 md:-translate-x-[75%] lg:md:-translate-x-1/2 bg-bg-primary border border-border-glass p-4 rounded-xl shadow-2xl z-50 w-[260px] flex flex-col gap-3">
                    <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider">Button Settings</div>
                    <form onSubmit={handleBtnSubmit} className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[0.65rem] text-text-secondary">Text</Label>
                        <Input value={btnText} onChange={e => setBtnText(e.target.value)} className="h-8 text-xs bg-bg-card border-border-glass" required />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <Label className="text-[0.65rem] text-text-secondary">Link (URL)</Label>
                        <Input value={btnUrl} onChange={e => setBtnUrl(e.target.value)} className="h-8 text-xs bg-bg-card border-border-glass" type="url" required />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[0.65rem] text-text-secondary">Bg Color</Label>
                          <input type="color" value={btnBg} onChange={e => setBtnBg(e.target.value)} className="w-full h-8 p-0 rounded bg-transparent border-none cursor-pointer" />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[0.65rem] text-text-secondary">Text Color</Label>
                          <input type="color" value={btnTextCol} onChange={e => setBtnTextCol(e.target.value)} className="w-full h-8 p-0 rounded bg-transparent border-none cursor-pointer" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[0.65rem] text-text-secondary">Size</Label>
                          <select value={btnSize} onChange={e => setBtnSize(e.target.value)} className="h-8 text-xs bg-bg-card border border-border-glass rounded text-text-primary px-2 focus:outline-none focus:ring-1 focus:ring-accent-blue">
                            <option value="sm">Small</option>
                            <option value="md">Medium</option>
                            <option value="lg">Large</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <Label className="text-[0.65rem] text-text-secondary">Radius</Label>
                          <Input value={btnRad} onChange={e => setBtnRad(e.target.value)} className="h-8 text-xs bg-bg-card border-border-glass" type="number" />
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button type="button" onClick={() => setShowBtnInput(false)} className="flex-1 h-8 text-xs rounded border border-border-glass text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors">Cancel</button>
                        <button type="submit" className="flex-1 h-8 text-xs rounded bg-accent-blue text-white hover:bg-blue-600 transition-colors">Insert</button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
              
              <ToolbarButton onClick={insertImage} icon={ImageIcon} title="Insert Image" />
            </div>

              <EditorContent editor={editor} />
              
              {/* Editor Footer / Meta */}
              <div className="flex items-center justify-between p-3 border-t border-border-glass bg-[rgba(255,255,255,0.02)] text-xs text-text-muted">
                <div className="flex items-center gap-4">
                  <span>{wordCount} words</span>
                  <span>{Math.max(1, Math.ceil(wordCount / 200))} min read</span>
                </div>
                {isDirty && <span className="text-cta-yellow italic">Unsaved changes</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <Label className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">Cover Image</Label>
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
              <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-border-glass rounded-lg cursor-pointer hover:bg-bg-primary/50 hover:border-accent-blue transition-colors group">
                <div className="w-10 h-10 rounded-full bg-bg-card text-text-muted flex items-center justify-center mb-3 group-hover:text-accent-blue group-hover:bg-accent-blue-glow-soft transition-colors">
                  <ImageIcon size={20} />
                </div>
                <span className="text-sm text-text-secondary font-medium">Upload Cover</span>
                <input type="file" className="hidden" accept="image/*" onChange={handleCoverUpload} />
              </label>
            )}
          </div>

          {/* Category */}
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <Label className="block text-[0.65rem] font-bold text-text-muted uppercase tracking-widest mb-3">Category</Label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => { setCategory(category === cat ? "" : cat); setIsDirty(true); }}
                  className={`py-1.5 px-3 rounded-full text-[0.7rem] font-semibold border transition-all ${
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
          <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-[0.65rem] font-bold text-text-muted uppercase tracking-widest">SEO & Excerpt</Label>
              <button 
                type="button" 
                onClick={generateAiSummary}
                disabled={generatingSummary}
                className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-accent-blue hover:text-accent-blue-light transition-colors disabled:opacity-50"
              >
                <Sparkles size={12} className={generatingSummary ? "animate-pulse" : ""} />
                {generatingSummary ? "Generating..." : "Auto-generate"}
              </button>
            </div>
            <Textarea
              value={excerpt}
              onChange={(e) => { setExcerpt(e.target.value); setIsDirty(true); }}
              placeholder="Brief summary for search engines and post previews..."
              className="bg-bg-primary/50 border-border-glass focus-visible:ring-accent-blue placeholder:text-text-muted/50 min-h-[120px] resize-y"
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
