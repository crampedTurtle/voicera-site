import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Youtube from "@tiptap/extension-youtube";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-text-style/color";
import { FontSize } from "@tiptap/extension-text-style/font-size";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateFileUpload, generateSafeFilename } from "@/lib/sanitize";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Code, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, Link as LinkIcon, Link2Off as Unlink,
  ImageIcon, Video, Undo, Redo, Minus, Loader2, Palette, Type,
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const FONT_SIZES = ["12px", "14px", "16px", "18px", "20px", "24px", "28px", "32px", "36px", "48px"];
const COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#cccccc", "#ffffff",
  "#e53e3e", "#dd6b20", "#d69e2e", "#38a169", "#3182ce", "#805ad5",
  "#e91e63", "#00bcd4", "#4caf50", "#ff9800", "#795548", "#607d8b",
];

function ToolbarButton({
  onClick, active, disabled, title, children,
}: {
  onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded hover:bg-muted transition-colors disabled:opacity-40 ${
        active ? "bg-muted text-primary" : "text-muted-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function FontSizeDropdown({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const currentSize = editor.getAttributes("textStyle").fontSize || "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Font Size"
        className="flex items-center gap-0.5 px-1.5 py-1 rounded hover:bg-muted transition-colors text-muted-foreground text-xs min-w-[52px]"
      >
        <Type className="w-3.5 h-3.5" />
        <span className="tabular-nums">{currentSize || "—"}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-md shadow-md py-1 min-w-[80px] max-h-48 overflow-y-auto">
            <button
              type="button"
              className="w-full text-left px-3 py-1 text-xs hover:bg-muted text-muted-foreground"
              onClick={() => { editor.chain().focus().unsetFontSize().run(); setOpen(false); }}
            >
              Default
            </button>
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`w-full text-left px-3 py-1 text-xs hover:bg-muted ${currentSize === size ? "bg-muted text-primary font-medium" : "text-foreground"}`}
                onClick={() => { editor.chain().focus().setFontSize(size).run(); setOpen(false); }}
              >
                {size}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ColorPicker({ editor }: { editor: Editor }) {
  const [open, setOpen] = useState(false);
  const currentColor = editor.getAttributes("textStyle").color || "";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        title="Text Color"
        className="p-1.5 rounded hover:bg-muted transition-colors text-muted-foreground relative"
      >
        <Palette className="w-4 h-4" />
        {currentColor && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full" style={{ backgroundColor: currentColor }} />
        )}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-1 z-50 bg-popover border border-border rounded-md shadow-md p-2 w-[168px]">
            <div className="grid grid-cols-6 gap-1 mb-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  title={color}
                  className={`w-5 h-5 rounded border transition-transform hover:scale-125 ${currentColor === color ? "ring-2 ring-primary ring-offset-1" : "border-border"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => { editor.chain().focus().setColor(color).run(); setOpen(false); }}
                />
              ))}
            </div>
            <button
              type="button"
              className="w-full text-left px-2 py-1 text-xs hover:bg-muted text-muted-foreground rounded"
              onClick={() => { editor.chain().focus().unsetColor().run(); setOpen(false); }}
            >
              Remove color
            </button>
            <label className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground cursor-pointer">
              Custom:
              <input
                type="color"
                defaultValue={currentColor || "#000000"}
                className="w-5 h-5 p-0 border-0 rounded cursor-pointer"
                onChange={(e) => { editor.chain().focus().setColor(e.target.value).run(); }}
              />
            </label>
          </div>
        </>
      )}
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const iconSize = "w-4 h-4";

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 5MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await supabase.storage.from("blog-images").upload(filename, file, { contentType: file.type });
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } else {
      const { data } = supabase.storage.from("blog-images").getPublicUrl(filename);
      editor.chain().focus().setImage({ src: data.publicUrl }).run();
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }, [editor, toast]);

  const addImageUrl = useCallback(() => {
    const url = prompt("Image URL:");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  }, [editor]);

  const addVideo = useCallback(() => {
    const url = prompt("YouTube video URL:");
    if (url) editor.commands.setYoutubeVideo({ src: url });
  }, [editor]);

  const setLink = useCallback(() => {
    const url = prompt("Link URL:", editor.getAttributes("link").href || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="border-b border-border bg-muted/30 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
      <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
        <Undo className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
        <Redo className={iconSize} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <FontSizeDropdown editor={editor} />
      <ColorPicker editor={editor} />

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
        <Bold className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
        <Italic className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
        <UnderlineIcon className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
        <Strikethrough className={iconSize} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
        <Heading1 className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
        <Heading2 className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">
        <Heading3 className={iconSize} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet List">
        <List className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">
        <ListOrdered className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote">
        <Quote className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code Block">
        <Code className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
        <Minus className={iconSize} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align Left">
        <AlignLeft className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">
        <AlignCenter className={iconSize} />
      </ToolbarButton>
      <ToolbarButton onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align Right">
        <AlignRight className={iconSize} />
      </ToolbarButton>

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={setLink} active={editor.isActive("link")} title="Add Link">
        <LinkIcon className={iconSize} />
      </ToolbarButton>
      {editor.isActive("link") && (
        <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
          <Unlink className={iconSize} />
        </ToolbarButton>
      )}

      <div className="w-px h-5 bg-border mx-1" />

      <ToolbarButton onClick={() => fileRef.current?.click()} disabled={uploading} title="Upload Image">
        {uploading ? <Loader2 className={`${iconSize} animate-spin`} /> : <ImageIcon className={iconSize} />}
      </ToolbarButton>
      <ToolbarButton onClick={addImageUrl} title="Image from URL">
        <ImageIcon className={`${iconSize} opacity-60`} />
      </ToolbarButton>
      <ToolbarButton onClick={addVideo} title="Embed YouTube Video">
        <Video className={iconSize} />
      </ToolbarButton>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
    </div>
  );
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4] },
      }),
      TextStyle,
      Color,
      FontSize,
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder: "Write your post content here…" }),
      Youtube.configure({ inline: false, nocookie: true }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
