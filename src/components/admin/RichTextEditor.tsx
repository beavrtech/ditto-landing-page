"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useState, useCallback, useEffect, useRef } from "react";

const btnStyle = (active?: boolean): React.CSSProperties => ({
  padding: "4px 8px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  background: active ? "#130E30" : "white",
  color: active ? "white" : "#333",
  cursor: "pointer",
  fontSize: "0.8rem",
  fontWeight: 500,
});

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/admin/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

function ImageUploadModal({
  onInsert,
  onClose,
}: {
  onInsert: (url: string) => void;
  onClose: () => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setUploading(true);
    setError(null);
    try {
      const url = await uploadImage(file);
      onInsert(url);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999 }}
      onClick={onClose}
    >
      <div
        style={{ background: "white", borderRadius: "12px", padding: "2rem", width: "420px", maxWidth: "90vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ margin: "0 0 1rem", fontSize: "1.1rem", fontWeight: 600 }}>Insert Image</h3>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#130E30" : "#ccc"}`,
            borderRadius: "8px",
            padding: "2.5rem 1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "#f0f0ff" : "#fafafa",
            transition: "all 150ms",
          }}
        >
          {uploading ? (
            <p style={{ margin: 0, color: "#666" }}>Uploading...</p>
          ) : (
            <>
              <p style={{ margin: "0 0 0.5rem", fontSize: "0.95rem", fontWeight: 500 }}>
                Drop an image here or click to browse
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#999" }}>
                PNG, JPG, AVIF, WebP, SVG, GIF
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleFileInput}
        />
        {error && <p style={{ color: "#dc2626", fontSize: "0.875rem", marginTop: "0.75rem" }}>{error}</p>}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1rem" }}>
          <button
            type="button"
            onClick={onClose}
            style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", background: "white", cursor: "pointer", fontSize: "0.875rem" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export function RichTextEditor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (html: string) => void;
  label?: string;
}) {
  const [showSource, setShowSource] = useState(false);
  const [sourceValue, setSourceValue] = useState(value);
  const [showImageModal, setShowImageModal] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({ openOnClick: false }),
      ImageExtension,
      Table.configure({ resizable: true }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const handleImageInsert = useCallback((url: string) => {
    if (!editor) return;
    editor.chain().focus().setImage({ src: url }).run();
    setShowImageModal(false);
  }, [editor]);

  const toggleSource = () => {
    if (showSource && editor) {
      editor.commands.setContent(sourceValue, { emitUpdate: false });
      onChange(sourceValue);
    } else if (editor) {
      setSourceValue(editor.getHTML());
    }
    setShowSource(!showSource);
  };

  if (!editor) return null;

  return (
    <div>
      {label && <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, fontSize: "0.875rem" }}>{label}</label>}
      {/* Toolbar */}
      <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", padding: "8px", background: "#fafafa", border: "1px solid #ddd", borderBottom: "none", borderRadius: "6px 6px 0 0" }}>
        <button type="button" style={btnStyle(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" style={btnStyle(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" style={btnStyle(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}>B</button>
        <button type="button" style={btnStyle(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}>I</button>
        <button type="button" style={btnStyle(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}>List</button>
        <button type="button" style={btnStyle(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}>1.</button>
        <button type="button" style={btnStyle(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}>Quote</button>
        <button type="button" style={btnStyle(editor.isActive("link"))} onClick={addLink}>Link</button>
        <button type="button" style={btnStyle()} onClick={() => setShowImageModal(true)}>Image</button>
        <button type="button" style={btnStyle()} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>Table</button>
        <div style={{ flex: 1 }} />
        <button type="button" style={btnStyle(showSource)} onClick={toggleSource}>&lt;/&gt;</button>
      </div>
      {/* Editor or source */}
      {showSource ? (
        <textarea
          value={sourceValue}
          onChange={(e) => setSourceValue(e.target.value)}
          style={{
            width: "100%",
            minHeight: "300px",
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "0 0 6px 6px",
            fontFamily: "monospace",
            fontSize: "0.875rem",
            boxSizing: "border-box",
            resize: "vertical",
          }}
        />
      ) : (
        <div style={{ border: "1px solid #ddd", borderRadius: "0 0 6px 6px", background: "white" }}>
          <style>{`
            .ProseMirror { padding: 1rem; min-height: 300px; outline: none; }
            .ProseMirror h2 { font-size: 1.5rem; font-weight: 600; margin: 1.5rem 0 0.75rem; }
            .ProseMirror h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.5rem; }
            .ProseMirror p { margin: 0.5rem 0; line-height: 1.6; }
            .ProseMirror ul, .ProseMirror ol { padding-left: 1.5rem; }
            .ProseMirror a { color: #2563eb; text-decoration: underline; }
            .ProseMirror img { max-width: 100%; height: auto; border-radius: 4px; }
            .ProseMirror blockquote { border-left: 3px solid #ddd; padding-left: 1rem; color: #666; }
            .ProseMirror table { border-collapse: collapse; width: 100%; }
            .ProseMirror th, .ProseMirror td { border: 1px solid #ddd; padding: 0.5rem; text-align: left; }
            .ProseMirror th { background: #f5f5f5; font-weight: 600; }
          `}</style>
          <EditorContent editor={editor} />
        </div>
      )}
      {/* Image upload modal */}
      {showImageModal && (
        <ImageUploadModal
          onInsert={handleImageInsert}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </div>
  );
}
