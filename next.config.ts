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
  // Legacy URL structure (pre-migration) → current localized routes.
  // These run before the i18n middleware.
  async redirects() {
    // Collection items that duplicate a blog post 308 to the blog version
    // (single canonical URL per article). Computed from the CMS at build /
    // server start.
    const duplicateRedirects: { source: string; destination: string; permanent: boolean }[] = [];
    try {
      const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (base && key) {
        const headers = { apikey: key, Authorization: `Bearer ${key}` };
        const [items, posts] = await Promise.all([
          fetch(`${base}/rest/v1/collection_items?select=slug,slug_fr&limit=1000`, { headers }).then((r) => r.json()),
          fetch(`${base}/rest/v1/blog_posts?select=slug,slug_fr&published=eq.true&limit=1000`, { headers }).then((r) => r.json()),
        ]);
        const blogBySlug = new Map((posts as { slug: string; slug_fr: string | null }[]).map((p) => [p.slug, p]));
        for (const item of items as { slug: string; slug_fr: string | null }[]) {
          const twin = blogBySlug.get(item.slug);
          if (!twin) continue;
          duplicateRedirects.push({
            source: `/en/collection/:framework/${item.slug}`,
            destination: `/en/resources/blog/${twin.slug}`,
            permanent: true,
          });
          duplicateRedirects.push({
            source: `/fr/collection/:framework/${item.slug_fr || item.slug}`,
            destination: `/fr/ressources/blog/${twin.slug_fr || twin.slug}`,
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
