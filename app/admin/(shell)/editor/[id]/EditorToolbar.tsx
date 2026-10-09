"use client";

import { useId, useRef, useState, type ComponentProps, type FormEvent, type ReactNode } from "react";
import { useEditorState, type Editor } from "@tiptap/react";
import { Popover } from "radix-ui";
import { toast } from "sonner";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Baseline,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  LoaderCircle,
  MousePointerClick,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
  Unlink,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminInputClass, adminLabelClass } from "@/components/admin/AdminUI";
import { cn } from "@/lib/utils";
import { isImageFile, normalizeUrl, uploadImage } from "./editor-utils";

/* Shortcut hint for tooltips. The toolbar only renders in the browser (the editor is
   created after mount), so this can never differ between server and client HTML. */
const MOD = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl+";

type Align = "left" | "center" | "right" | "justify";

const ALIGNMENTS: { value: Align; label: string; icon: LucideIcon }[] = [
  { value: "left", label: "Align left", icon: AlignLeft },
  { value: "center", label: "Align center", icon: AlignCenter },
  { value: "right", label: "Align right", icon: AlignRight },
  { value: "justify", label: "Justify", icon: AlignJustify },
];

export function EditorToolbar({ editor, className }: { editor: Editor; className?: string }) {
  // Re-render the toolbar only when one of these values changes (selection moves, marks toggle…).
  const state = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
      h1: e.isActive("heading", { level: 1 }),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      color: (e.getAttributes("textStyle").color as string | undefined) ?? "",
      align: ALIGNMENTS.find((a) => a.value !== "left" && e.isActive({ textAlign: a.value }))?.value ?? "left",
      link: e.isActive("link"),
      bulletList: e.isActive("bulletList"),
      orderedList: e.isActive("orderedList"),
      blockquote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
    }),
  });

  const chain = () => editor.chain().focus();

  return (
    <div role="toolbar" aria-label="Formatting" className={cn("flex items-center gap-0.5", className)}>
      <ToolButton label="Undo" shortcut={`${MOD}Z`} icon={Undo2} disabled={!state.canUndo} onClick={() => chain().undo().run()} />
      <ToolButton label="Redo" shortcut={`${MOD}Y`} icon={Redo2} disabled={!state.canRedo} onClick={() => chain().redo().run()} />
      <Divider />

      <ToolButton
        label="Heading 1"
        title="Heading 1 (shown as Heading 2 on the blog, where the post title is the H1)"
        icon={Heading1}
        pressed={state.h1}
        onClick={() => chain().toggleHeading({ level: 1 }).run()}
      />
      <ToolButton label="Heading 2" icon={Heading2} pressed={state.h2} onClick={() => chain().toggleHeading({ level: 2 }).run()} />
      <ToolButton label="Heading 3" icon={Heading3} pressed={state.h3} onClick={() => chain().toggleHeading({ level: 3 }).run()} />
      <Divider />

      <ToolButton label="Bold" shortcut={`${MOD}B`} icon={Bold} pressed={state.bold} onClick={() => chain().toggleBold().run()} />
      <ToolButton label="Italic" shortcut={`${MOD}I`} icon={Italic} pressed={state.italic} onClick={() => chain().toggleItalic().run()} />
      <ToolButton
        label="Underline"
        shortcut={`${MOD}U`}
        icon={UnderlineIcon}
        pressed={state.underline}
        onClick={() => chain().toggleUnderline().run()}
      />
      <ToolButton label="Strikethrough" icon={Strikethrough} pressed={state.strike} onClick={() => chain().toggleStrike().run()} />
      <ColorControl editor={editor} color={state.color} />
      <Divider />

      <AlignControl editor={editor} align={state.align} />
      <Divider />

      <LinkControl editor={editor} active={state.link} />
      <ToolButton
        label="Remove link"
        icon={Unlink}
        disabled={!state.link}
        onClick={() => chain().extendMarkRange("link").unsetLink().run()}
      />
      <Divider />

      <ToolButton label="Bullet list" icon={List} pressed={state.bulletList} onClick={() => chain().toggleBulletList().run()} />
      <ToolButton
        label="Numbered list"
        icon={ListOrdered}
        pressed={state.orderedList}
        onClick={() => chain().toggleOrderedList().run()}
      />
      <ToolButton label="Quote" icon={Quote} pressed={state.blockquote} onClick={() => chain().toggleBlockquote().run()} />
      <ToolButton label="Code block" icon={SquareCode} pressed={state.codeBlock} onClick={() => chain().toggleCodeBlock().run()} />
      <Divider />

      <ImageControl editor={editor} />
      <YoutubeControl editor={editor} />
      <ButtonControl editor={editor} />
    </div>
  );
}

