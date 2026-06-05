/**
 * Maps English paths to localized paths for link building.
 * The middleware handles incoming URL rewriting (fr/cas-clients → customer-stories internally),
 * but outgoing links need to use the correct localized paths.
 */

const FRENCH_PATHS: Record<string, string> = {
  "/customer-stories": "/cas-clients",
  "/resources": "/ressources",
  "/resources/blog": "/ressources/blog",
  "/resources/guides": "/ressources/guides",
  "/resources/news": "/ressources/news",
  "/resources/events": "/ressources/events",
  "/get-started": "/contact",
  "/legal/terms-and-conditions": "/legal/conditions-generales-dutilisation",
  "/legal/privacy-policy": "/legal/politique-de-confidentialite",
  "/legal/legal-notices": "/legal/mentions-legales",
};

/**
 * Convert an internal path to the correct localized URL.
 *
 * Example:
 *   localizedHref("/customer-stories/some-slug", "fr")
 *   → "/fr/cas-clients/some-slug"
 *
 *   localizedHref("/customer-stories/some-slug", "en")
 *   → "/en/customer-stories/some-slug"
 */
export function localizedHref(path: string, locale: string): string {
  const prefix = `/${locale}`;

  if (locale !== "fr") {
    return `${prefix}${path}`;
  }

  // Check exact match first
  if (FRENCH_PATHS[path]) {
    return `${prefix}${FRENCH_PATHS[path]}`;
  }

  // Check prefix match (e.g. /customer-stories/some-slug → /cas-clients/some-slug)
  for (const [enPath, frPath] of Object.entries(FRENCH_PATHS)) {
    if (path.startsWith(enPath + "/")) {
      return `${prefix}${frPath}${path.slice(enPath.length)}`;
    }
  }

  // No mapping — use path as-is
  return `${prefix}${path}`;
}

/**
 * For CMS content with separate EN/FR slugs.
 * Returns the full localized URL using the correct slug for the locale.
 *
 * Example:
 *   localizedCmsHref("/customer-stories", "en-slug", "fr-slug", "fr")
 *   → "/fr/cas-clients/fr-slug"
 */
export function localizedCmsHref(
  basePath: string,
  slugEn: string,
  slugFr: string | null | undefined,
  locale: string
): string {
  const slug = locale === "fr" && slugFr ? slugFr : slugEn;
  return localizedHref(`${basePath}/${slug}`, locale);
}
