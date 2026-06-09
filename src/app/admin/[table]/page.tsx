"use client";

import { useParams } from "next/navigation";
import { getTableConfig } from "../../../lib/admin-tables";
import { GenericListPage } from "../../../components/admin/GenericListPage";

export default function TableListPage() {
  const { table } = useParams<{ table: string }>();
  const config = getTableConfig(table);

  if (!config) return <p>Unknown table: {table}</p>;

  return <GenericListPage config={config} />;
}
