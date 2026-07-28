// Northstar UI strings — the media section lives outside next-intl on purpose,
// so its handful of chrome strings are managed here.

import type { MediaLocale } from "./data/taxonomy";

export interface MediaDict {
  tagline: string;
  latest: string;
  themes: string;
  industries: string;
  videos: string;
  authors: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  newsletterSoon: string;
  readTime: (min: number) => string;
  publishedOn: string;
  updatedOn: string;
  moreIn: (label: string) => string;
  allArticles: string;
  articlesIn: (label: string) => string;
  industryKicker: string;
  themeKicker: string;
  emptyTheme: string;
  backToNorthstar: string;
  backToDitto: string;
  switchLocale: string;
  switchLocaleLabel: string;
  home: string;
  notFoundTitle: string;
  notFoundBody: string;
  legal: string;
  privacy: string;
  aboutLine: string;
}

const dict: Record<MediaLocale, MediaDict> = {
  en: {
    tagline: "The QHSE, CSR & Supply Chain magazine by Ditto",
    latest: "Latest",
    themes: "Themes",
    industries: "Industries",
    videos: "Videos",
    authors: "Our authors",
    newsletterTitle: "The Northstar letter",
    newsletterBody:
      "One long-form read on QHSE, CSR or supply-chain regulation, once a month. No noise.",
    newsletterPlaceholder: "you@company.com",
    newsletterCta: "Subscribe",
    newsletterSoon: "Coming soon",
    readTime: (min: number) => `${min} min read`,
    publishedOn: "Published on",
    updatedOn: "Updated on",
    moreIn: (label: string) => `More in ${label}`,
    allArticles: "All articles",
    articlesIn: (label: string) => `Articles on ${label}`,
    industryKicker: "Industry",
    themeKicker: "Theme",
    emptyTheme: "No articles here yet — they're being written.",
    backToNorthstar: "Northstar",
    backToDitto: "trustditto.com",
    switchLocale: "FR",
    switchLocaleLabel: "Lire en français",
    home: "Home",
    notFoundTitle: "Page not found",
    notFoundBody: "This page doesn't exist. Head back to the magazine.",
    legal: "Legal notices",
    privacy: "Privacy policy",
    aboutLine: "Northstar is published by Ditto, the compliance platform.",
  },
  fr: {
    tagline: "Le média QHSE, RSE & Supply Chain par Ditto",
    latest: "À la une",
    themes: "Thématiques",
    industries: "Industries",
    videos: "Vidéos",
    authors: "Nos auteurs",
    newsletterTitle: "La lettre Northstar",
    newsletterBody:
      "Une lecture de fond sur la QHSE, la RSE ou la réglementation supply chain, une fois par mois. Sans bruit.",
    newsletterPlaceholder: "vous@entreprise.com",
    newsletterCta: "S'abonner",
    newsletterSoon: "Bientôt disponible",
    readTime: (min: number) => `${min} min de lecture`,
    publishedOn: "Publié le",
    updatedOn: "Mis à jour le",
    moreIn: (label: string) => `À lire aussi en ${label}`,
    allArticles: "Tous les articles",
    articlesIn: (label: string) => `Articles sur ${label}`,
    industryKicker: "Industrie",
    themeKicker: "Thématique",
    emptyTheme: "Pas encore d'articles ici — ils sont en cours d'écriture.",
    backToNorthstar: "Northstar",
    backToDitto: "trustditto.com",
    switchLocale: "EN",
    switchLocaleLabel: "Read in English",
    home: "Accueil",
    notFoundTitle: "Page introuvable",
    notFoundBody: "Cette page n'existe pas. Retournez au magazine.",
    legal: "Mentions légales",
    privacy: "Politique de confidentialité",
    aboutLine: "Northstar est édité par Ditto, la plateforme de conformité.",
  },
};

export function t(locale: MediaLocale): MediaDict {
  return dict[locale];
}

export function formatDate(iso: string, locale: MediaLocale): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
