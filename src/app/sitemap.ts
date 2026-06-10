import type { MetadataRoute } from "next";
import {
  getCustomerStories,
  getBlogPosts,
  getNews,
  getGuides,
  getAuthors,
  getCollectionItems,
} from "../lib/cms";

const BASE_URL = "https://www.trustditto.com";

// Static pages with their French path equivalents
const STATIC_PAGES: { en: string; fr: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { en: "", fr: "", changeFrequency: "weekly", priority: 1 },
  { en: "/customer-stories", fr: "/cas-clients", changeFrequency: "weekly", priority: 0.8 },
  { en: "/resources", fr: "/ressources", changeFrequency: "weekly", priority: 0.8 },
  { en: "/resources/blog", fr: "/ressources/blog", changeFrequency: "weekly", priority: 0.7 },
  { en: "/resources/news", fr: "/ressources/news", changeFrequency: "weekly", priority: 0.7 },
  { en: "/resources/guides", fr: "/ressources/guides", changeFrequency: "weekly", priority: 0.7 },
  { en: "/frameworks", fr: "/frameworks", changeFrequency: "monthly", priority: 0.7 },
  { en: "/frameworks/ecovadis", fr: "/frameworks/ecovadis", changeFrequency: "monthly", priority: 0.8 },
  { en: "/frameworks/csrd", fr: "/frameworks/csrd", changeFrequency: "monthly", priority: 0.8 },
  { en: "/frameworks/cdp", fr: "/frameworks/cdp", changeFrequency: "monthly", priority: 0.8 },
  { en: "/frameworks/iso-14001", fr: "/frameworks/iso-14001", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/management-system", fr: "/solutions/management-system", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/compliance-questionnaires", fr: "/solutions/compliance-questionnaires", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/ai-solutions", fr: "/solutions/ai-solutions", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/supplier-engagement", fr: "/solutions/supplier-engagement", changeFrequency: "monthly", priority: 0.8 },
  { en: "/get-started", fr: "/contact", changeFrequency: "monthly", priority: 0.9 },
  { en: "/manifesto", fr: "/manifesto", changeFrequency: "yearly", priority: 0.4 },
  { en: "/careers", fr: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { en: "/collection/ecovadis", fr: "/collection/ecovadis", changeFrequency: "monthly", priority: 0.7 },
  { en: "/collection/cdp", fr: "/collection/cdp", changeFrequency: "monthly", priority: 0.7 },
  { en: "/legal/terms-and-conditions", fr: "/legal/conditions-generales-dutilisation", changeFrequency: "yearly", priority: 0.2 },
  { en: "/legal/privacy-policy", fr: "/legal/politique-de-confidentialite", changeFrequency: "yearly", priority: 0.2 },
  { en: "/legal/legal-notices", fr: "/legal/mentions-legales", changeFrequency: "yearly", priority: 0.2 },
];

const FRAMEWORKS = ["ecovadis", "cdp", "csrd", "iso-14001", "vsme"];

type EntryOptions = {
  lastModified?: Date;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

// Emits the EN and FR variants of a page, each carrying bidirectional
// hreflang alternates (plus x-default pointing at the EN version).
function localizedPair(
  enPath: string,
  frPath: string,
  opts: EntryOptions
): MetadataRoute.Sitemap {
  const en = `${BASE_URL}/en${enPath}`;
  const fr = `${BASE_URL}/fr${frPath}`;
  const alternates = {
    languages: { "x-default": en, en, fr },
  };
  return [
    { url: en, alternates, ...opts },
    { url: fr, alternates, ...opts },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, posts, news, guides, authors, ...collectionResults] =
    await Promise.all([
      getCustomerStories("en").catch(() => []),
      getBlogPosts("en").catch(() => []),
      getNews("en").catch(() => []),
      getGuides("en").catch(() => []),
      getAuthors().catch(() => []),
      ...FRAMEWORKS.map((fw) => getCollectionItems(fw, "en").catch(() => [])),
    ]);

  const urls: MetadataRoute.Sitemap = [];

  // Static pages (both locales)
  for (const page of STATIC_PAGES) {
    urls.push(
      ...localizedPair(page.en, page.fr, {
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      })
    );
  }

  // Customer stories
  for (const story of stories || []) {
    const opts: EntryOptions = {
      lastModified: story.publish_date ? new Date(story.publish_date) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    };
    if (story.slug_fr) {
      urls.push(
        ...localizedPair(
          `/customer-stories/${story.slug}`,
          `/cas-clients/${story.slug_fr}`,
          opts
        )
      );
    } else {
      urls.push({ url: `${BASE_URL}/en/customer-stories/${story.slug}`, ...opts });
    }
  }

  // Blog posts
  for (const post of posts || []) {
    const opts: EntryOptions = {
      lastModified: post.date_de_publication ? new Date(post.date_de_publication) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    };
    if (post.slug_fr) {
      urls.push(
        ...localizedPair(
          `/resources/blog/${post.slug}`,
          `/ressources/blog/${post.slug_fr}`,
          opts
        )
      );
    } else {
      urls.push({ url: `${BASE_URL}/en/resources/blog/${post.slug}`, ...opts });
    }
  }

  // News
  for (const item of news || []) {
    const opts: EntryOptions = {
      lastModified: item.published_date ? new Date(item.published_date) : undefined,
      changeFrequency: "monthly",
      priority: 0.6,
    };
    if (item.slug_fr) {
      urls.push(
        ...localizedPair(
          `/resources/news/${item.slug}`,
          `/ressources/news/${item.slug_fr}`,
          opts
        )
      );
    } else {
      urls.push({ url: `${BASE_URL}/en/resources/news/${item.slug}`, ...opts });
    }
  }

  // Guides
  for (const guide of guides || []) {
    const opts: EntryOptions = {
      lastModified: guide.date ? new Date(guide.date) : undefined,
      changeFrequency: "monthly",
      priority: 0.7,
    };
    if (guide.slug_fr) {
      urls.push(
        ...localizedPair(
          `/resources/guides/${guide.slug}`,
          `/ressources/guides/${guide.slug_fr}`,
          opts
        )
      );
    } else {
      urls.push({ url: `${BASE_URL}/en/resources/guides/${guide.slug}`, ...opts });
    }
  }

  // Authors (exclude former employees)
  const EXCLUDED_AUTHORS = ["charles-lorin", "lisa-venturi"];
  for (const author of authors || []) {
    if (EXCLUDED_AUTHORS.includes(author.slug)) continue;
    urls.push(
      ...localizedPair(`/authors/${author.slug}`, `/auteurs/${author.slug}`, {
        changeFrequency: "monthly",
        priority: 0.4,
      })
    );
  }

  // Collection items (per framework) — exclude linked guides (they're already in /resources/guides/)
  for (let i = 0; i < FRAMEWORKS.length; i++) {
    const fw = FRAMEWORKS[i];
    const allItems = collectionResults[i] || [];
    const items = allItems.filter((item: any) => item._type !== "guide");
    for (const item of items) {
      const opts: EntryOptions = {
        changeFrequency: "monthly",
        priority: 0.5,
      };
      if (item.slug_fr) {
        urls.push(
          ...localizedPair(
            `/collection/${fw}/${item.slug}`,
            `/collection/${fw}/${item.slug_fr}`,
            opts
          )
        );
      } else {
        urls.push({ url: `${BASE_URL}/en/collection/${fw}/${item.slug}`, ...opts });
      }
    }
  }

  return urls;
}
