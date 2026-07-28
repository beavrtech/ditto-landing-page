import type { MediaLocale } from "../data/taxonomy";

export const SITE_URL = "https://www.trustditto.com";

/**
 * Locale-aware media path: mediaPath("en", "/x") → "/en/media/x".
 * Both languages carry their prefix, like the rest of the site. Bare /media/*
 * redirects here (see next.config.ts).
 */
export function mediaPath(locale: MediaLocale, path: string = ""): string {
  const suffix = path === "/" ? "" : path;
  return `/${locale}/media${suffix}`;
}

export function mediaUrl(locale: MediaLocale, path: string = ""): string {
  return `${SITE_URL}${mediaPath(locale, path)}`;
}

/** canonical + hreflang alternates for a media page available in both locales. */
export function mediaAlternates(locale: MediaLocale, path: string = "") {
  const en = mediaUrl("en", path);
  const fr = mediaUrl("fr", path);
  return {
    canonical: locale === "fr" ? fr : en,
    languages: { "x-default": en, en, fr },
  };
}
