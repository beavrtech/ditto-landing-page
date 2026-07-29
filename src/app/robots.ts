import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /media + /fr/media (Northstar) are hidden from search until launch —
      // remove these two entries (and the noindex in the media layouts) to go live.
      disallow: ["/api/", "/admin/", "/media", "/en/media", "/fr/media", "/*?*", "/404", "/500"],
    },
    sitemap: "https://www.trustditto.com/sitemap.xml",
  };
}
