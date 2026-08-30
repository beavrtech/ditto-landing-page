export type DuplicateArticle = {
  framework: string;
  en: string;
  fr: string;
};

/**
 * Blog articles that have moved permanently into a framework collection.
 *
 * Keep this list in source control so these SEO-critical redirects do not
 * depend on Supabase being reachable while Next.js evaluates next.config.ts.
 */
export const duplicateArticles: DuplicateArticle[] = [
  { framework: "cdp", en: "7-steps-to-get-a-good-cdp-score", fr: "obtenir-bon-score-cdp" },
  { framework: "cdp", en: "carbon-disclosure-project-cdp", fr: "carbon-disclosure-project-cdp" },
  { framework: "csrd", en: "csrd-double-materiality", fr: "csrd-double-materialite" },
  { framework: "csrd", en: "csrd-european-directive", fr: "directive-europeenne-csrd" },
  { framework: "csrd", en: "csrd-financial-materiality", fr: "csrd-materialite-financiere" },
  { framework: "csrd", en: "csrd-impact-materiality", fr: "csrd-materialite-impact" },
  { framework: "csrd", en: "csrd-who-is-concerned", fr: "csrd-qui-est-concerne" },
  { framework: "ecovadis", en: "ecovadis-2024", fr: "ecovadis-2024" },
  { framework: "ecovadis", en: "ecovadis-2025", fr: "ecovadis-2025" },
  {
    framework: "ecovadis",
    en: "ecovadis-assessment-group-vs-entities",
    fr: "evaluation-ecovadis-groupe-ou-entites",
  },
  { framework: "ecovadis", en: "ecovadis-bronze-medal", fr: "medaille-ecovadis-bronze" },
  { framework: "ecovadis", en: "ecovadis-csrd", fr: "ecovadis-csrd" },
  { framework: "ecovadis", en: "ecovadis-gold-medal", fr: "medaille-ecovadis-gold" },
  { framework: "ecovadis", en: "ecovadis-medals", fr: "medailles-ecovadis" },
  { framework: "ecovadis", en: "ecovadis-platinum-medal", fr: "medaille-ecovadis-platinum" },
  { framework: "ecovadis", en: "ecovadis-score", fr: "score-ecovadis" },
  { framework: "ecovadis", en: "ecovadis-silver-medal", fr: "medaille-ecovadis-silver" },
  { framework: "csrd", en: "esrs-1-requirements", fr: "esrs-1" },
  { framework: "csrd", en: "esrs-csrd-requirements", fr: "esrs-csrd" },
  { framework: "ecovadis", en: "what-is-the-ecovadis-assessment", fr: "ecovadis-cest-quoi" },
  {
    framework: "ecovadis",
    en: "why-seek-assistance-with-your-ecovadis-assessment",
    fr: "consultants-ecovadis",
  },
];

export const duplicateArticleRedirects: {
  source: string;
  destination: string;
  permanent: boolean;
}[] = duplicateArticles.flatMap(
  ({ framework, en, fr }) => [
    {
      source: `/en/resources/blog/${en}`,
      destination: `/en/collection/${framework}/${en}`,
      permanent: true,
    },
    {
      source: `/fr/ressources/blog/${fr}`,
      destination: `/fr/collection/${framework}/${fr}`,
      permanent: true,
    },
  ]
);
