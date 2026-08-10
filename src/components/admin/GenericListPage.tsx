"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type FilterFn,
  type Column,
} from "@tanstack/react-table";
import type { TableConfig } from "../../lib/admin-tables";

type Row = Record<string, unknown> & { id: string };

type DateRange = { from?: string; to?: string };

const isDateKey = (key: string) =>
  key.includes("date") || key === "publish_date";

// Colors + display labels for the editorial_calendar `status` enum. Falls
// back to the raw value if a new status is added to the DB before here.
const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  ready_for_drafting: { bg: "#f3f4f6", color: "#374151", label: "Ready for drafting" },
  drafted: { bg: "#dbeafe", color: "#1e40af", label: "Drafted" },
  published: { bg: "#dcfce7", color: "#166534", label: "Published" },
};

const cellText = (val: unknown, key: string): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") {
    return key === "published" ? (val ? "Published" : "Draft") : val ? "Yes" : "No";
  }
  if (key === "status") return STATUS_STYLES[val as string]?.label ?? String(val);
  if (isDateKey(key)) return new Date(val as string).toLocaleDateString("fr-FR");
  return String(val);
};

const columnFilterFn: FilterFn<Row> = (row, columnId, filterValue) => {
  if (filterValue === "" || filterValue == null) return true;
  const val = row.getValue(columnId);
  if (typeof filterValue === "object") {
    const { from, to } = filterValue as DateRange;
    if (!from && !to) return true;
    const t = val ? new Date(val as string).getTime() : NaN;
    if (isNaN(t)) return false;
    if (from && t < new Date(from).getTime()) return false;
    if (to && t > new Date(to).getTime() + 86_399_999) return false;
    return true;
  }
  if (typeof val === "boolean") return filterValue === (val ? "true" : "false");
  const q = String(filterValue).toLowerCase();
  const raw = val === null || val === undefined ? "" : String(val).toLowerCase();
  return raw.includes(q) || cellText(val, columnId).toLowerCase().includes(q);
};

const globalFilterFn: FilterFn<Row> = (row, _columnId, filterValue) => {
  if (!filterValue) return true;
  const q = String(filterValue).toLowerCase();
  return row.getAllCells().some((cell) => {
    if (cell.column.id === "actions") return false;
    const val = cell.getValue();
    if (val === null || val === undefined) return false;
    return (
      String(val).toLowerCase().includes(q) ||
      cellText(val, cell.column.id).toLowerCase().includes(q)
    );
  });
};

const hasActiveFilter = (value: unknown): boolean => {
  if (value == null || value === "") return false;
  if (typeof value === "object") {
    const { from, to } = value as DateRange;
    return Boolean(from || to);
  }
  return true;
};

const popoverInputStyle: React.CSSProperties = {
  width: "100%", padding: "0.4rem 0.5rem", border: "1px solid #ddd", borderRadius: "6px",
  fontSize: "0.8rem", fontWeight: 400, color: "#333", background: "white",
  textTransform: "none", boxSizing: "border-box",
};

const popoverLabelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.65rem", fontWeight: 600, color: "#999",
  textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.25rem",
};

function SortIcon({ sorted }: { sorted: false | "asc" | "desc" }) {
  const activeColor = "#130E30";
  const idleColor = "#c4c4cc";
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" style={{ flexShrink: 0 }} aria-hidden="true">
      <path
        d="M7 1.5 L10.5 5.5 L3.5 5.5 Z"
        fill={sorted === "asc" ? activeColor : idleColor}
      />
      <path
        d="M7 12.5 L3.5 8.5 L10.5 8.5 Z"
        fill={sorted === "desc" ? activeColor : idleColor}
      />
    </svg>
  );
}

