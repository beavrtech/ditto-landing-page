"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { useState, useCallback, useEffect } from "react";

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

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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
        <button type="button" style={btnStyle()} onClick={addImage}>Image</button>
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
    </div>
  );
}
