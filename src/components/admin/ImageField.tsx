"use client";

import { useState, useRef } from "react";

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/admin/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
}

export function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
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
      onChange(url);
    } catch (err: any) {
      setError(err.message);
    }
    setUploading(false);
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
    <div style={{ marginBottom: "1.5rem" }}>
      <label style={{ display: "block", marginBottom: "0.375rem", fontWeight: 500, fontSize: "0.875rem", color: "#333" }}>
        {label}
      </label>

      {value ? (
        // Preview + actions
        <div style={{ border: "1px solid #ddd", borderRadius: "8px", overflow: "hidden", background: "#fafafa" }}>
          <div style={{ padding: "1rem", display: "flex", justifyContent: "center", background: "#f0f0f0" }}>
            <img
              src={value}
              alt=""
              style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "contain", borderRadius: "4px" }}
            />
          </div>
          <div style={{ padding: "0.75rem 1rem", display: "flex", gap: "0.5rem", borderTop: "1px solid #eee" }}>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                padding: "0.375rem 0.75rem", fontSize: "0.8rem", border: "1px solid #ddd",
                borderRadius: "4px", background: "white", cursor: "pointer",
              }}
            >
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              style={{
                padding: "0.375rem 0.75rem", fontSize: "0.8rem", border: "1px solid #ddd",
                borderRadius: "4px", background: "white", color: "#dc2626", cursor: "pointer",
              }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // Dropzone
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? "#130E30" : "#ccc"}`,
            borderRadius: "8px",
            padding: "2rem 1.5rem",
            textAlign: "center",
            cursor: "pointer",
            background: dragging ? "#f0f0ff" : "#fafafa",
            transition: "all 150ms",
          }}
        >
          {uploading ? (
            <p style={{ margin: 0, color: "#666", fontSize: "0.875rem" }}>Uploading...</p>
          ) : (
            <>
              <p style={{ margin: "0 0 0.25rem", fontSize: "0.875rem", fontWeight: 500 }}>
                Drop an image here or click to browse
              </p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#999" }}>
                PNG, JPG, AVIF, WebP, SVG, GIF
              </p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInput}
      />
      {error && <p style={{ color: "#dc2626", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
