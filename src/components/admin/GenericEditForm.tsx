"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "./RichTextEditor";
import { ImageField } from "./ImageField";
import type { TableConfig, FieldDef } from "../../lib/admin-tables";

const fieldStyle: React.CSSProperties = { marginBottom: "1.5rem" };
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.375rem", fontWeight: 500, fontSize: "0.875rem", color: "#333" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "0.625rem 0.75rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.875rem", boxSizing: "border-box" };
const sectionStyle: React.CSSProperties = { background: "white", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", marginBottom: "1.5rem" };

function getFieldKey(field: FieldDef, locale?: string): string {
  if (field.locale && locale) return `${field.name}_${locale}`;
  return field.name;
}

function hasLocaleFields(fields: FieldDef[]): boolean {
  return fields.some((f) => f.locale);
}

export function GenericEditForm({
  config,
  data: initialData,
  isNew,
}: {
  config: TableConfig;
  data: Record<string, any>;
  isNew?: boolean;
}) {
  const router = useRouter();
  const [data, setData] = useState<Record<string, any>>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"en" | "fr">("en");

  const set = (key: string, value: any) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const url = isNew
        ? `/admin/api/tables/${config.slug}`
        : `/admin/api/tables/${config.slug}/${data.id}`;
      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Save failed");
      } else if (isNew) {
        router.push(`/admin/${config.slug}/${result.id}`);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (err: any) {
      setError(err.message);
    }
    setSaving(false);
  };

  const showLocale = hasLocaleFields(config.fields);
  const nonLocaleFields = config.fields.filter((f) => !f.locale);
  const localeFields = config.fields.filter((f) => f.locale);

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

  const renderField = (field: FieldDef, key: string) => {
    const val = data[key];
    switch (field.type) {
      case "image":
        return (
          <div key={key}>
            <ImageField
              label={field.label}
              value={val || null}
              onChange={(url) => set(key, url || "")}
            />
          </div>
        );
      case "richtext":
        return (
          <div key={key} style={fieldStyle}>
            <RichTextEditor
              label={field.label}
              value={val || ""}
              onChange={(html) => set(key, html)}
            />
          </div>
        );
      case "textarea":
        return (
          <div key={key} style={fieldStyle}>
            <label style={labelStyle}>{field.label}</label>
            <textarea
              style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }}
              value={val || ""}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        );
      case "date":
        return (
          <div key={key} style={fieldStyle}>
            <label style={labelStyle}>{field.label}</label>
            <input
              type="date"
              style={inputStyle}
              value={val ? String(val).slice(0, 10) : ""}
              onChange={(e) => set(key, e.target.value ? new Date(e.target.value).toISOString() : null)}
            />
          </div>
        );
      case "boolean":
        return (
          <div key={key} style={{ ...fieldStyle, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <input
              type="checkbox"
              checked={!!val}
              onChange={(e) => set(key, e.target.checked)}
              style={{ width: "18px", height: "18px" }}
            />
            <label style={{ fontSize: "0.875rem", fontWeight: 500 }}>{field.label}</label>
          </div>
        );
      default:
        return (
          <div key={key} style={fieldStyle}>
            <label style={labelStyle}>{field.label}</label>
            <input
              style={inputStyle}
              value={val ?? ""}
              onChange={(e) => set(key, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <div>
          <button onClick={() => router.push(`/admin/${config.slug}`)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "0.875rem", padding: 0, marginBottom: "0.5rem" }}>
            &larr; Back to {config.displayName}
          </button>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
            {isNew ? `New ${config.displayName.replace(/s$/, "")}` : `Edit: ${data.name_en || data.name || data.slug || "(untitled)"}`}
          </h1>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          {saved && <span style={{ color: "#16a34a", fontSize: "0.875rem" }}>Saved</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "0.625rem 1.5rem", background: "#130E30", color: "white", border: "none", borderRadius: "6px", fontSize: "0.875rem", cursor: "pointer", opacity: saving ? 0.6 : 1 }}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {error && <div style={{ padding: "0.75rem", background: "#fef2f2", color: "#dc2626", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.875rem" }}>{error}</div>}

      {/* Non-locale fields */}
      <div style={sectionStyle}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>Fields</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1.5rem" }}>
          {nonLocaleFields.filter((f) => f.type !== "richtext" && f.type !== "boolean" && f.type !== "image").map((f) => renderField(f, f.name))}
        </div>
        {nonLocaleFields.filter((f) => f.type === "image").map((f) => renderField(f, f.name))}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {nonLocaleFields.filter((f) => f.type === "boolean").map((f) => renderField(f, f.name))}
        </div>
        {nonLocaleFields.filter((f) => f.type === "richtext").map((f) => renderField(f, f.name))}
      </div>

      {/* Locale fields */}
      {showLocale && (
        <>
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #ddd", marginBottom: "1.5rem" }}>
            <button type="button" style={tabBtnStyle(activeTab === "en")} onClick={() => setActiveTab("en")}>English</button>
            <button type="button" style={tabBtnStyle(activeTab === "fr")} onClick={() => setActiveTab("fr")}>French</button>
          </div>

          <div style={sectionStyle}>
            <h2 style={{ fontSize: "1rem", fontWeight: 600, margin: "0 0 1rem", color: "#333" }}>
              Content ({activeTab === "en" ? "English" : "French"})
            </h2>
            {localeFields.filter((f) => f.type !== "richtext").map((f) => renderField(f, getFieldKey(f, activeTab)))}
            {localeFields.filter((f) => f.type === "richtext").map((f) => renderField(f, getFieldKey(f, activeTab)))}
          </div>
        </>
      )}
    </div>
  );
}
