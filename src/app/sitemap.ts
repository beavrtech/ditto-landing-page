import type { MetadataRoute } from "next";
import {
  getCustomerStories,
  getBlogPosts,
  getNews,
  getGuides,
  getAuthors,
  getCollectionItems,
} from "../lib/cms";
import { getAllArticles, articleSections } from "@/features/media/lib/articles";
import { INDUSTRIES } from "@/features/media/data/taxonomy";

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
  { en: "/frameworks/vsme", fr: "/frameworks/vsme", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/management-system", fr: "/solutions/management-system", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/compliance-questionnaires", fr: "/solutions/compliance-questionnaires", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/ai-solutions", fr: "/solutions/ai-solutions", changeFrequency: "monthly", priority: 0.8 },
  { en: "/solutions/supplier-engagement", fr: "/solutions/supplier-engagement", changeFrequency: "monthly", priority: 0.8 },
  { en: "/demo", fr: "/demo", changeFrequency: "monthly", priority: 0.9 },
  { en: "/manifesto", fr: "/manifesto", changeFrequency: "yearly", priority: 0.4 },
  { en: "/careers", fr: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { en: "/press", fr: "/press", changeFrequency: "weekly", priority: 0.5 },
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

/**
 * The Scope (/en/media, /fr/media). Every article is written in both
 * languages under one slug, so each page is a localized pair.
 *
 * Only listing pages that actually carry an article are emitted. Every theme,
 * tag and industry has a page from the day its slug exists — that is what
 * keeps internal links honest — but submitting the empty ones would be
 * submitting thin content.
 */
async function scopeUrls(): Promise<MetadataRoute.Sitemap> {
  const articles = await getAllArticles("en");
  if (!articles.length) return [];

  const urls: MetadataRoute.Sitemap = [];

  const push = (path: string, opts: EntryOptions) =>
    urls.push(...localizedPair(`/media${path}`, `/media${path}`, opts));

  push("", { changeFrequency: "daily", priority: 0.8 });
  push("/articles", { changeFrequency: "daily", priority: 0.7 });
  push("/videos", { changeFrequency: "weekly", priority: 0.5 });
  push("/about", { changeFrequency: "yearly", priority: 0.3 });

  // A placement reaches its own page and its parents, so a pillar page is
  // populated by everything filed under any of its themes.
  const themes = new Set<string>();
  const tags = new Set<string>();
  const authors = new Set<string>();
  let anyAllIndustries = false;
  const industries = new Set<string>();

  for (const article of articles) {
    for (const section of articleSections(article)) {
      for (let depth = 1; depth <= section.length; depth++) {
        themes.add(section.slice(0, depth).join("/"));
      }
    }
    for (const tag of article.tags) tags.add(tag);
    authors.add(article.author);
    if (article.industries.length) {
      for (const industry of article.industries) industries.add(industry);
    } else {
      // An article with no industries applies to all of them, so it fills
      // every industry page on its own.
      anyAllIndustries = true;
    }
  }

  for (const path of themes) push(`/theme/${path}`, { changeFrequency: "weekly", priority: 0.6 });
  for (const tag of tags) push(`/tag/${tag}`, { changeFrequency: "weekly", priority: 0.5 });
  for (const slug of anyAllIndustries ? INDUSTRIES.map((i) => i.slug) : industries) {
    push(`/industry/${slug}`, { changeFrequency: "weekly", priority: 0.5 });
  }
  for (const slug of authors) push(`/authors/${slug}`, { changeFrequency: "monthly", priority: 0.4 });

  for (const article of articles) {
    push(`/${article.slug}`, {
      lastModified: new Date(article.updated ?? article.date),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return urls;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stories, posts, news, guides, authors, scope, ...collectionResults] =
    await Promise.all([
      getCustomerStories("en").catch(() => []),
      getBlogPosts("en").catch(() => []),
      getNews("en").catch(() => []),
      getGuides("en").catch(() => []),
      getAuthors().catch(() => []),
      // A broken article must not cost the site its whole sitemap.
      scopeUrls().catch(() => []),
      ...FRAMEWORKS.map((fw) => getCollectionItems(fw, "en").catch(() => [])),
    ]);

  const urls: MetadataRoute.Sitemap = [...scope];

  // Slugs of native collection items — the canonical version of any article
  // that exists as both a collection item and a blog post. Used to keep the
  // duplicate out of the blog section and the canonical in the collection one.
  const collectionSlugs = new Set(
    collectionResults
      .flat()
      .filter((item: any) => item._type !== "guide")
      .map((item: any) => item.slug)
  );

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

  // Blog posts (exclude those duplicating a collection item — those URLs
  // canonicalize/redirect to the collection version)
  for (const post of posts || []) {
    if (collectionSlugs.has(post.slug)) continue;
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

  // Blog category hubs (one per category that actually carries posts)
  const categorySlugs = new Set<string>();
  for (const post of posts || []) {
    if ((post as any).category?.slug) categorySlugs.add((post as any).category.slug);
  }
  for (const slug of categorySlugs) {
    urls.push(
      ...localizedPair(
        `/resources/blog/category/${slug}`,
        `/ressources/blog/categorie/${slug}`,
        { changeFrequency: "weekly", priority: 0.6 }
      )
    );
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

  // Collection items (per framework) — exclude linked guides (already in
  // /resources/guides/). Items duplicating a blog post stay in (collection is
  // the canonical version).
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
