import type { Article } from "./articles";
import { mediaUrl, SITE_URL } from "./urls";
import type { MediaAuthor } from "./authors";
import {
  findTaxonomyPath,
  findIndustry,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

// Locale-neutral identifiers: they name the publication, they are never
// fetched. The url properties below point at the default-locale home, which
// resolves without going through the /media redirect.
const SCOPE_ID = `${SITE_URL}/media#organization`;
const SCOPE_SITE_ID = `${SITE_URL}/media#website`;
const SCOPE_HOME = `${SITE_URL}/en/media`;

/** The Scope is a media published by Ditto — never an independent entity. */
export const SCOPE_PUBLISHER_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": SCOPE_ID,
      name: "The Scope",
      url: SCOPE_HOME,
      description:
        "The Scope is the QHSE, CSR and supply chain magazine published by Ditto.",
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://www.trustditto.com/#organization",
        name: "Ditto",
        url: SITE_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": SCOPE_SITE_ID,
      name: "The Scope",
      url: SCOPE_HOME,
      inLanguage: ["en", "fr"],
      publisher: { "@id": SCOPE_ID },
    },
  ],
};

export function authorPersonJsonLd(author: MediaAuthor, locale: MediaLocale) {
  return {
    "@type": "Person",
    "@id": `${mediaUrl(locale, `/authors/${author.slug}`)}#person`,
    name: author.name,
    jobTitle: author.title[locale],
    url: mediaUrl(locale, `/authors/${author.slug}`),
    ...(author.linkedin || author.website
      ? { sameAs: [author.linkedin, author.website].filter(Boolean) }
      : {}),
  };
}

/** Avatars may be local paths or absolute URLs on an allowed remote host. */
export function absoluteAssetUrl(src: string): string {
  return src.startsWith("http") ? src : `${SITE_URL}${src}`;
}

export function authorProfileJsonLd(author: MediaAuthor, locale: MediaLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: mediaUrl(locale, `/authors/${author.slug}`),
    mainEntity: {
      ...authorPersonJsonLd(author, locale),
      description: author.bio[locale],
      image: absoluteAssetUrl(author.avatar),
    },
  };
}

function pathLabels(path: string[], locale: MediaLocale): string[] {
  return (findTaxonomyPath(path) ?? []).map((node) => taxonomyLabel(node, locale));
}

function articleTopics(article: Article, locale: MediaLocale) {
  // An article with no industries is not about any particular one, so it
  // contributes no industry topics rather than all eight.
  const industries = article.industries
    .map((slug) => findIndustry(slug))
    .filter(Boolean)
    .map((industry) => taxonomyLabel(industry!, locale));

  // Only the canonical section becomes `about`: claiming an article is about
  // every branch it is cross-filed into weakens the signal. Secondary
  // placements still surface as keywords.
  const primary = [...pathLabels(article.section, locale), ...industries];
  const secondary = article.alsoIn.flatMap((path) => pathLabels(path, locale));
  return { primary, all: [...new Set([...primary, ...secondary])] };
}

export function mediaArticleJsonLd(
  article: Article,
  author: MediaAuthor,
  locale: MediaLocale
) {
  const url = mediaUrl(locale, `/${article.slug}`);
  const topics = articleTopics(article, locale);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    headline: article.title,
    description: article.description,
    image: `${SITE_URL}${article.illustration}`,
    datePublished: article.date,
    dateModified: article.updated ?? article.date,
    inLanguage: locale,
    mainEntityOfPage: url,
    url,
    author: authorPersonJsonLd(author, locale),
    publisher: { "@id": SCOPE_ID },
    isPartOf: { "@id": SCOPE_SITE_ID },
    about: topics.primary.map((name) => ({ "@type": "Thing", name })),
    keywords: topics.all.join(", "),
    articleSection: pathLabels(article.section, locale),
    wordCount: article.wordCount,
    // ISO 8601 duration, from the same read time shown in the byline.
    timeRequired: `PT${article.readTimeMinutes}M`,
    isAccessibleForFree: true,
  };
}

/** A listing page: what it is, and the articles on it, in order. */
export function articleCollectionJsonLd({
  url,
  name,
  description,
  articles,
  locale,
}: {
  url: string;
  name: string;
  description?: string;
  articles: Article[];
  locale: MediaLocale;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url,
    name,
    ...(description ? { description } : {}),
    inLanguage: locale,
    isPartOf: { "@id": SCOPE_SITE_ID },
    mainEntity: articleItemList(articles, locale, name),
  };
}

/**
 * Standalone list of articles, for a page that is already something else —
 * an author page is a ProfilePage, so its article list is its own node.
 */
export function articleItemListJsonLd(articles: Article[], locale: MediaLocale, name: string) {
  return { "@context": "https://schema.org", ...articleItemList(articles, locale, name) };
}

function articleItemList(articles: Article[], locale: MediaLocale, name: string) {
  return {
    "@type": "ItemList" as const,
    name,
    numberOfItems: articles.length,
    itemListElement: articles.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: mediaUrl(locale, `/${article.slug}`),
      name: article.title,
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      // Google guidance: the last crumb carries no item URL.
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
