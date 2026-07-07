import { getBlogPosts, getCustomerStories, withCollectionTwins } from "../lib/cms";
import { FooterClient } from "./FooterI18n";

export async function Footer({ alternateUrls }: { alternateUrls?: Record<string, string> } = {}) {
  const [blogPosts, customerStories] = await Promise.all([
    getBlogPosts("en", 4).then(withCollectionTwins).catch(() => []),
    getCustomerStories("en").catch(() => []),
  ]);

  return <FooterClient blogPosts={blogPosts || []} customerStories={customerStories || []} alternateUrls={alternateUrls} />;
}
