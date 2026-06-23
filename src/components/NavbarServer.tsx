import { getBlogPosts, withCollectionTwins } from "../lib/cms";
import { NavbarClient } from "./NavbarI18n";
import { getLocale } from "next-intl/server";

export async function Navbar({ alternateUrls }: { alternateUrls?: Record<string, string> } = {}) {
  const locale = await getLocale();
  const previewPosts = await getBlogPosts(locale as "en" | "fr", 2).then(withCollectionTwins).catch(() => []);

  return <NavbarClient previewPosts={previewPosts || []} alternateUrls={alternateUrls} />;
}
