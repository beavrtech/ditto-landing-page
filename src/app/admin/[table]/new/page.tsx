"use client";

import { useParams } from "next/navigation";
import { getTableConfig } from "../../../../lib/admin-tables";
import { GenericEditForm } from "../../../../components/admin/GenericEditForm";

export default function NewItemPage() {
  const { table } = useParams<{ table: string }>();
  const config = getTableConfig(table);

  if (!config) return <p>Unknown table: {table}</p>;

  // Build empty object from field config
  const empty: Record<string, any> = {};
  for (const field of config.fields) {
    if (field.locale) {
      empty[`${field.name}_en`] = field.type === "boolean" ? false : "";
      empty[`${field.name}_fr`] = field.type === "boolean" ? false : "";
    } else {
      empty[field.name] = field.type === "boolean" ? false : "";
    }
  }

  return <GenericEditForm config={config} data={empty} isNew />;
}
