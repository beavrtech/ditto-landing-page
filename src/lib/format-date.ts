/**
 * Formats a CMS publish date for display, localized per-locale
 * (e.g. "June 12, 2026" for en, "12 juin 2026" for fr).
 */
export function formatPublishedDate(date: string, locale: string): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

/**
 * ISO 8601 string for a CMS publish date, suitable for the OpenGraph
 * article:published_time meta tag. Returns undefined for missing/invalid dates.
 */
export function toPublishedTimeIso(date: string | null | undefined): string | undefined {
  if (!date) return undefined;
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
}
