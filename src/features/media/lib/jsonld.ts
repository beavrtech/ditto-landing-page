import type { Article } from "./articles";
import { mediaUrl, SITE_URL } from "./urls";
import type { MediaAuthor } from "../data/authors";
import {
  findTaxonomyPath,
  findIndustry,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

const NORTHSTAR_ID = `${SITE_URL}/media#organization`;
const NORTHSTAR_SITE_ID = `${SITE_URL}/media#website`;

/** Northstar is a media published by Ditto — never an independent entity. */
export const NORTHSTAR_PUBLISHER_JSONLD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": NORTHSTAR_ID,
      name: "Northstar",
      url: `${SITE_URL}/media`,
      description:
        "Northstar is the QHSE, CSR and supply chain magazine published by Ditto.",
      parentOrganization: {
        "@type": "Organization",
        "@id": "https://www.trustditto.com/#organization",
        name: "Ditto",
        url: SITE_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": NORTHSTAR_SITE_ID,
      name: "Northstar",
      url: `${SITE_URL}/media`,
      inLanguage: ["en", "fr"],
      publisher: { "@id": NORTHSTAR_ID },
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
    ...(author.linkedin ? { sameAs: [author.linkedin] } : {}),
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

function articleTopics(article: Article, locale: MediaLocale): string[] {
  const chain = findTaxonomyPath(article.section) ?? [];
  const themes = chain.map((node) => taxonomyLabel(node, locale));
  // An article with no industries is not about any particular one, so it
  // contributes no industry topics rather than all eight.
  const industries = article.industries
    .map((slug) => findIndustry(slug))
    .filter(Boolean)
    .map((industry) => taxonomyLabel(industry!, locale));
  return [...themes, ...industries];
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
    publisher: { "@id": NORTHSTAR_ID },
    isPartOf: { "@id": NORTHSTAR_SITE_ID },
    about: topics.map((name) => ({ "@type": "Thing", name })),
    keywords: topics.join(", "),
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
