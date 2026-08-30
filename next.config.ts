import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { duplicateArticleRedirects } from "./src/config/duplicate-article-redirects";

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xrbgrzbifkchbjimewvu.supabase.co",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  // Legacy URL structure (pre-migration) → current localized routes.
  // These run before the i18n middleware.
  async redirects() {
    return [
      ...duplicateArticleRedirects,
      // The Scope lives at /en/media and /fr/media, like every other localized
      // route. The unprefixed form points at the default locale. Temporary for
      // now, so nothing caches a 308 for a section that has not launched.
      {
        source: "/media",
        destination: "/en/media",
        permanent: false,
      },
      // Anything with a file extension is a static asset served from
      // public/media (illustrations, author photos, the logo), not a page —
      // redirecting those into /en/media would 404 them.
      {
        source: "/media/:path((?!.*\\.[a-zA-Z0-9]+$).*)",
        destination: "/en/media/:path",
        permanent: false,
      },
      {
        source: "/blog/:slug",
        destination: "/en/resources/blog/:slug",
        permanent: true,
      },
      {
        source: "/:framework(ecovadis|cdp|csrd|iso-14001|vsme)/:slug",
        destination: "/en/collection/:framework/:slug",
        permanent: true,
      },
      {
        source: "/en/resources/blog/csrsd-impact-materiality",
        destination: "/en/resources/blog/csrd-impact-materiality",
        permanent: true,
      },
      {
        source: "/fr/collection/vsme/csrsd-impact-materiality",
        destination: "/fr/collection/csrd/csrd-materialite-impact",
        permanent: true,
      },
      {
        source: "/en/collection/vsme/csrsd-impact-materiality",
        destination: "/en/collection/csrd/csrd-impact-materiality",
        permanent: true,
      },
      // FR twins of the EcoVadis/CSRD blog↔collection duplicates above.
      // These 12 slugs are covered by `duplicateRedirects` too once a fresh
      // build/deploy picks up their current CMS state, but that CMS data
      // (collection_items rows) only went live Aug 19-25 — recent enough
      // that GSC still shows both /fr/ressources/blog/... and
      // /fr/collection/... indexed in parallel. Hardcoded here so the
      // redirect is guaranteed regardless of build timing, same as the
      // vsme/csrd special cases above.
      {
        source: "/fr/ressources/blog/ecovadis-cest-quoi",
        destination: "/fr/collection/ecovadis/ecovadis-cest-quoi",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/ecovadis-2024",
        destination: "/fr/collection/ecovadis/ecovadis-2024",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/ecovadis-2025",
        destination: "/fr/collection/ecovadis/ecovadis-2025",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/ecovadis-csrd",
        destination: "/fr/collection/ecovadis/ecovadis-csrd",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/score-ecovadis",
        destination: "/fr/collection/ecovadis/score-ecovadis",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/consultants-ecovadis",
        destination: "/fr/collection/ecovadis/consultants-ecovadis",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/medailles-ecovadis",
        destination: "/fr/collection/ecovadis/medailles-ecovadis",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/medaille-ecovadis-platinum",
        destination: "/fr/collection/ecovadis/medaille-ecovadis-platinum",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/medaille-ecovadis-gold",
        destination: "/fr/collection/ecovadis/medaille-ecovadis-gold",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/medaille-ecovadis-silver",
        destination: "/fr/collection/ecovadis/medaille-ecovadis-silver",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/medaille-ecovadis-bronze",
        destination: "/fr/collection/ecovadis/medaille-ecovadis-bronze",
        permanent: true,
      },
      {
        source: "/fr/ressources/blog/directive-europeenne-csrd",
        destination: "/fr/collection/csrd/directive-europeenne-csrd",
        permanent: true,
      },
      {
        source: "/en/get-started",
        destination: "/en/demo",
        permanent: true,
      },
      {
        source: "/fr/get-started",
        destination: "/fr/demo",
        permanent: true,
      },
      {
        source: "/en/contact",
        destination: "/en/demo",
        permanent: true,
      },
      {
        source: "/fr/contact",
        destination: "/fr/demo",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
