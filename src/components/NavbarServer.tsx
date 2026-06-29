import { getBlogPosts, getCustomerStories, withCollectionTwins } from "../lib/cms";
import { NavbarClient } from "./NavbarI18n";
import { getLocale } from "next-intl/server";

export async function Navbar({ alternateUrls }: { alternateUrls?: Record<string, string> } = {}) {
  const locale = await getLocale();
  const [previewPosts, customerStories] = await Promise.all([
    getBlogPosts(locale as "en" | "fr", 2).then(withCollectionTwins).catch(() => []),
    getCustomerStories(locale as "en" | "fr").then((s) => (s || []).slice(0, 5)).catch(() => []),
  ]);

  return (
    <NavbarClient
      previewPosts={previewPosts || []}
      customerStories={customerStories || []}
      alternateUrls={alternateUrls}
    />
  );
}