/* ─── Building blocks ─── */

type ToolButtonProps = ComponentProps<"button"> & {
  label: string;
  icon?: LucideIcon;
  shortcut?: string;
  /** Toggle state (bold, lists…): highlights the button and sets aria-pressed. */
  pressed?: boolean;
  /** Highlight only, for buttons that are not toggles (e.g. a colour is applied). */
  active?: boolean;
};

function ToolButton({ label, icon: Icon, shortcut, pressed, active, className, children, ...props }: ToolButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={shortcut ? `${label} (${shortcut})` : label}
      aria-pressed={pressed}
      className={cn(
        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors",
        "hover:bg-text-primary/5 hover:text-text-primary disabled:pointer-events-none disabled:opacity-40",
        "data-[state=open]:bg-text-primary/[0.07] data-[state=open]:text-text-primary",
        (pressed || active) && "bg-text-primary/[0.07] text-text-primary",
        className
      )}
      {...props}
    >
      {children ?? (Icon && <Icon size={16} aria-hidden="true" />)}
    </button>
  );
}

function Divider() {
  return <span aria-hidden="true" className="mx-1 h-5 w-px shrink-0 bg-border-glass" />;
}

/**
 * Small anchored panel for the link, colour, YouTube and button forms.
 * Closing it puts the cursor back in the editor, unless the admin clicked somewhere else on the page.
 */
function ToolPopover({
  editor,
  open,
  onOpenChange,
  trigger,
  className,
  children,
}: {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  const interactedOutside = useRef(false);

  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={6}
          collisionPadding={12}
          onInteractOutside={() => {
            interactedOutside.current = true;
          }}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            if (!interactedOutside.current) editor.commands.focus();
            interactedOutside.current = false;
          }}
          className={cn(
            "z-50 w-72 rounded-lg border border-border-glass bg-bg-card p-3 text-sm text-text-primary shadow-md outline-none",
            className
          )}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className={adminLabelClass}>
        {label}
      </label>
      <div className="flex h-9 items-center gap-2 rounded-md border border-border-glass bg-bg-primary px-1.5 transition-colors hover:border-border-glass-hover focus-within:border-accent-blue focus-within:ring-2 focus-within:ring-accent-blue/20">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-6 w-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0 outline-none [&::-moz-color-swatch]:rounded [&::-moz-color-swatch]:border-border-glass [&::-webkit-color-swatch]:rounded [&::-webkit-color-swatch]:border-border-glass [&::-webkit-color-swatch-wrapper]:p-0"
        />
        <span className="font-mono text-xs uppercase text-text-secondary">{value}</span>
      </div>
    </div>
  );
}

/* ─── Controls ─── */

function ColorControl({ editor, color }: { editor: Editor; color: string }) {
  const [open, setOpen] = useState(false);

  return (
    <ToolPopover
      editor={editor}
      open={open}
      onOpenChange={setOpen}
      className="w-60"
      trigger={
        <ToolButton label="Text color" active={Boolean(color)}>
          <Baseline size={16} aria-hidden="true" style={color ? { color } : undefined} />
        </ToolButton>
      }
    >
      {/* No focus() here: moving focus to the editor would close the popover mid-pick. */}
      <ColorField
        label="Text color"
        value={color || "#3b82f6"}
        onChange={(value) => editor.chain().setColor(value).run()}
      />
      <p className="mt-2 text-xs text-text-muted">Applies to the selected text.</p>
      <div className="mt-3 flex justify-end">
        <Button
          type="button"
          variant="ghost"
          size="xs"
          disabled={!color}
          onClick={() => {
            editor.chain().focus().unsetColor().run();
            setOpen(false);
          }}
        >
          Remove color
        </Button>
      </div>
    </ToolPopover>
  );
}

