"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getTableConfig } from "../../../../lib/admin-tables";
import { GenericEditForm } from "../../../../components/admin/GenericEditForm";

export default function EditPage() {
  const { table, id } = useParams<{ table: string; id: string }>();
  const config = getTableConfig(table);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config) return;
    fetch(`/admin/api/tables/${table}/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setData)
      .catch((err) => setError(err.message));
  }, [table, id, config]);

  if (!config) return <p>Unknown table: {table}</p>;
  if (error) return (
    <div>
      <p style={{ color: "#dc2626", marginBottom: "1rem" }}>Item not found</p>
      <a href={`/admin/${table}`} style={{ color: "#130E30" }}>&larr; Back to {config.displayName}</a>
    </div>
  );
  if (!data) return <p>Loading...</p>;

  return <GenericEditForm config={config} data={data} />;
}
