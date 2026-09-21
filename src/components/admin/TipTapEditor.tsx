"use client";

import { cn } from "@/lib/cn";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  readonly?: boolean;
}

export function TipTapEditor({ value, onChange, placeholder, className, readonly }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Placeholder.configure({ placeholder: placeholder ?? "Escribe aquí…" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-accent underline", target: "_blank", rel: "noopener noreferrer" },
      }),
    ],
    content: value,
    editable: !readonly,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) {
    return (
      <textarea
        className={cn(
          "w-full min-h-[120px] p-4 border border-border rounded-xl bg-surface text-fg placeholder:text-muted/50 resize-y focus:outline-none focus:ring-2 focus:ring-accent",
          className,
        )}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readonly}
      />
    );
  }

  const addLink = () => {
    const url = window.prompt("URL del enlace:");
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
  };

  return (
    <div className={cn("border border-border rounded-xl bg-surface overflow-hidden", className)}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-border bg-background/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Encabezado 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Encabezado 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 text-xs font-bold hover:bg-secondary rounded transition-colors"
          title="Negrita (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 text-xs italic hover:bg-secondary rounded transition-colors"
          title="Cursiva (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-2 py-1 text-xs underline hover:bg-secondary rounded transition-colors"
          title="Subrayado (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Lista con viñetas"
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Lista numerada"
        >
          1. Lista
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Alinear izquierda"
        >
          ⟐
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Centrar"
        >
          ⬜
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Alinear derecha"
        >
          ⟐
        </button>
        <div className="w-px h-6 bg-border mx-1" />
        <button
          type="button"
          onClick={addLink}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors"
          title="Agregar enlace"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.can().unsetLink()}
          className="px-2 py-1 text-xs hover:bg-secondary rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Quitar enlace"
        >
          ⛓️
        </button>
      </div>

      {/* Editor content */}
      <EditorContent editor={editor} className="prose prose-sm max-w-none p-4 min-h-[120px] focus:outline-none" />
    </div>
  );
}