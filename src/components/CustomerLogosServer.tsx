import type React from "react";
import { getCustomerStories, getHomepageCustomers } from "../lib/cms";
import { SectionCustomerLogos as SectionCustomerLogosClient } from "./SectionCustomerLogosI18n";
import { CUSTOMER_LOGOS_FALLBACK, dbCustomerToLogo, type CustomerLogo } from "../lib/customer-logos";

/** Homepage customers from the DB, falling back to the static list when empty. */
export async function getHomepageCustomerLogos(): Promise<CustomerLogo[]> {
  const rows = await getHomepageCustomers().catch(() => []);
  if (rows && rows.length) return rows.map(dbCustomerToLogo);
  return CUSTOMER_LOGOS_FALLBACK;
}

export async function SectionCustomerLogos({
  locale,
  afterContent,
}: {
  locale: string;
  afterContent?: React.ReactNode;
}) {
  const [stories, customers] = await Promise.all([
    getCustomerStories(locale as "en" | "fr").catch(() => []),
    getHomepageCustomerLogos(),
  ]);

  const storySlugMap: Record<string, { slug: string; slug_fr: string | null }> = {};
  for (const s of stories || []) {
    storySlugMap[s.slug] = { slug: s.slug, slug_fr: s.slug_fr };
  }

  return (
    <SectionCustomerLogosClient
      serverCustomers={customers}
      serverStorySlugMap={storySlugMap}
      afterContent={afterContent}
    />
  );
}
