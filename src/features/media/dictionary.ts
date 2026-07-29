// Northstar UI strings — the media section lives outside next-intl on purpose,
// so its handful of chrome strings are managed here.

import type { MediaLocale } from "./data/taxonomy";

export interface MediaDict {
  tagline: string;
  latest: string;
  themes: string;
  industries: string;
  videos: string;
  allVideos: string;
  videosTitle: string;
  videosDek: string;
  emptyVideos: string;
  authors: string;
  previousAuthors: string;
  nextAuthors: string;
  newsletterTitle: string;
  newsletterBody: string;
  newsletterPlaceholder: string;
  newsletterCta: string;
  newsletterSoon: string;
  newsletterThemes: string;
  newsletterIndustry: string;
  allIndustries: string;
  clearFilter: string;
  emptyFiltered: string;
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
  profileOnDitto: string;
  onThisPage: string;
  writtenBy: string;
  allArticlesBy: string;
  railNewsletterBody: string;
  share: string;
  linkCopied: string;
  summarizeWithAi: string;
}

const dict: Record<MediaLocale, MediaDict> = {
  en: {
    tagline: "The QHSE, CSR & Supply Chain magazine by Ditto",
    latest: "Latest",
    themes: "Themes",
    industries: "Industries",
    videos: "Videos",
    allVideos: "All videos",
    videosTitle: "One minute on one idea",
    videosDek:
      "RSEstretto: Pierre Poirmeur takes a single QHSE, CSR or supply chain term and explains it in about a minute.",
    emptyVideos: "No videos here yet.",
    authors: "Our authors",
    previousAuthors: "Previous authors",
    nextAuthors: "Next authors",
    newsletterTitle: "The Northstar letter",
    newsletterBody:
      "One long-form read on QHSE, CSR or supply-chain regulation, once a month. No noise.",
    newsletterPlaceholder: "you@company.com",
    newsletterCta: "Subscribe",
    newsletterSoon: "Coming soon",
    newsletterThemes: "What do you want to read about?",
    newsletterIndustry: "Your industry",
    allIndustries: "All industries",
    clearFilter: "Clear",
    emptyFiltered: "Nothing here for that industry yet.",
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
    profileOnDitto: "Profile on trustditto.com",
    onThisPage: "On this page",
    writtenBy: "Written by",
    allArticlesBy: "All their articles",
    railNewsletterBody: "One long-form read a month. No noise.",
    share: "Copy link",
    linkCopied: "Link copied",
    summarizeWithAi: "Summarize with AI",
  },
  fr: {
    tagline: "Le média QHSE, RSE & Supply Chain par Ditto",
    latest: "À la une",
    themes: "Thématiques",
    industries: "Industries",
    videos: "Vidéos",
    allVideos: "Toutes les vidéos",
    videosTitle: "Une minute, une notion",
    videosDek:
      "RSEstretto : Pierre Poirmeur prend un terme QHSE, RSE ou supply chain et l'explique en une minute environ.",
    emptyVideos: "Pas encore de vidéos ici.",
    authors: "Nos auteurs",
    previousAuthors: "Auteurs précédents",
    nextAuthors: "Auteurs suivants",
    newsletterTitle: "La lettre Northstar",
    newsletterBody:
      "Une lecture de fond sur la QHSE, la RSE ou la réglementation supply chain, une fois par mois. Sans bruit.",
    newsletterPlaceholder: "vous@entreprise.com",
    newsletterCta: "S'abonner",
    newsletterSoon: "Bientôt disponible",
    newsletterThemes: "Que souhaitez-vous lire ?",
    newsletterIndustry: "Votre industrie",
    allIndustries: "Toutes les industries",
    clearFilter: "Retirer",
    emptyFiltered: "Rien ici pour cette industrie pour le moment.",
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
    profileOnDitto: "Profil sur trustditto.com",
    onThisPage: "Sur cette page",
    writtenBy: "Écrit par",
    allArticlesBy: "Tous ses articles",
    railNewsletterBody: "Une lecture de fond par mois. Sans bruit.",
    share: "Copier le lien",
    linkCopied: "Lien copié",
    summarizeWithAi: "Résumer avec l'IA",
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
