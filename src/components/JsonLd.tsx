export function JsonLd({ data }: { data: Record<string, any> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export const SOFTWARE_APP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.trustditto.com/#software",
  name: "Ditto",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  url: "https://www.trustditto.com/",
  description:
    "Ditto is a web-based software platform that provides AI-powered tools to help companies improve sustainability, ensure regulatory compliance, and boost productivity.",
  softwareVersion: "1.0",
  publisher: {
    "@type": "Organization",
    name: "Ditto",
    url: "https://www.trustditto.com/",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "EUR",
  },
};

export const WEBSITE_JSONLD = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://www.trustditto.com/#website",
  name: "Ditto",
  alternateName: "Ditto – Your CSR copilot",
  url: "https://www.trustditto.com/",
  inLanguage: ["en", "fr"],
  publisher: {
    "@type": "Organization",
    name: "Ditto",
    url: "https://www.trustditto.com/",
  },
};

export const ORGANIZATION_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Ditto",
  alternateName: "Beavr",
  url: "https://www.trustditto.com/en",
  logo: "https://www.trustditto.com/images/ditto-logo.svg",
  description:
    "Ditto helps you level up your CSR practices and meet your partner requirements across frameworks like EcoVadis, ISO, CSRD, and CDP. Your CSR and compliance copilot.",
  slogan: "Your CSR and compliance copilot",
  foundingDate: "2020",
  numberOfEmployees: "10-50",
  availableLanguage: ["English", "French"],
  sameAs: [
    "https://www.trustditto.com/en",
    "https://www.trustditto.com/fr",
    "https://www.linkedin.com/company/trustditto/",
  ],
  knowsAbout: [
    "EcoVadis",
    "ISO 14001",
    "CDP",
    "CSRD",
    "VSME",
    "Corporate Social Responsibility",
    "Sustainability Reporting",
    "Compliance Management",
  ],
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      name: "EcoVadis Training Partner",
      credentialCategory: "Partnership",
    },
    {
      "@type": "EducationalOccupationalCredential",
      name: "Friend of EFRAG",
      credentialCategory: "Partnership",
    },
  ],
};

/**
 * CollectionPage/ItemList JSON-LD for the /press ("in the media") page.
 * Each mention is emitted as a NewsArticle that both `mentions` and is
 * `about` the Ditto Organization, reinforcing the Ditto <-> CSR-proof /
 * EcoVadis / CDP / ISO entity association for search engines and LLM
 * crawlers. Mirrors the style of {@link articleJsonLd}.
 */
export function pressMentionsJsonLd(
  mentions: {
    outlet_name: string;
    article_title: string;
    article_url: string;
    published_date?: string | null;
  }[],
  locale: string
) {
  const organization = {
    "@type": "Organization",
    name: ORGANIZATION_JSONLD.name,
    url: ORGANIZATION_JSONLD.url,
    knowsAbout: ORGANIZATION_JSONLD.knowsAbout,
  };

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `https://www.trustditto.com/${locale}/press`,
    about: organization,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: mentions.map((mention, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: mention.article_title,
          url: mention.article_url,
          ...(mention.published_date && { datePublished: mention.published_date }),
          publisher: {
            "@type": "Organization",
            name: mention.outlet_name,
          },
          mentions: organization,
        },
      })),
    },
  };
}

export function articleJsonLd({
  title,
  description,
  url,
  imageUrl,
  datePublished,
  authorName,
}: {
  title: string;
  description?: string;
  url: string;
  imageUrl?: string;
  datePublished?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    ...(description && { description }),
    url,
    ...(imageUrl && { image: imageUrl }),
    ...(datePublished && { datePublished }),
    ...(authorName && {
      author: { "@type": "Person", name: authorName },
    }),
    publisher: {
      "@type": "Organization",
      name: "Ditto",
      url: "https://www.trustditto.com/",
    },
  };
}
