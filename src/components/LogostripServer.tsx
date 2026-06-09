import { getCompanyLogos, getCustomerStories } from "../lib/cms";
import { SectionLogostrip as SectionLogostripClient } from "./SectionLogostripI18n";

import type { SectionLogostripProps } from "./SectionLogostripI18n";

export async function SectionLogostrip(props: Omit<SectionLogostripProps, "serverLogos" | "serverStorySlugMap"> & { locale: string }) {
  const { locale, ...rest } = props;
  const [logos, stories] = await Promise.all([
    getCompanyLogos().catch(() => []),
    getCustomerStories(locale as "en" | "fr").catch(() => []),
  ]);

  const storySlugMap: Record<string, { slug: string; slug_fr: string | null }> = {};
  for (const s of stories || []) {
    storySlugMap[s.slug] = { slug: s.slug, slug_fr: s.slug_fr };
  }

  return (
    <SectionLogostripClient
      {...rest}
      serverLogos={logos || []}
      serverStorySlugMap={storySlugMap}
    />
  );
}
