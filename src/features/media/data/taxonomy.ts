// The Scope editorial taxonomy, as defined by the editorial team.
//
// The hierarchy is two levels deep and no deeper: level 1 = pillar, level 2 =
// theme. Every article declares a `section` of exactly those two slugs, which
// drives its URL, its breadcrumb and its card kicker.
//
// The named frameworks, regulations and practices (REACH, CSRD, ISO 45001,
// bilan carbone) are TAGS, not a third level. A tag is flat and global: it can
// be carried by an article filed under any theme, which is what makes it
// useful for a subject that crosses pillars. See
// content/media/authoring/TAXONOMY.md.
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
  /** Themes. Present on pillars only: the tree stops at level 2. */
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
      },
      {
        slug: "sante-securite-et-qvt",
        label: { en: "Health, safety & QVT", fr: "Santé, sécurité et QVT" },
      },
      {
        slug: "environnement-et-excellence-operationnelle",
        label: {
          en: "Environment & operational excellence",
          fr: "Environnement et excellence opérationnelle",
        },
      },
      {
        slug: "audits-et-certification",
        label: { en: "Audits & certification", fr: "Audits et certification" },
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
      },
      {
        slug: "reporting-et-cadres",
        label: { en: "Reporting & frameworks", fr: "Reporting et cadres" },
      },
      {
        slug: "climat-et-carbone",
        label: { en: "Climate & carbon", fr: "Climat et carbone" },
      },
      {
        slug: "strategie-gouvernance-et-acces-marche",
        label: {
          en: "Strategy, governance & market access",
          fr: "Stratégie, gouvernance et accès marché",
        },
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
        slug: "reglementations-produit-et-supply-chain",
        label: {
          en: "Product & supply chain regulations",
          fr: "Réglementations produit et chaîne d'approvisionnement",
        },
      },
      {
        slug: "engagement-et-evaluation-fournisseurs",
        label: {
          en: "Supplier engagement & assessment",
          fr: "Engagement et évaluation fournisseurs",
        },
      },
      {
        slug: "achats-responsables",
        label: { en: "Responsible sourcing", fr: "Achats responsables" },
      },
      {
        slug: "tracabilite-donnees-et-risques",
        label: { en: "Traceability, data & risk", fr: "Traçabilité, données et risques" },
      },
    ],
  },
];

export interface MediaTag {
  slug: string;
  label: { en: string; fr: string };
}

/**
 * The named things an article is about: frameworks, regulations, practices.
 * Flat and global on purpose. A tag belongs to no theme, so REACH can be
 * carried by a supply-chain piece and a QHSE one without being duplicated.
 */
export const TAGS: MediaTag[] = [
  { slug: "amelioration-continue", label: { en: "Continuous improvement", fr: "Amélioration continue" } },
  { slug: "bilan-carbone", label: { en: "Carbon footprint", fr: "Bilan carbone" } },
  { slug: "campagnes", label: { en: "Campaigns", fr: "Campagnes" } },
  { slug: "cartographie-des-risques", label: { en: "Risk mapping", fr: "Cartographie des risques" } },
  { slug: "cbam", label: { en: "CBAM", fr: "CBAM" } },
  { slug: "cdp", label: { en: "CDP", fr: "CDP" } },
  { slug: "choix-organisme", label: { en: "Choosing a certification body", fr: "Choix d'organisme" } },
  { slug: "collecte", label: { en: "Data collection", fr: "Collecte" } },
  { slug: "cs3d", label: { en: "CS3D", fr: "CS3D" } },
  { slug: "csrd", label: { en: "CSRD", fr: "CSRD" } },
  { slug: "culture-securite", label: { en: "Safety culture", fr: "Culture sécurité" } },
  { slug: "dechets", label: { en: "Waste", fr: "Déchets" } },
  { slug: "decarbonation", label: { en: "Decarbonization", fr: "Décarbonation" } },
  { slug: "double-materialite", label: { en: "Double materiality", fr: "Double matérialité" } },
  { slug: "ecovadis", label: { en: "EcoVadis", fr: "EcoVadis" } },
  { slug: "energie", label: { en: "Energy", fr: "Énergie" } },
  { slug: "eudr", label: { en: "EUDR", fr: "EUDR" } },
  { slug: "facteur-humain", label: { en: "Human factors", fr: "Facteur humain" } },
  { slug: "gri", label: { en: "GRI", fr: "GRI" } },
  { slug: "icpe", label: { en: "ICPE", fr: "ICPE" } },
  { slug: "iso-9001", label: { en: "ISO 9001", fr: "ISO 9001" } },
  { slug: "iso-14001", label: { en: "ISO 14001", fr: "ISO 14001" } },
  { slug: "iso-20400", label: { en: "ISO 20400", fr: "ISO 20400" } },
  { slug: "iso-45001", label: { en: "ISO 45001", fr: "ISO 45001" } },
  { slug: "label-rfar", label: { en: "RFAR label", fr: "Label RFAR" } },
  { slug: "lean", label: { en: "Lean", fr: "Lean" } },
  { slug: "mase", label: { en: "MASE", fr: "MASE" } },
  { slug: "odd", label: { en: "SDGs", fr: "ODD" } },
  { slug: "pfas", label: { en: "PFAS", fr: "PFAS" } },
  { slug: "politique-achats", label: { en: "Procurement policy", fr: "Politique achats" } },
  { slug: "politiques", label: { en: "Policies", fr: "Politiques" } },
  { slug: "ppwr", label: { en: "PPWR", fr: "PPWR" } },
  { slug: "preparation", label: { en: "Preparation", fr: "Préparation" } },
  { slug: "pression-donneurs-ordre", label: { en: "Customer pressure", fr: "Pression donneurs d'ordre" } },
  { slug: "prevention", label: { en: "Prevention", fr: "Prévention" } },
  { slug: "preuve", label: { en: "Evidence", fr: "Preuve" } },
  { slug: "questionnaires", label: { en: "Questionnaires", fr: "Questionnaires" } },
  { slug: "questionnaires-donneurs-ordre", label: { en: "Customer questionnaires", fr: "Questionnaires donneurs d'ordre" } },
  { slug: "reach", label: { en: "REACH", fr: "REACH" } },
  { slug: "scopes", label: { en: "Scopes 1, 2, 3", fr: "Scopes" } },
  { slug: "scoring", label: { en: "Scoring", fr: "Scoring" } },
  { slug: "temoignages", label: { en: "Case studies", fr: "Témoignages" } },
  { slug: "vsme", label: { en: "VSME", fr: "VSME" } },
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

export function taxonomyLabel(
  node: TaxonomyNode | Industry | MediaTag,
  locale: MediaLocale
): string {
  return node.label[locale];
}

/**
 * Resolve a /media/theme/[...path] catch-all into the chain of taxonomy nodes.
 * Returns null when any segment is invalid, which includes a third segment:
 * the old level-3 paths are gone and are meant to 404.
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

export function findTag(slug: string): MediaTag | null {
  return TAGS.find((t) => t.slug === slug) ?? null;
}

export function findIndustry(slug: string): Industry | null {
  return INDUSTRIES.find((i) => i.slug === slug) ?? null;
}
