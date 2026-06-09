"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./RichTextEditor";

type BlogPost = Record<string, any>;

const fieldStyle: React.CSSProperties = { marginBottom: "1.5rem" };
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.375rem", fontWeight: 500, fontSize: "0.875rem", color: "#333" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.875rem", boxSizing: "border-box" };
const sectionStyle: React.CSSProperties = { background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "1.5rem" };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <input style={inputStyle} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={value || ""} onChange={(e) => onChange(e.target.value)} />
    </Field>
  );
}

export function BlogPostForm({ post, isNew }: { post: BlogPost; isNew?: boolean }) {
  const router = useRouter();
  const [data, setData] = useState<BlogPost>(post);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"en" | "fr">("en");

  const set = (field: string, value: any) => setData((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const url = isNew ? "/admin/api/blog-posts" : `/admin/api/blog-posts/${data.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Save failed");
      } else if (isNew) {
        router.push(`/admin/blog-posts/${result.id}`);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  const tabBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    border: "none",
    borderBottom: active ? "2px solid #130E30" : "2px solid transparent",
    background: "none",
    fontWeight: active ? 600 : 400,
    fontSize: "0.875rem",
    cursor: "pointer",
    color: active ? "#130E30" : "#666",
  });

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <button onClick={() => router.push("/admin/blog-posts")} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.875rem", padding: 0, marginBottom: "0.5rem" }}>
            &larr; Back to list
          </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            {isNew ? "New Blog Post" : `Edit: ${data.name_en || "(untitled)"}`}
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ padding: "0.625rem 1.5rem", background: "#130E30", color: "white", border: "none", borderRadius: "6px", fontSize: "0.875rem", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {error && <div style={{ padding: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

      {/* Basic fields */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>Basic Info</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <TextInput label="Slug" value={data.slug} onChange={(v) => set("slug", v)} />
          <TextInput label="Banner URL" value={data.banner_url} onChange={(v) => set("banner_url", v)} />
          <TextInput label="Banner Alt" value={data.banner_alt_desc} onChange={(v) => set("banner_alt_desc", v)} />
          <Field label="Publication Date">
            <input
              type="date"
              style={inputStyle}
              value={data.date_de_publication ? data.date_de_publication.slice(0, 10) : ""}
              onChange={(e) => set("date_de_publication", e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </Field>
        </div>
      </div>

      {/* Language tabs */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd", marginBottom: "1.5rem" }}>
        <button type="button" style={tabBtnStyle(activeTab === "en")} onClick={() => setActiveTab("en")}>English</button>
        <button type="button" style={tabBtnStyle(activeTab === "fr")} onClick={() => setActiveTab("fr")}>French</button>
      </div>

      {/* Content fields per language */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>
          Content ({activeTab === "en" ? "English" : "French"})
        </h2>
        <TextInput
          label={activeTab === "en" ? "Title (EN)" : "Title (FR)"}
          value={activeTab === "en" ? data.name_en : data.name_fr}
          onChange={(v) => set(activeTab === "en" ? "name_en" : "name_fr", v)}
        />
        <TextArea
          label={activeTab === "en" ? "Description (EN)" : "Description (FR)"}
          value={activeTab === "en" ? data.description_en : data.description_fr}
          onChange={(v) => set(activeTab === "en" ? "description_en" : "description_fr", v)}
        />
        <RichTextEditor
          label={activeTab === "en" ? "Body (EN)" : "Body (FR)"}
          value={(activeTab === "en" ? data.body_en : data.body_fr) || ""}
          onChange={(html) => set(activeTab === "en" ? "body_en" : "body_fr", html)}
        />
      </div>

      {/* SEO */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>
          SEO ({activeTab === "en" ? "English" : "French"})
        </h2>
        <TextInput
          label={activeTab === "en" ? "SEO Title (EN)" : "SEO Title (FR)"}
          value={activeTab === "en" ? data.seo_title_en : data.seo_title_fr}
          onChange={(v) => set(activeTab === "en" ? "seo_title_en" : "seo_title_fr", v)}
        />
        <TextArea
          label={activeTab === "en" ? "Meta Description (EN)" : "Meta Description (FR)"}
          value={activeTab === "en" ? data.seo_meta_desc_en : data.seo_meta_desc_fr}
          onChange={(v) => set(activeTab === "en" ? "seo_meta_desc_en" : "seo_meta_desc_fr", v)}
        />
      </div>

      {/* Slug FR */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>French URL</h2>
        <TextInput label="Slug (FR)" value={data.slug_fr} onChange={(v) => set("slug_fr", v)} />
      </div>
    </div>
  );
}
