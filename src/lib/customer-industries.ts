/**
 * Canonical list of customer industries used by the /industry/[slug] pages.
 *
 * The customers table (company_logos) stores the `slug` of one of these in its
 * free-text `industry` column. These are a fixed, hand-curated set (not CMS
 * driven), so the names + slugs live here and drive both the static params and
 * the page labels.
 */
export type CustomerIndustry = {
  slug: string;
  name_en: string;
  name_fr: string;
  /** Short EN/FR intro shown under the industry hero heading. */
  intro_en: string;
  intro_fr: string;
};

export const CUSTOMER_INDUSTRIES: CustomerIndustry[] = [
  {
    slug: "electronics",
    name_en: "Electronics",
    name_fr: "Électronique",
    intro_en:
      "How electronics companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les entreprises de l'électronique utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "manufacturing-equipment",
    name_en: "Manufacturing & Equipment",
    name_fr: "Industrie & Équipements",
    intro_en:
      "How manufacturers and equipment makers use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les industriels et fabricants d'équipements utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "transportation-logistics",
    name_en: "Transportation & Logistics",
    name_fr: "Transport & Logistique",
    intro_en:
      "How transportation and logistics companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les entreprises du transport et de la logistique utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "technology-software",
    name_en: "Technology & Software",
    name_fr: "Technologie & Logiciels",
    intro_en:
      "How technology and software companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les entreprises de la tech et du logiciel utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "aerospace-defense",
    name_en: "Aerospace & Defense",
    name_fr: "Aérospatiale & Défense",
    intro_en:
      "How aerospace and defense companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les entreprises de l'aérospatiale et de la défense utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "construction",
    name_en: "Construction",
    name_fr: "Construction",
    intro_en:
      "How construction companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les entreprises de la construction utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
  {
    slug: "retail",
    name_en: "Retail",
    name_fr: "Distribution",
    intro_en:
      "How retail and distribution companies use Ditto to structure their CSR approach, ace supplier assessments, and turn compliance into a competitive edge.",
    intro_fr:
      "Comment les enseignes et distributeurs utilisent Ditto pour structurer leur démarche RSE, réussir leurs évaluations et faire de la conformité un avantage concurrentiel.",
  },
];

export function getCustomerIndustry(slug: string): CustomerIndustry | undefined {
  return CUSTOMER_INDUSTRIES.find((i) => i.slug === slug);
}

export function industryName(industry: CustomerIndustry, locale: string): string {
  return locale === "fr" ? industry.name_fr : industry.name_en;
}

export function industryIntro(industry: CustomerIndustry, locale: string): string {
  return locale === "fr" ? industry.intro_fr : industry.intro_en;
}