function AlignControl({ editor, align }: { editor: Editor; align: Align }) {
  const current = ALIGNMENTS.find((a) => a.value === align) ?? ALIGNMENTS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolButton label="Text alignment" icon={current.icon} active={align !== "left"} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40"
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          editor.commands.focus();
        }}
      >
        <DropdownMenuRadioGroup value={align} onValueChange={(value) => editor.chain().focus().setTextAlign(value).run()}>
          {ALIGNMENTS.map(({ value, label, icon: Icon }) => (
            <DropdownMenuRadioItem key={value} value={value}>
              <Icon size={14} aria-hidden="true" />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LinkControl({ editor, active }: { editor: Editor; active: boolean }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [selectionEmpty, setSelectionEmpty] = useState(true);

  function handleOpenChange(next: boolean) {
    if (next) {
      setUrl((editor.getAttributes("link").href as string | undefined) ?? "");
      setSelectionEmpty(editor.state.selection.empty);
    }
    setOpen(next);
  }

  function apply(event: FormEvent) {
    event.preventDefault();
    const href = normalizeUrl(url);

    if (!href) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else if (editor.state.selection.empty && !editor.isActive("link")) {
      // Nothing selected: insert the URL itself as the link text.
      editor
        .chain()
        .focus()
        .insertContent({ type: "text", text: url.trim(), marks: [{ type: "link", attrs: { href } }] })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href }).run();
      // Collapse the selection after the link so new typing is not linked.
      editor.commands.setTextSelection(editor.state.selection.to);
    }
    setOpen(false);
  }

  return (
    <ToolPopover
      editor={editor}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<ToolButton label={active ? "Edit link" : "Add link"} icon={LinkIcon} active={active} />}
    >
      <form onSubmit={apply}>
        <label htmlFor={id} className={adminLabelClass}>
          Link URL
        </label>
        <input
          id={id}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          className={adminInputClass}
        />
        <p className="mt-1.5 text-xs text-text-muted">
          {active
            ? "Clear the field to remove the link."
            : selectionEmpty
              ? "Nothing is selected, so the URL is inserted as the link text."
              : "Links the selected text."}
        </p>
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="xs" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" size="xs">
            {active ? "Update link" : "Add link"}
          </Button>
        </div>
      </form>
    </ToolPopover>
  );
}

function YoutubeControl({ editor }: { editor: Editor }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function handleOpenChange(next: boolean) {
    if (!next) setError("");
    setOpen(next);
  }

  function insert(event: FormEvent) {
    event.preventDefault();
    const src = url.trim();
    if (!src) return;
    // Validate before focusing the editor; focusing it would close the popover.
    if (!editor.can().setYoutubeVideo({ src })) {
      setError("That doesn't look like a YouTube link. Paste a youtube.com or youtu.be URL.");
      return;
    }
    editor.chain().focus().setYoutubeVideo({ src }).run();
    setUrl("");
    handleOpenChange(false);
  }

  return (
    <ToolPopover
      editor={editor}
      open={open}
      onOpenChange={handleOpenChange}
      trigger={<ToolButton label="Embed YouTube video" icon={Youtube} />}
    >
      <form onSubmit={insert}>
        <label htmlFor={id} className={adminLabelClass}>
          YouTube video URL
        </label>
        <input
          id={id}
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            setError("");
          }}
          placeholder="https://www.youtube.com/watch?v=…"
          inputMode="url"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={adminInputClass}
        />
        {error && (
          <p id={`${id}-error`} className="mt-1.5 text-xs text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="mt-3 flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="xs" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="xs" disabled={!url.trim()}>
            Embed video
          </Button>
        </div>
      </form>
    </ToolPopover>
  );
}

