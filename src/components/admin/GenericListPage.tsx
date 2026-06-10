"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { TableConfig } from "../../lib/admin-tables";

export function GenericListPage({ config }: { config: TableConfig }) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRows = async () => {
    const res = await fetch(`/admin/api/tables/${config.slug}`);
    if (res.ok) setRows(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const filteredRows = rows.filter((row) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return config.listColumns.some((col) => {
      const val = row[col.key];
      return val && String(val).toLowerCase().includes(q);
    });
  });

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/admin/api/tables/${config.slug}/${id}`, { method: "DELETE" });
    fetchRows();
  };

  const formatCell = (row: any, key: string) => {
    const val = row[key];
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") {
      return (
        <span style={{
          display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 500,
          background: val ? "#dcfce7" : "#fef3c7", color: val ? "#166534" : "#92400e",
        }}>
          {val ? "Yes" : "No"}
        </span>
      );
    }
    if (key.includes("date") || key === "publish_date") {
      return new Date(val).toLocaleDateString("fr-FR");
    }
    if (key === "published") {
      return (
        <span style={{
          display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 500,
          background: val ? "#dcfce7" : "#fef3c7", color: val ? "#166534" : "#92400e",
        }}>
          {val ? "Published" : "Draft"}
        </span>
      );
    }
    const str = String(val);
    return str.length > 60 ? str.slice(0, 60) + "..." : str;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{config.displayName} ({filteredRows.length})</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "0.5rem 0.75rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.875rem", width: "220px" }}
          />
        <Link
          href={`/admin/${config.slug}/new`}
          style={{ padding: "0.5rem 1rem", background: "#130E30", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem" }}
        >
          + New
        </Link>
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
        <thead>
          <tr style={{ background: "#f9fafb", borderBottom: "1px solid #eee" }}>
            {config.listColumns.map((col) => (
              <th key={col.key} style={{ padding: "0.75rem 1rem", textAlign: "left", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>
                {col.label}
              </th>
            ))}
            <th style={{ padding: "0.75rem 1rem", textAlign: "right", fontSize: "0.75rem", fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row) => (
            <tr key={row.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              {config.listColumns.map((col, i) => (
                <td key={col.key} style={{ padding: "0.75rem 1rem", fontSize: "0.875rem" }}>
                  {i === 0 ? (
                    <Link href={`/admin/${config.slug}/${row.id}`} style={{ color: "#130E30", textDecoration: "none", fontWeight: 500 }}>
                      {formatCell(row, col.key)}
                    </Link>
                  ) : (
                    <span style={{ color: col.key === "slug" ? "#666" : undefined, fontFamily: col.key === "slug" ? "monospace" : undefined, fontSize: col.key === "slug" ? "0.8rem" : undefined }}>
                      {formatCell(row, col.key)}
                    </span>
                  )}
                </td>
              ))}
              <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                <button
                  onClick={() => handleDelete(row.id, row.name_en || row.name || row.slug || row.id)}
                  style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.8rem" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
