import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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
  // Carbon collection is served at the clean /[locale]/carbon path but reuses
  // the generic /collection/[framework] route internally. The URL bar keeps
  // /carbon; canonical links are emitted as /carbon via collectionPath().
  async rewrites() {
    return [
      {
        source: "/:locale(en|fr)/carbon",
        destination: "/:locale/collection/carbon",
      },
      {
        source: "/:locale(en|fr)/carbon/:slug",
        destination: "/:locale/collection/carbon/:slug",
      },
    ];
  },
  // Legacy URL structure (pre-migration) → current localized routes.
  // These run before the i18n middleware.
  async redirects() {
    // Blog posts that duplicate a collection item 308 to the collection
    // version (single canonical URL per article). Computed from the CMS at
    // build / server start.
    const duplicateRedirects: { source: string; destination: string; permanent: boolean }[] = [];
    try {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (base && key) {
        const headers = { apikey: key, Authorization: `Bearer ${key}` };
        const [items, posts] = await Promise.all([
          fetch(`${base}/rest/v1/collection_items?select=slug,slug_fr,framework:frameworks(slug)&published=eq.true&archived=eq.false&limit=1000`, { headers }).then((r) => r.json()),
          fetch(`${base}/rest/v1/blog_posts?select=slug,slug_fr&published=eq.true&limit=1000`, { headers }).then((r) => r.json()),
        ]);
        const collectionBySlug = new Map(
          (items as { slug: string; slug_fr: string | null; framework: { slug: string } | null }[])
            .filter((i) => i.framework?.slug)
            .map((i) => [i.slug, i])
        );
        // Carbon lives at the clean top-level /[locale]/carbon path; every
        // other framework under /[locale]/collection/[framework].
        const collectionUrl = (locale: string, framework: string, slug: string) =>
          framework === "carbon"
            ? `/${locale}/carbon/${slug}`
            : `/${locale}/collection/${framework}/${slug}`;
        for (const post of posts as { slug: string; slug_fr: string | null }[]) {
          const twin = collectionBySlug.get(post.slug);
          if (!twin) continue;
          const framework = twin.framework!.slug;
          duplicateRedirects.push({
            source: `/en/resources/blog/${post.slug}`,
            destination: collectionUrl("en", framework, twin.slug),
            permanent: true,
          });
          duplicateRedirects.push({
            source: `/fr/ressources/blog/${post.slug_fr || post.slug}`,
            destination: collectionUrl("fr", framework, twin.slug_fr || twin.slug),
            permanent: true,
          });
        }
      }
    } catch {
      // CMS unreachable at config time — page-level redirects still cover this
    }
    return [
      ...duplicateRedirects,
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
