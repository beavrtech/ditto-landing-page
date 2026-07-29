// The Scope editorial taxonomy, as defined by the editorial team.
//
// Level 1 = pillar, level 2 = theme, level 3 = the named framework, regulation
// or practice. Every theme carries level-3 topics. Every article declares a
// `section` of two or three slugs; see content/media/authoring/TAXONOMY.md.
//
// Slugs are ASCII and French-derived, matching the site's existing convention.
// French-specific schemes (MASE, ICPE, RFAR, QVT) keep their French names in
// English too, because they have no English equivalent.

export type MediaLocale = "en" | "fr";

export interface TaxonomyNode {
  slug: string;
  label: { en: string; fr: string };
  /** One line on what the pillar covers. Shown on its listing page. */
  blurb?: { en: string; fr: string };
  children?: TaxonomyNode[];
}

export const TAXONOMY: TaxonomyNode[] = [
  {
    slug: "qhse",
    label: { en: "QHSE", fr: "QHSE" },
    blurb: {
      en: "The management system and the shop floor",
      fr: "Le système de management et le terrain",
    },
    children: [
      {
        slug: "normes-et-systemes-de-management",
        label: { en: "Standards & management systems", fr: "Normes et systèmes de management" },
        children: [
          { slug: "iso-9001", label: { en: "ISO 9001", fr: "ISO 9001" } },
          { slug: "iso-14001", label: { en: "ISO 14001", fr: "ISO 14001" } },
          { slug: "iso-45001", label: { en: "ISO 45001", fr: "ISO 45001" } },
          { slug: "mase", label: { en: "MASE", fr: "MASE" } },
        ],
      },
      {
        slug: "sante-securite-et-qvt",
        label: { en: "Health, safety & QVT", fr: "Santé, sécurité et QVT" },
        children: [
          { slug: "prevention", label: { en: "Prevention", fr: "Prévention" } },
          { slug: "culture-securite", label: { en: "Safety culture", fr: "Culture sécurité" } },
          { slug: "facteur-humain", label: { en: "Human factors", fr: "Facteur humain" } },
        ],
      },
      {
        slug: "environnement-et-excellence-operationnelle",
        label: {
          en: "Environment & operational excellence",
          fr: "Environnement et excellence opérationnelle",
        },
        children: [
          { slug: "icpe", label: { en: "ICPE", fr: "ICPE" } },
          { slug: "dechets", label: { en: "Waste", fr: "Déchets" } },
          { slug: "energie", label: { en: "Energy", fr: "Énergie" } },
          { slug: "lean", label: { en: "Lean", fr: "Lean" } },
          {
            slug: "amelioration-continue",
            label: { en: "Continuous improvement", fr: "Amélioration continue" },
          },
        ],
      },
      {
        slug: "audits-et-certification",
        label: { en: "Audits & certification", fr: "Audits et certification" },
        children: [
          { slug: "preparation", label: { en: "Preparation", fr: "Préparation" } },
          {
            slug: "choix-organisme",
            label: { en: "Choosing a certification body", fr: "Choix d'organisme" },
          },
          { slug: "temoignages", label: { en: "Case studies", fr: "Témoignages" } },
        ],
      },
    ],
  },
  {
    slug: "rse",
    label: { en: "CSR", fr: "RSE" },
    blurb: {
      en: "The performance you have to prove to the outside world",
      fr: "La performance à démontrer vers l'extérieur",
    },
    children: [
      {
        slug: "notations-et-evaluations",
        label: { en: "Ratings & assessments", fr: "Notations et évaluations" },
        children: [
          { slug: "ecovadis", label: { en: "EcoVadis", fr: "EcoVadis" } },
          { slug: "cdp", label: { en: "CDP", fr: "CDP" } },
          {
            slug: "questionnaires-donneurs-ordre",
            label: { en: "Customer questionnaires", fr: "Questionnaires donneurs d'ordre" },
          },
        ],
      },
      {
        slug: "reporting-et-cadres",
        label: { en: "Reporting & frameworks", fr: "Reporting et cadres" },
        children: [
          { slug: "csrd", label: { en: "CSRD", fr: "CSRD" } },
          { slug: "vsme", label: { en: "VSME", fr: "VSME" } },
          { slug: "gri", label: { en: "GRI", fr: "GRI" } },
          { slug: "odd", label: { en: "SDGs", fr: "ODD" } },
        ],
      },
      {
        slug: "climat-et-carbone",
        label: { en: "Climate & carbon", fr: "Climat et carbone" },
        children: [
          { slug: "bilan-carbone", label: { en: "Carbon footprint", fr: "Bilan carbone" } },
          { slug: "scopes", label: { en: "Scopes 1, 2, 3", fr: "Scopes" } },
          { slug: "decarbonation", label: { en: "Decarbonization", fr: "Décarbonation" } },
        ],
      },
      {
        slug: "strategie-gouvernance-et-acces-marche",
        label: {
          en: "Strategy, governance & market access",
          fr: "Stratégie, gouvernance et accès marché",
        },
        children: [
          {
            slug: "double-materialite",
            label: { en: "Double materiality", fr: "Double matérialité" },
          },
          { slug: "politiques", label: { en: "Policies", fr: "Politiques" } },
          {
            slug: "pression-donneurs-ordre",
            label: { en: "Customer pressure", fr: "Pression donneurs d'ordre" },
          },
        ],
      },
    ],
  },
  {
    slug: "supply-chain",
    label: { en: "Supply Chain", fr: "Supply Chain" },
    blurb: {
      en: "Suppliers and the products upstream",
      fr: "Les fournisseurs et les produits en amont",
    },
    children: [
      {
        slug: "reglementations-produit-et-chaine",
        label: { en: "Product & chain regulations", fr: "Réglementations produit et chaîne" },
        children: [
          { slug: "eudr", label: { en: "EUDR", fr: "EUDR" } },
          { slug: "ppwr", label: { en: "PPWR", fr: "PPWR" } },
          { slug: "reach", label: { en: "REACH", fr: "REACH" } },
          { slug: "pfas", label: { en: "PFAS", fr: "PFAS" } },
          { slug: "cbam", label: { en: "CBAM", fr: "CBAM" } },
          { slug: "cs3d", label: { en: "CS3D", fr: "CS3D" } },
        ],
      },
      {
        slug: "engagement-et-evaluation-fournisseurs",
        label: {
          en: "Supplier engagement & assessment",
          fr: "Engagement et évaluation fournisseurs",
        },
        children: [
          { slug: "campagnes", label: { en: "Campaigns", fr: "Campagnes" } },
          { slug: "questionnaires", label: { en: "Questionnaires", fr: "Questionnaires" } },
          { slug: "scoring", label: { en: "Scoring", fr: "Scoring" } },
        ],
      },
      {
        slug: "achats-responsables",
        label: { en: "Responsible sourcing", fr: "Achats responsables" },
        children: [
          { slug: "iso-20400", label: { en: "ISO 20400", fr: "ISO 20400" } },
          { slug: "label-rfar", label: { en: "RFAR label", fr: "Label RFAR" } },
          { slug: "politique-achats", label: { en: "Procurement policy", fr: "Politique achats" } },
        ],
      },
      {
        slug: "tracabilite-donnees-et-risques",
        label: { en: "Traceability, data & risk", fr: "Traçabilité, données et risques" },
        children: [
          { slug: "collecte", label: { en: "Data collection", fr: "Collecte" } },
          { slug: "preuve", label: { en: "Evidence", fr: "Preuve" } },
          {
            slug: "cartographie-des-risques",
            label: { en: "Risk mapping", fr: "Cartographie des risques" },
          },
        ],
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
    // Annotated because `nodes` is reassigned from `node.children` below, and
    // the inference would otherwise be circular.
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
