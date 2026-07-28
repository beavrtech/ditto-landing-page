// Northstar editorial taxonomy.
// Level 1 = pillar (QHSE / RSE / Supply Chain), Level 2 = theme, Level 3 = named
// framework or regulation. Depth is variable by design: only "Normes et
// régulations" branches carry a level 3. Every article must have level1 +
// level2; level3 only when the piece is about one named framework.

export type MediaLocale = "en" | "fr";

export interface TaxonomyNode {
  slug: string;
  label: { en: string; fr: string };
  children?: TaxonomyNode[];
  /** Proposed by us to balance the branch — not user-validated yet. Remove the line to drop it. */
  suggested?: true;
}

export const TAXONOMY: TaxonomyNode[] = [
  {
    slug: "qhse",
    label: { en: "QHSE", fr: "QHSE" },
    children: [
      { slug: "qualite", label: { en: "Quality", fr: "Qualité" } },
      { slug: "sst", label: { en: "Health & Safety", fr: "SST" } },
      { slug: "environnement", label: { en: "Environment", fr: "Environnement" } },
      { slug: "outils", label: { en: "Tools", fr: "Outils" } },
    ],
  },
  {
    slug: "rse",
    label: { en: "CSR", fr: "RSE" },
    children: [
      {
        slug: "normes-et-regulations",
        label: { en: "Standards & Regulations", fr: "Normes et régulations" },
        children: [
          { slug: "ecovadis", label: { en: "EcoVadis", fr: "EcoVadis" } },
          { slug: "cdp", label: { en: "CDP", fr: "CDP" } },
          { slug: "csrd", label: { en: "CSRD", fr: "CSRD" } },
          { slug: "iso-27001", label: { en: "ISO 27001", fr: "ISO 27001" } },
          { slug: "iso-50001", label: { en: "ISO 50001", fr: "ISO 50001" } },
          { slug: "autres-normes", label: { en: "Other standards", fr: "Autres normes" } },
        ],
      },
      { slug: "carbone", label: { en: "Carbon", fr: "Carbone" } },
      {
        slug: "strategie-et-bonnes-pratiques",
        label: { en: "Strategy & Best Practices", fr: "Stratégie et bonnes pratiques" },
      },
      {
        slug: "innovations-et-technologies",
        label: { en: "Innovation & Technology", fr: "Innovations et Technologies" },
      },
      { slug: "outils-et-solutions", label: { en: "Tools & Solutions", fr: "Outils et Solutions" } },
      { slug: "mesures-et-performances", label: { en: "Measurement & Performance", fr: "Mesures et Performances" } },
    ],
  },
  {
    slug: "supply-chain",
    label: { en: "Supply Chain", fr: "Supply Chain" },
    children: [
      {
        slug: "normes-et-regulations",
        label: { en: "Standards & Regulations", fr: "Normes et régulations" },
        children: [
          { slug: "reach", label: { en: "REACH", fr: "REACH" } },
          { slug: "eudr", label: { en: "EUDR", fr: "EUDR" } },
          { slug: "ppwr", label: { en: "PPWR", fr: "PPWR" } },
          { slug: "pfas", label: { en: "PFAS", fr: "PFAS" } },
          { slug: "rohs", label: { en: "RoHS", fr: "RoHS" } },
        ],
      },
      {
        slug: "tracabilite-et-transparence",
        label: { en: "Traceability & Transparency", fr: "Traçabilité et Transparence" },
        suggested: true,
      },
      {
        slug: "achats-responsables",
        label: { en: "Responsible Sourcing", fr: "Achats responsables" },
        suggested: true,
      },
      {
        slug: "outils-et-solutions",
        label: { en: "Tools & Solutions", fr: "Outils et Solutions" },
        suggested: true,
      },
    ],
  },
];

export interface Industry {
  slug: string;
  label: { en: string; fr: string };
}

export const INDUSTRIES: Industry[] = [
  { slug: "aerospatiale-defense", label: { en: "Aerospace & Defense", fr: "Aérospatiale & Défense" } },
  { slug: "construction", label: { en: "Construction", fr: "Construction" } },
  { slug: "cosmetiques-beaute", label: { en: "Cosmetics & Beauty", fr: "Cosmétiques & Beauté" } },
  { slug: "distribution", label: { en: "Retail & Distribution", fr: "Distribution" } },
  { slug: "electronique", label: { en: "Electronics", fr: "Électronique" } },
  { slug: "industrie-equipements", label: { en: "Industry & Equipment", fr: "Industrie & Équipements" } },
  { slug: "technologie-logiciels", label: { en: "Technology & Software", fr: "Technologie & Logiciels" } },
  { slug: "transport-logistique", label: { en: "Transport & Logistics", fr: "Transport & Logistique" } },
];

export function taxonomyLabel(node: TaxonomyNode | Industry, locale: MediaLocale): string {
  return node.label[locale];
}

/**
 * Resolve a /media/theme/[...path] catch-all into the chain of taxonomy nodes.
 * Returns null when any segment is invalid (caller should notFound()).
 */
export function findTaxonomyPath(path: string[]): TaxonomyNode[] | null {
  const chain: TaxonomyNode[] = [];
  let nodes: TaxonomyNode[] | undefined = TAXONOMY;
  for (const segment of path) {
    const node: TaxonomyNode | undefined = nodes?.find((n) => n.slug === segment);
    if (!node) return null;
    chain.push(node);
    nodes = node.children;
  }
  return chain.length > 0 ? chain : null;
}

/** Every valid theme path, for generateStaticParams (includes empty nodes on purpose). */
export function allTaxonomyPaths(): string[][] {
  const paths: string[][] = [];
  const walk = (nodes: TaxonomyNode[], prefix: string[]) => {
    for (const node of nodes) {
      const path = [...prefix, node.slug];
      paths.push(path);
      if (node.children) walk(node.children, path);
    }
  };
  walk(TAXONOMY, []);
  return paths;
}

export function findIndustry(slug: string): Industry | null {
  return INDUSTRIES.find((i) => i.slug === slug) ?? null;
}
