import { getBlogPosts } from "../lib/cms";
import { SectionResources as SectionResourcesClient } from "./SectionResourcesI18n";
import { getLocale } from "next-intl/server";

import type { SectionResourcesProps } from "./SectionResourcesI18n";

export async function SectionResources(props: Omit<SectionResourcesProps, "serverPosts">) {
  const locale = await getLocale();
  const posts = await getBlogPosts(locale as "en" | "fr", 3).catch(() => []);

  return <SectionResourcesClient {...props} serverPosts={posts || []} />;
}
