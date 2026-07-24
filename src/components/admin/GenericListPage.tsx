"use client";

import { useEffect, useMemo, useState } from "react";
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

function ColumnFilter({ column, rows }: { column: Column<Row, unknown>; rows: Row[] }) {
  const value = (column.getFilterValue() ?? "") as string;
  const isBoolean = rows.some((r) => typeof r[column.id] === "boolean");

  if (isBoolean) {
    const isStatus = column.id === "published";
    return (
      <select
        value={value}
        onChange={(e) => column.setFilterValue(e.target.value || undefined)}
        style={{
          width: "100%", padding: "0.25rem 0.4rem", border: "1px solid #ddd", borderRadius: "4px",
          fontSize: "0.75rem", fontWeight: 400, color: "#333", background: "white", textTransform: "none",
        }}
      >
        <option value="">All</option>
        <option value="true">{isStatus ? "Published" : "Yes"}</option>
        <option value="false">{isStatus ? "Draft" : "No"}</option>
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      placeholder="Filter..."
      onChange={(e) => column.setFilterValue(e.target.value || undefined)}
      style={{
        width: "100%", padding: "0.25rem 0.4rem", border: "1px solid #ddd", borderRadius: "4px",
        fontSize: "0.75rem", fontWeight: 400, color: "#333", textTransform: "none", boxSizing: "border-box",
      }}
    />
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

  const formatCell = (row: Row, key: string) => {
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
    return str.length > 60 ? str.slice(0, 60) + "..." : str;
  };

  const columns = useMemo<ColumnDef<Row>[]>(() => [
    ...config.listColumns.map((col, i): ColumnDef<Row> => ({
      accessorKey: col.key,
      id: col.key,
      header: col.label,
      filterFn: columnFilterFn,
      sortUndefined: "last",
      cell: ({ row }) =>
        i === 0 ? (
          <Link href={`/admin/${config.slug}/${row.original.id}`} style={{ color: "#130E30", textDecoration: "none", fontWeight: 500 }}>
            {formatCell(row.original, col.key)}
          </Link>
        ) : (
          <span style={{ color: col.key === "slug" ? "#666" : undefined, fontFamily: col.key === "slug" ? "monospace" : undefined, fontSize: col.key === "slug" ? "0.8rem" : undefined }}>
            {formatCell(row.original, col.key)}
          </span>
        ),
    })),
    {
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
    },
  ], [config]);

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
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} style={{ background: "#f9fafb", borderBottom: "1px solid #eee" }}>
              {headerGroup.headers.map((header) => {
                const isActions = header.column.id === "actions";
                const sorted = header.column.getIsSorted();
                return (
                  <th
                    key={header.id}
                    style={{
                      padding: "0.75rem 1rem", textAlign: isActions ? "right" : "left", fontSize: "0.75rem",
                      fontWeight: 600, color: "#666", textTransform: "uppercase", verticalAlign: "top",
                    }}
                  >
                    <span
                      onClick={header.column.getToggleSortingHandler()}
                      style={{
                        cursor: header.column.getCanSort() ? "pointer" : undefined,
                        userSelect: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem",
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sorted && <span style={{ fontSize: "0.65rem" }}>{sorted === "asc" ? "▲" : "▼"}</span>}
                    </span>
                    {header.column.getCanFilter() && !isActions && (
                      <div style={{ marginTop: "0.4rem" }}>
                        <ColumnFilter column={header.column} rows={rows} />
                      </div>
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
    </div>
  );
}
