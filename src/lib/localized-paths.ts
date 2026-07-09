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
 * Public URL for a collection framework landing page or item.
 *
 * Every framework — carbon included — lives under
 * /[locale]/collection/[framework]. Centralized here so breadcrumbs, article
 * links and canonical metadata all emit the same canonical URL.
 */
export function collectionPath(
  framework: string,
  locale: string,
  slug?: string
): string {
  // Every framework's collection lives at /{locale}/collection/{framework}
  // (carbon included — there is no standalone /carbon page).
  const base = `/${locale}/collection/${framework}`;
  return slug ? `${base}/${slug}` : base;
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
 * Canonical URL for a blog post. Posts that duplicate a collection item link
 * to the collection version (the canonical URL for those articles); all others
 * link to the blog version. Pass the collection twin (from getCollectionSlugMap)
 * if one exists for this post's slug.
 */
export function articleHref(
  post: { slug: string; slug_fr: string | null | undefined },
  collectionTwin: { slug: string; slug_fr: string | null; framework: string } | undefined,
  locale: string
): string {
  if (collectionTwin) {
    const slug = locale === "fr" && collectionTwin.slug_fr ? collectionTwin.slug_fr : collectionTwin.slug;
    return collectionPath(collectionTwin.framework, locale, slug);
  }
  return localizedCmsHref("/resources/blog", post.slug, post.slug_fr, locale);
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

  // Author slugs are identical in both locales — switch directly.
  // (There is no /authors index page, so never fall back to it.)
  if (canonicalPath.startsWith("/authors/") || canonicalPath.startsWith("/auteurs/")) {
    const slug = canonicalPath.split("/")[2];
    return targetLocale === "fr" ? `/fr/auteurs/${slug}` : `/en/authors/${slug}`;
  }

  // Collection framework listings are identical in both locales and switch
  // directly. Item slugs are locale-specific, so fall back to the framework
  // listing — there is no /collection index page.
  if (canonicalPath.startsWith("/collection/")) {
    const framework = canonicalPath.split("/")[2];
    return `/${targetLocale}/collection/${framework}`;
  }

  // CMS detail pages have locale-specific slugs that can't be mapped
  // without a DB lookup. For these, redirect to the parent listing page.
  const CMS_PARENT_PATHS = [
    "/resources/blog",
    "/resources/guides",
    "/resources/news",
    "/resources/events",
    "/customer-stories",
  ];

  for (const parent of CMS_PARENT_PATHS) {
    // Match /resources/blog/some-slug but NOT /resources/blog itself
    if (canonicalPath.startsWith(parent + "/")) {
      return localizedHref(parent, targetLocale);
    }
  }

  return localizedHref(canonicalPath, targetLocale);
}