function FilterIcon({ active }: { active: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M1.5 2 H12.5 L8.5 7 V11.5 L5.5 12.5 V7 Z"
        fill={active ? "#130E30" : "none"}
        stroke={active ? "#130E30" : "#999"}
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterPopover({ column, rows, onClose }: {
  column: Column<Row, unknown>;
  rows: Row[];
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const value = column.getFilterValue();
  const isDate = isDateKey(column.id);
  const isBoolean = !isDate && rows.some((r) => typeof r[column.id] === "boolean");
  const isStatus = column.id === "published";

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const range = (typeof value === "object" && value !== null ? value : {}) as DateRange;
  const setRange = (patch: DateRange) => {
    const next = { ...range, ...patch };
    column.setFilterValue(next.from || next.to ? next : undefined);
  };

  return (
    <div
      ref={ref}
      style={{
        position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 20,
        minWidth: isDate ? "220px" : "180px", padding: "0.75rem",
        background: "white", border: "1px solid #e5e5e5", borderRadius: "8px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)", textAlign: "left",
      }}
    >
      {isDate ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          <div>
            <label style={popoverLabelStyle}>From</label>
            <input
              type="date"
              value={range.from ?? ""}
              onChange={(e) => setRange({ from: e.target.value || undefined })}
              style={popoverInputStyle}
            />
          </div>
          <div>
            <label style={popoverLabelStyle}>To</label>
            <input
              type="date"
              value={range.to ?? ""}
              onChange={(e) => setRange({ to: e.target.value || undefined })}
              style={popoverInputStyle}
            />
          </div>
        </div>
      ) : isBoolean ? (
        <select
          value={(value ?? "") as string}
          onChange={(e) => column.setFilterValue(e.target.value || undefined)}
          style={popoverInputStyle}
        >
          <option value="">All</option>
          <option value="true">{isStatus ? "Published" : "Yes"}</option>
          <option value="false">{isStatus ? "Draft" : "No"}</option>
        </select>
      ) : (
        <input
          type="text"
          autoFocus
          value={(value ?? "") as string}
          placeholder="Filter..."
          onChange={(e) => column.setFilterValue(e.target.value || undefined)}
          style={popoverInputStyle}
        />
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
        <button
          onClick={() => { column.setFilterValue(undefined); onClose(); }}
          disabled={!hasActiveFilter(value)}
          style={{
            background: "none", border: "none", padding: 0, cursor: hasActiveFilter(value) ? "pointer" : "default",
            fontSize: "0.75rem", fontWeight: 500, textTransform: "none",
            color: hasActiveFilter(value) ? "#dc2626" : "#ccc",
          }}
        >
          Clear
        </button>
        <button
          onClick={onClose}
          style={{
            background: "#130E30", color: "white", border: "none", borderRadius: "6px",
            padding: "0.3rem 0.75rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 500,
            textTransform: "none",
          }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

function ExpandedCellModal({ title, titleEditable, body, prompt, onSave, onClose }: {
  title: string;
  titleEditable: boolean;
  body: string;
  prompt: string | null;
  onSave: (next: { title?: string; body?: string }) => Promise<void>;
  onClose: () => void;
}) {
  const [titleValue, setTitleValue] = useState(title);
  const [value, setValue] = useState(body);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const titleDirty = titleEditable && titleValue !== title;
  const bodyDirty = value !== body;
  const dirty = titleDirty || bodyDirty;

  // Closing with unsaved edits would lose them silently, so confirm first.
  const requestClose = useCallback(() => {
    if (dirty && !confirm("Discard your unsaved changes?")) return;
    onClose();
  }, [dirty, onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [requestClose]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      // Send only what changed, so an untouched field is never rewritten.
      await onSave({
        ...(titleDirty ? { title: titleValue } : {}),
        ...(bodyDirty ? { body: value } : {}),
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard writes need a secure context; fall back so the prompt is
      // still reachable over plain http.
      window.prompt("Copy this prompt:", prompt);
    }
  };

  return (
    <div
      onClick={requestClose}
      style={{
        position: "fixed", inset: 0, zIndex: 50, background: "rgba(19,14,48,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "white", borderRadius: "10px", boxShadow: "0 8px 40px rgba(0,0,0,0.25)",
          width: "min(720px, 100%)", maxHeight: "80vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", padding: "1.25rem 1.5rem", borderBottom: "1px solid #eee" }}>
          {titleEditable ? (
            <input
              value={titleValue}
              onChange={(e) => setTitleValue(e.target.value)}
              aria-label="Title"
              style={{
                flex: 1, padding: "0.4rem 0.5rem", border: "1px solid transparent",
                borderRadius: "6px", fontSize: "1rem", fontWeight: 600, lineHeight: 1.4,
                fontFamily: "inherit", color: "#130E30", background: "#f7f7f8",
                boxSizing: "border-box", minWidth: 0,
              }}
              onFocus={(e) => { e.target.style.borderColor = "#ddd"; e.target.style.background = "white"; }}
              onBlur={(e) => { e.target.style.borderColor = "transparent"; e.target.style.background = "#f7f7f8"; }}
            />
          ) : (
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 }}>{title}</h2>
          )}
          <button
            onClick={requestClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", lineHeight: 1, color: "#666", padding: 0 }}
          >
            &times;
          </button>
        </div>

        <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", flex: 1 }}>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              width: "100%", minHeight: "45vh", boxSizing: "border-box",
              padding: "0.75rem", border: "1px solid #ddd", borderRadius: "6px",
              fontSize: "0.875rem", lineHeight: 1.6, resize: "vertical",
              fontFamily: "inherit",
            }}
          />
          {error && (
            <p style={{ color: "#dc2626", fontSize: "0.8rem", margin: "0.5rem 0 0" }}>{error}</p>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", padding: "1rem 1.5rem", borderTop: "1px solid #eee" }}>
          {prompt ? (
            <button
              onClick={handleCopy}
              title={prompt}
              style={{
                padding: "0.45rem 0.8rem", borderRadius: "6px", cursor: "pointer",
                fontSize: "0.8rem", fontWeight: 500, whiteSpace: "nowrap",
                border: `1px solid ${copied ? "#16a34a" : "#ddd"}`,
                background: copied ? "#dcfce7" : "white",
                color: copied ? "#166534" : "#130E30",
              }}
            >
              {copied ? "Prompt copied" : "Iterate with AI"}
            </button>
          ) : <span />}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <button
              onClick={requestClose}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem", color: "#666" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !dirty}
              style={{
                padding: "0.45rem 1rem", borderRadius: "6px", border: "none",
                fontSize: "0.8rem", fontWeight: 500,
                cursor: saving || !dirty ? "default" : "pointer",
                background: saving || !dirty ? "#c9c7d4" : "#130E30",
                color: "white",
              }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Pill-shaped show/hide switch for `config.statusFilter`. No toggle/switch
// control exists elsewhere in the admin section yet, so this one is kept
// small and local rather than introducing a new shared component.
function StatusFilterToggle({ show, hiddenLabel, hiddenCount, onChange }: {
  show: boolean;
  hiddenLabel: string;
  hiddenCount: number;
  onChange: (next: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!show)}
      aria-pressed={show}
      title={show ? `Hide ${hiddenLabel.toLowerCase()} items` : `Show ${hiddenLabel.toLowerCase()} items`}
      style={{
        display: "inline-flex", alignItems: "center", gap: "0.5rem",
        padding: "0.4rem 0.7rem", border: "1px solid #ddd", borderRadius: "999px",
        background: "white", cursor: "pointer", fontSize: "0.8rem", color: "#333",
        whiteSpace: "nowrap",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "relative", width: "30px", height: "16px", borderRadius: "999px",
          background: show ? "#130E30" : "#ddd", transition: "background 0.15s", flexShrink: 0,
        }}
      >
        <span
          style={{
            position: "absolute", top: "2px", left: show ? "16px" : "2px",
            width: "12px", height: "12px", borderRadius: "50%", background: "white",
            transition: "left 0.15s", boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
          }}
        />
      </span>
      Show {hiddenLabel.toLowerCase()}
      {hiddenCount > 0 ? ` (${hiddenCount})` : ""}
    </button>
  );
}

export function GenericListPage({ config }: { config: TableConfig }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>(() =>
    config.listColumns.some((c) => c.key === config.orderBy.column)
      ? [{ id: config.orderBy.column, desc: !config.orderBy.ascending }]
      : []
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  // Hidden by default: rows matching `config.statusFilter.hiddenValue` (e.g.
  // published editorial calendar items) stay out of view until toggled on.
  const [showHiddenStatus, setShowHiddenStatus] = useState(false);
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<
    {
      id: string; key: string; body: string; prompt: string | null;
      title: string; titleKey: string | null;
    } | null
  >(null);

  const fetchRows = async () => {
    const res = await fetch(`/admin/api/tables/${config.slug}`);
    if (res.ok) setRows(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchRows(); }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/admin/api/tables/${config.slug}/${id}`, { method: "DELETE" });
    fetchRows();
  };

  const formatCell = (row: Row, key: string, wrap = false) => {
    const val = row[key];
    if (val === null || val === undefined) return "—";
    if (typeof val === "boolean") {
      return (
        <span style={{
          display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 500,
          background: val ? "#dcfce7" : "#fef3c7", color: val ? "#166534" : "#92400e",
        }}>
          {cellText(val, key)}
        </span>
      );
    }
    if (key === "status") {
      const style = STATUS_STYLES[val as string];
      return (
        <span style={{
          display: "inline-block", padding: "2px 8px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 500,
          background: style?.bg ?? "#f3f4f6", color: style?.color ?? "#374151",
        }}>
          {style?.label ?? String(val)}
        </span>
      );
    }
    if (isDateKey(key)) return cellText(val, key);
    const str = String(val);
    // Wrapping columns show the whole value, preserving newlines.
    if (wrap) return <span style={{ whiteSpace: "pre-wrap" }}>{str}</span>;
    return str.length > 60 ? str.slice(0, 60) + "..." : str;
  };

  // The column a row's label comes from, so the modal can write it back.
  // Null when we fall through to the id, which is not editable.
  const rowLabelKey = (row: Row) =>
    ["title", "name_en", "name", "slug"].find((k) => row[k]) ?? null;

  const rowLabel = (row: Row) => {
    const key = rowLabelKey(row);
    return String(key ? row[key] : row.id);
  };

  const columns = useMemo<ColumnDef<Row>[]>(() => [
    ...config.listColumns.map((col, i): ColumnDef<Row> => ({
      accessorKey: col.key,
      id: col.key,
      header: col.label,
      filterFn: columnFilterFn,
      sortUndefined: "last",
      cell: ({ row }) => {
        const raw = row.original[col.key];
        // Non-wrapping cells truncate at 60 chars, so expose the full value on hover.
        const full = raw === null || raw === undefined ? undefined : String(raw);
        const subVal = col.sub ? row.original[col.sub] : undefined;

        if (col.clamp && full) {
          // Approximate whether the text overflows the clamp rather than
          // measuring the DOM: either it has more lines than the clamp allows,
          // or it is long enough that it certainly wraps past them.
          const overflows =
            full.split("\n").length > col.clamp || full.length > col.clamp * 55;
          return (
            <div>
              <div
                style={{
                  display: "-webkit-box", WebkitLineClamp: col.clamp, WebkitBoxOrient: "vertical",
                  overflow: "hidden", whiteSpace: "pre-wrap", lineHeight: 1.5,
                }}
              >
                {full}
              </div>
              {overflows && (
                <button
                  onClick={() => setExpanded({
                    id: row.original.id,
                    key: col.key,
                    titleKey: rowLabelKey(row.original),
                    title: rowLabel(row.original),
                    body: full,
                    prompt: config.copyPrompt
                      ? config.copyPrompt.replace(/\{(\w+)\}/g, (_m, k: string) => String(row.original[k] ?? ""))
                      : null,
                  })}
                  style={{
                    marginTop: "0.35rem", padding: 0, background: "none", border: "none",
                    color: "#130E30", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600,
                  }}
                >
                  Show more
                </button>
              )}
            </div>
          );
        }
        const main = i === 0 && !config.readOnly ? (
          <Link href={`/admin/${config.slug}/${row.original.id}`} style={{ color: "#130E30", textDecoration: "none", fontWeight: 500 }}>
            {formatCell(row.original, col.key, col.wrap)}
          </Link>
        ) : (
          <span title={col.wrap ? undefined : full} style={{ color: col.key === "slug" ? "#666" : undefined, fontFamily: col.key === "slug" ? "monospace" : undefined, fontSize: col.key === "slug" ? "0.8rem" : undefined }}>
            {formatCell(row.original, col.key, col.wrap)}
          </span>
        );
        if (subVal === null || subVal === undefined || subVal === "") return main;
        return (
          <div>
            <div>{main}</div>
            <div
              title={String(subVal)}
              style={{
                marginTop: "0.2rem", color: "#888", fontSize: "0.75rem",
                fontFamily: col.subMono ? "monospace" : undefined,
                wordBreak: col.subMono ? "break-all" : undefined,
              }}
            >
              {String(subVal)}
            </div>
          </div>
        );
      },
    })),
    ...(config.readOnly || config.hideDelete ? [] : [{
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => (
        <button
          onClick={() => handleDelete(row.original.id, String(row.original.name_en || row.original.name || row.original.slug || row.original.id))}
          style={{ background: "none", border: "none", color: "#dc2626", cursor: "pointer", fontSize: "0.8rem" }}
        >
          Delete
        </button>
      ),
    } as ColumnDef<Row>]),
  ], [config]);

  // Filtering, not deletion: hidden rows stay in `rows` and simply drop out
  // of what's handed to the table when the toggle is off. Memoised because
  // react-table resets its internal state whenever `data` changes identity,
  // and a fresh array on every render turns that into an endless re-render.
  const hiddenStatusCount = useMemo(
    () =>
      config.statusFilter
        ? rows.filter((r) => r[config.statusFilter!.column] === config.statusFilter!.hiddenValue).length
        : 0,
    [config, rows]
  );
  const displayRows = useMemo(
    () =>
      config.statusFilter && !showHiddenStatus
        ? rows.filter((r) => r[config.statusFilter!.column] !== config.statusFilter!.hiddenValue)
        : rows,
    [config, rows, showHiddenStatus]
  );

  const table = useReactTable({
    data: displayRows,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) return <p>Loading...</p>;

  const visibleRows = table.getRowModel().rows;
  // Fixed layout only when the config asks for widths, so tables that declare
  // none keep the browser's auto sizing.
  const hasWidths = config.listColumns.some((c) => c.width);
  // Generated columns are not in listColumns, so they carry their own widths.
  const GENERATED_WIDTHS: Record<string, string> = { ai: "120px", actions: "80px" };
  const widthFor = (id: string) =>
    config.listColumns.find((c) => c.key === id)?.width ?? GENERATED_WIDTHS[id];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>{config.displayName} ({visibleRows.length})</h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          {config.statusFilter && (
            <StatusFilterToggle
              show={showHiddenStatus}
              hiddenLabel={config.statusFilter.hiddenLabel}
              hiddenCount={hiddenStatusCount}
              onChange={setShowHiddenStatus}
            />
          )}
          <input
            type="text"
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            style={{ padding: "0.5rem 0.75rem", border: "1px solid #ddd", borderRadius: "6px", fontSize: "0.875rem", width: "220px" }}
          />
        {!config.readOnly && (
          <Link
            href={`/admin/${config.slug}/new`}
            style={{ padding: "0.5rem 1rem", background: "#130E30", color: "white", borderRadius: "6px", textDecoration: "none", fontSize: "0.875rem" }}
          >
            + New
          </Link>
        )}
        </div>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "white", borderRadius: "8px", overflow: "visible", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", tableLayout: hasWidths ? "fixed" : "auto" }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ background: "#f9fafb", borderBottom: "1px solid #eee" }}>
              {headerGroup.headers.map((header) => {
                const isActions = header.column.id === "actions";
                const sorted = header.column.getIsSorted();
                const filterActive = hasActiveFilter(header.column.getFilterValue());
                return (
                  <th
                    key={header.id}
                    style={{
                      padding: "0.65rem 1rem", textAlign: isActions ? "right" : "left", fontSize: "0.75rem",
                      fontWeight: 600, color: "#666", textTransform: "uppercase",
                      position: "relative", whiteSpace: "nowrap",
                      width: widthFor(header.column.id),
                    }}
                  >
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <span
                        onClick={header.column.getToggleSortingHandler()}
                        style={{
                          cursor: header.column.getCanSort() ? "pointer" : undefined,
                          userSelect: "none", display: "inline-flex", alignItems: "center", gap: "0.3rem",
                          color: sorted ? "#130E30" : undefined,
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <SortIcon sorted={sorted} />}
                      </span>
                      {header.column.getCanFilter() && !isActions && (
                        <button
                          onClick={() => setOpenFilter(openFilter === header.column.id ? null : header.column.id)}
                          title="Filter"
                          style={{
                            display: "inline-flex", alignItems: "center", justifyContent: "center",
                            width: "22px", height: "22px", padding: 0,
                            background: filterActive || openFilter === header.column.id ? "#eceafb" : "none",
                            border: "none", borderRadius: "5px", cursor: "pointer",
                          }}
                        >
                          <FilterIcon active={filterActive} />
                        </button>
                      )}
                    </span>
                    {openFilter === header.column.id && (
                      <FilterPopover
                        column={header.column}
                        rows={rows}
                        onClose={() => setOpenFilter(null)}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {visibleRows.map((row) => (
            <tr key={row.original.id ?? row.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  style={{
                    padding: "0.75rem 1rem", fontSize: "0.875rem",
                    textAlign: cell.column.id === "actions" ? "right" : "left",
                    verticalAlign: "top",
                  }}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {visibleRows.length === 0 && (
            <tr>
              <td colSpan={columns.length} style={{ padding: "1.5rem 1rem", fontSize: "0.875rem", color: "#666", textAlign: "center" }}>
                No results
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {expanded && (
        <ExpandedCellModal
          title={expanded.title}
          titleEditable={expanded.titleKey !== null}
          body={expanded.body}
          prompt={expanded.prompt}
          onSave={async (next) => {
            const patch: Record<string, string> = {};
            if (next.title !== undefined && expanded.titleKey) patch[expanded.titleKey] = next.title;
            if (next.body !== undefined) patch[expanded.key] = next.body;
            if (!Object.keys(patch).length) return;

            const res = await fetch(`/admin/api/tables/${config.slug}/${expanded.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(patch),
            });
            if (!res.ok) {
              const { error } = await res.json().catch(() => ({ error: null }));
              throw new Error(error || `Save failed (${res.status})`);
            }
            // Patch the row in place rather than refetching, so filters and
            // sorting stay where the user left them.
            setRows((cur) => cur.map((r) => (r.id === expanded.id ? { ...r, ...patch } : r)));
          }}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
