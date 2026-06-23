import { getBlogPosts, withCollectionTwins } from "../lib/cms";
import { SectionResources as SectionResourcesClient } from "./SectionResourcesI18n";

import type { SectionResourcesProps } from "./SectionResourcesI18n";

export async function SectionResources(props: Omit<SectionResourcesProps, "serverPosts"> & { locale: string }) {
  const { locale, ...rest } = props;
  const posts = await getBlogPosts(locale as "en" | "fr", 3).then(withCollectionTwins).catch(() => []);

  return <SectionResourcesClient {...rest} serverPosts={posts || []} />;
}