/* Mirrors the padding and font sizes in components/editor/CustomButtonExtension.ts for the live preview. */
const BUTTON_SIZES = {
  sm: { label: "Small", padding: "0.375rem 0.75rem", fontSize: "0.75rem" },
  md: { label: "Medium", padding: "0.5rem 1rem", fontSize: "0.875rem" },
  lg: { label: "Large", padding: "0.75rem 1.5rem", fontSize: "1rem" },
} as const;

type ButtonSize = keyof typeof BUTTON_SIZES;

function ButtonControl({ editor }: { editor: Editor }) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("Click Me");
  const [url, setUrl] = useState("");
  const [bgColor, setBgColor] = useState("#3b82f6");
  const [textColor, setTextColor] = useState("#ffffff");
  const [radius, setRadius] = useState("8");
  const [size, setSize] = useState<ButtonSize>("md");

  function insert(event: FormEvent) {
    event.preventDefault();
    const href = normalizeUrl(url);
    if (!text.trim() || !href) return;
    editor
      .chain()
      .focus()
      .setCustomButton({ text: text.trim(), url: href, bgColor, textColor, borderRadius: radius || "0", size })
      .run();
    setOpen(false);
  }

  return (
    <ToolPopover
      editor={editor}
      open={open}
      onOpenChange={setOpen}
      className="w-80"
      trigger={<ToolButton label="Insert button" icon={MousePointerClick} />}
    >
      <form onSubmit={insert} className="space-y-3">
        <div>
          <label htmlFor={`${id}-text`} className={adminLabelClass}>
            Button text
          </label>
          <input
            id={`${id}-text`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            className={adminInputClass}
          />
        </div>
        <div>
          <label htmlFor={`${id}-url`} className={adminLabelClass}>
            Link
          </label>
          <input
            id={`${id}-url`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            required
            className={adminInputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ColorField label="Background" value={bgColor} onChange={setBgColor} />
          <ColorField label="Text" value={textColor} onChange={setTextColor} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-size`} className={adminLabelClass}>
              Size
            </label>
            <select
              id={`${id}-size`}
              value={size}
              onChange={(e) => setSize(e.target.value as ButtonSize)}
              className={adminInputClass}
            >
              {(Object.keys(BUTTON_SIZES) as ButtonSize[]).map((key) => (
                <option key={key} value={key}>
                  {BUTTON_SIZES[key].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${id}-radius`} className={adminLabelClass}>
              Corner radius (px)
            </label>
            <input
              id={`${id}-radius`}
              type="number"
              min={0}
              max={99}
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className={adminInputClass}
            />
          </div>
        </div>
        <div>
          <p className={adminLabelClass}>Preview</p>
          <div className="flex min-h-14 items-center justify-center rounded-md border border-dashed border-border-glass bg-bg-primary p-3">
            <span
              style={{
                display: "inline-block",
                backgroundColor: bgColor,
                color: textColor,
                borderRadius: `${radius || 0}px`,
                padding: BUTTON_SIZES[size].padding,
                fontSize: BUTTON_SIZES[size].fontSize,
                fontWeight: 600,
                lineHeight: 1.5,
              }}
            >
              {text.trim() || "Button"}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Button type="button" variant="ghost" size="xs" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" size="xs">
            Insert button
          </Button>
        </div>
      </form>
    </ToolPopover>
  );
}

function ImageControl({ editor }: { editor: Editor }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!isImageFile(file)) {
      toast.error("Choose an image file (JPG, PNG, WebP or GIF).");
      return;
    }
    setUploading(true);
    try {
      const src = await uploadImage(file);
      editor.chain().focus().setImage({ src }).run();
    } catch (err) {
      console.error("Inline image upload failed:", err);
      toast.error("Couldn't upload the image. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <>
      <ToolButton
        label={uploading ? "Uploading image…" : "Insert image"}
        icon={ImagePlus}
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <LoaderCircle size={16} className="animate-spin" aria-hidden="true" /> : undefined}
      </ToolButton>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </>
  );
}
