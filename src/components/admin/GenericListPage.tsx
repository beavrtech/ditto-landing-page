"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

const cellText = (val: unknown, key: string): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "boolean") {
    return key === "published" ? (val ? "Published" : "Draft") : val ? "Yes" : "No";
  }
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

function ExpandedCellModal({ title, body, onClose }: {
  title: string;
  body: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
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
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 }}>{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem", lineHeight: 1, color: "#666", padding: 0 }}
          >
            &times;
          </button>
        </div>
        <div style={{ padding: "1.25rem 1.5rem", overflowY: "auto", fontSize: "0.875rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
          {body}
        </div>
      </div>
    </div>
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
  const [openFilter, setOpenFilter] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ title: string; body: string } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    if (isDateKey(key)) return cellText(val, key);
    const str = String(val);
    // Wrapping columns show the whole value, preserving newlines.
    if (wrap) return <span style={{ whiteSpace: "pre-wrap" }}>{str}</span>;
    return str.length > 60 ? str.slice(0, 60) + "..." : str;
  };

  const rowLabel = (row: Row) =>
    String(row.title || row.name_en || row.name || row.slug || row.id);

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
                  onClick={() => setExpanded({ title: rowLabel(row.original), body: full })}
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
    ...(config.copyPrompt ? [{
      id: "ai",
      header: "AI",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const prompt = (config.copyPrompt || "").replace(
          /\{(\w+)\}/g,
          (_m, key: string) => String(row.original[key] ?? "")
        );
        const done = copiedId === row.original.id;
        return (
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(prompt);
                setCopiedId(row.original.id);
                setTimeout(() => setCopiedId((cur) => (cur === row.original.id ? null : cur)), 1500);
              } catch {
                // Clipboard needs a secure context; surface the prompt so the
                // row is still usable over plain http.
                window.prompt("Copy this prompt:", prompt);
              }
            }}
            title={prompt}
            style={{
              padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer",
              fontSize: "0.75rem", fontWeight: 500, whiteSpace: "nowrap",
              border: `1px solid ${done ? "#16a34a" : "#ddd"}`,
              background: done ? "#dcfce7" : "white",
              color: done ? "#166534" : "#130E30",
            }}
          >
            {done ? "Copied" : "Iterate with AI"}
          </button>
        );
      },
    } as ColumnDef<Row>] : []),
    ...(config.readOnly ? [] : [{
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
    // copiedId is a dependency: without it the memo holds a stale closure and
    // the button never flips to "Copied".
  ], [config, copiedId]);

  const table = useReactTable({
    data: rows,
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
          body={expanded.body}
          onClose={() => setExpanded(null)}
        />
      )}
    </div>
  );
}
