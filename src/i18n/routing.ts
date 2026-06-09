import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/frameworks": "/frameworks",
    "/frameworks/ecovadis": "/frameworks/ecovadis",
    "/frameworks/cdp": "/frameworks/cdp",
    "/frameworks/csrd": "/frameworks/csrd",
    "/frameworks/iso-14001": "/frameworks/iso-14001",
    "/solutions/management-system": "/solutions/management-system",
    "/solutions/compliance-questionnaires": "/solutions/compliance-questionnaires",
    "/solutions/ai-solutions": "/solutions/ai-solutions",
    "/solutions/supplier-engagement": "/solutions/supplier-engagement",
    "/manifesto": "/manifesto",
    "/careers": "/careers",
    "/ai-agents": "/ai-agents",
    "/customer-stories": {
      en: "/customer-stories",
      fr: "/cas-clients",
    },
    "/customer-stories/[slug]": {
      en: "/customer-stories/[slug]",
      fr: "/cas-clients/[slug]",
    },
    "/resources": {
      en: "/resources",
      fr: "/ressources",
    },
    "/resources/blog": {
      en: "/resources/blog",
      fr: "/ressources/blog",
    },
    "/resources/blog/[slug]": {
      en: "/resources/blog/[slug]",
      fr: "/ressources/blog/[slug]",
    },
    "/resources/guides": {
      en: "/resources/guides",
      fr: "/ressources/guides",
    },
    "/resources/guides/[slug]": {
      en: "/resources/guides/[slug]",
      fr: "/ressources/guides/[slug]",
    },
    "/resources/news": {
      en: "/resources/news",
      fr: "/ressources/news",
    },
    "/resources/news/[slug]": {
      en: "/resources/news/[slug]",
      fr: "/ressources/news/[slug]",
    },
    "/resources/events": {
      en: "/resources/events",
      fr: "/ressources/events",
    },
    "/get-started": {
      en: "/get-started",
      fr: "/contact",
    },
    "/legal/terms-and-conditions": {
      en: "/legal/terms-and-conditions",
      fr: "/legal/conditions-generales-dutilisation",
    },
    "/legal/privacy-policy": {
      en: "/legal/privacy-policy",
      fr: "/legal/politique-de-confidentialite",
    },
    "/authors/[slug]": {
      en: "/authors/[slug]",
      fr: "/auteurs/[slug]",
    },
    "/legal/legal-notices": {
      en: "/legal/legal-notices",
      fr: "/legal/mentions-legales",
    },
  },
});
