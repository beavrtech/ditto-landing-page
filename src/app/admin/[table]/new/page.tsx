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
  const emptyValue = (type: string) =>
    type === "boolean" ? false : type === "multiselect" ? [] : "";
  for (const field of config.fields) {
    if (field.locale) {
      empty[`${field.name}_en`] = emptyValue(field.type);
      empty[`${field.name}_fr`] = emptyValue(field.type);
    } else {
      empty[field.name] = emptyValue(field.type);
    }
  }

  return <GenericEditForm config={config} data={empty} isNew />;
}
