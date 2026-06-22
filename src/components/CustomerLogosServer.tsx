import type React from "react";
import { getCustomerStories } from "../lib/cms";
import { SectionCustomerLogos as SectionCustomerLogosClient } from "./SectionCustomerLogosI18n";

export async function SectionCustomerLogos({
  locale,
  afterContent,
}: {
  locale: string;
  afterContent?: React.ReactNode;
}) {
  const stories = await getCustomerStories(locale as "en" | "fr").catch(() => []);

  const storySlugMap: Record<string, { slug: string; slug_fr: string | null }> = {};
  for (const s of stories || []) {
    storySlugMap[s.slug] = { slug: s.slug, slug_fr: s.slug_fr };
  }

  return (
    <SectionCustomerLogosClient serverStorySlugMap={storySlugMap} afterContent={afterContent} />
  );
}
