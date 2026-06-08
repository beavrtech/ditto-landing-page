/**
 * Maps English paths to localized paths for link building.
 * The middleware handles incoming URL rewriting (fr/cas-clients → customer-stories internally),
 * but outgoing links need to use the correct localized paths.
 */

/**
 * Reverse map: French path segments → English path segments.
 * Built automatically from FRENCH_PATHS below.
 */
let ENGLISH_PATHS: Record<string, string> | null = null;

function getEnglishPaths(): Record<string, string> {
  if (!ENGLISH_PATHS) {
    ENGLISH_PATHS = {};
    for (const [en, fr] of Object.entries(FRENCH_PATHS)) {
      ENGLISH_PATHS[fr] = en;
    }
  }
  return ENGLISH_PATHS;
}

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

/**
 * Given the current full pathname (e.g. "/fr/cas-clients/some-slug"),
 * return the equivalent path in the target locale.
 *
 * Steps:
 * 1. Strip the current locale prefix (/en or /fr)
 * 2. If switching FROM French, convert French path segments back to English
 * 3. Apply localizedHref to get the correct target-locale path
 *
 * Note: CMS slugs (e.g. blog post slugs) that differ between locales
 * cannot be mapped here — those require a DB lookup. This handles
 * the static route segments only, which covers most navigation.
 */
export function switchLocalePath(
  currentPathname: string,
  targetLocale: string
): string {
  // Strip locale prefix: "/fr/cas-clients/foo" → "/cas-clients/foo"
  const withoutLocale = currentPathname.replace(/^\/(en|fr)/, "") || "/";

  // If the current path uses French segments, convert to English first
  // so we have a canonical English path to feed into localizedHref
  let canonicalPath = withoutLocale;
  const englishPaths = getEnglishPaths();

  // Try exact match first
  if (englishPaths[canonicalPath]) {
    canonicalPath = englishPaths[canonicalPath];
  } else {
    // Try prefix match (e.g. /cas-clients/some-slug → /customer-stories/some-slug)
    for (const [frPath, enPath] of Object.entries(englishPaths)) {
      if (canonicalPath.startsWith(frPath + "/")) {
        canonicalPath = enPath + canonicalPath.slice(frPath.length);
        break;
      }
    }
  }

  // CMS detail pages have locale-specific slugs that can't be mapped
  // without a DB lookup. For these, redirect to the parent listing page.
  const CMS_PARENT_PATHS = [
    "/resources/blog",
    "/resources/guides",
    "/resources/news",
    "/resources/events",
    "/customer-stories",
    "/collection",
    "/authors",
  ];

  for (const parent of CMS_PARENT_PATHS) {
    // Match /resources/blog/some-slug but NOT /resources/blog itself
    if (canonicalPath.startsWith(parent + "/")) {
      const rest = canonicalPath.slice(parent.length + 1);
      // If rest contains another slash, it's a nested path (e.g. /collection/ecovadis/some-slug)
      // For /collection/framework/slug, go to /collection/framework
      const slashIdx = rest.indexOf("/");
      if (parent === "/collection" && slashIdx !== -1) {
        // /collection/ecovadis/some-slug → /collection/ecovadis
        return localizedHref(parent + "/" + rest.slice(0, slashIdx), targetLocale);
      }
      return localizedHref(parent, targetLocale);
    }
  }

  return localizedHref(canonicalPath, targetLocale);
}
