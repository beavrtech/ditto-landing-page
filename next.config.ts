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
