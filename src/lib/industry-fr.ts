/**
 * Fallback French translations for industry names when `name_fr` is not
 * populated in the CMS.  Keyed by the English `name_en` value.
 */
export const INDUSTRY_FR_FALLBACK: Record<string, string> = {
  "Cosmetics & Beauty": "Cosmétiques & Beauté",
  "Transportation & Logistics": "Transport & Logistique",
  "Construction & Materials": "Construction & Matériaux",
  "Business Services": "Services aux entreprises",
  "Industrial Equipment & Systems": "Équipements & Systèmes industriels",
  "Distribution & Wholesale": "Distribution & Commerce de gros",
};

export function industryLabel(
  nameEn: string,
  nameFr: string | null | undefined,
  locale: string,
): string {
  if (locale === "fr") {
    return nameFr || INDUSTRY_FR_FALLBACK[nameEn] || nameEn;
  }
  return nameEn;
}
