import { getBlogPosts, getCustomerStories, withCollectionTwins } from "../lib/cms";
import { FooterClient } from "./FooterI18n";
import { getLocale } from "next-intl/server";

export async function Footer({ alternateUrls }: { alternateUrls?: Record<string, string> } = {}) {
  const locale = (await getLocale()) as "en" | "fr";
  const [blogPosts, customerStories] = await Promise.all([
    getBlogPosts(locale, 4).then(withCollectionTwins).catch(() => []),
    getCustomerStories(locale).catch(() => []),
  ]);

  return <FooterClient blogPosts={blogPosts || []} customerStories={customerStories || []} alternateUrls={alternateUrls} />;
}
