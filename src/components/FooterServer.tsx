import { getBlogPosts, getNews } from "../lib/cms";
import { FooterClient } from "./FooterI18n";

export async function Footer({ alternateUrls }: { alternateUrls?: Record<string, string> } = {}) {
  const [blogPosts, newsItems] = await Promise.all([
    getBlogPosts("en", 4).catch(() => []),
    getNews("en", 4).catch(() => []),
  ]);

  return <FooterClient blogPosts={blogPosts || []} newsItems={newsItems || []} alternateUrls={alternateUrls} />;
}
