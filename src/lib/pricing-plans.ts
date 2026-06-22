/**
 * Pricing-page content — four framework-agnostic plans synthesized from the
 * Ditto service catalog (Essentials / Guided / Managed / Enterprise).
 *
 * Plans are ordered by depth of support: self-serve software → coaching →
 * done-for-you → organization-wide. Frameworks are treated as a capability
 * *inside* a plan, never named individually in the copy.
 *
 * Kept as a localized TS module (rather than messages/*.json) because the
 * comparison matrix is structured data (booleans / per-plan values) that would
 * be unwieldy as flat translation keys.
 */

export type PlanKey = "essentials" | "guided" | "managed" | "enterprise";

export interface Plan {
  key: PlanKey;
  name: string;
  tagline: string;
  description: string;
  /** Short scope chip, e.g. "1 framework" / "Multiple frameworks". */
  scope: string;
  highlights: string[];
  cta: string;
  /** "Book a demo" links to /demo; Enterprise can point elsewhere later. */
  ctaHref: string;
  featured?: boolean;
}

/** A cell is a check (true), a blank (false) or a literal value ("1"). */
export type ComparisonCell = boolean | string;

export interface ComparisonRow {
  label: string;
  /** Ordered: essentials, guided, managed, enterprise. */
  cells: [ComparisonCell, ComparisonCell, ComparisonCell, ComparisonCell];
}

export interface ComparisonGroup {
  title: string;
  rows: ComparisonRow[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PricingContent {
  hero: { eyebrow: string; title: string; subtitle: string; cta: string; ctaHref: string };
  plans: Plan[];
  comparison: {
    heading: string;
    /** Column headers for the four plans. */
    columns: [string, string, string, string];
    groups: ComparisonGroup[];
  };
  faq: { heading: string; items: FaqItem[] };
}

const EN: PricingContent = {
  hero: {
    eyebrow: "",
    title: "Find your plan",
    subtitle:
      "From running a single framework yourself to a fully managed program across your organization — choose the plan that fits, and book a demo for pricing tailored to your scope.",
    cta: "Get personalized pricing",
    ctaHref: "/demo",
  },
  plans: [
    {
      key: "essentials",
      name: "Essentials",
      tagline: "Run it yourself",
      description: "The platform to manage one framework on your own, at your pace.",
      scope: "1 framework",
      highlights: [
        "One framework of your choice",
        "AI gap analysis against the standard",
        "Document templates & resources",
        "Automatic report generation",
        "Self-managed projects in Ditto",
      ],
      cta: "Book a demo",
      ctaHref: "/demo",
    },
    {
      key: "guided",
      name: "Guided",
      tagline: "An expert coach with you",
      description: "Software plus a dedicated coach to prioritize the work and lift your results.",
      scope: "1 framework",
      highlights: [
        "Everything in Essentials",
        "Prioritized 12-month action plan",
        "A dedicated Ditto coach",
        "Document review & recommendations",
        "AI-assisted questionnaire completion",
      ],
      cta: "Book a demo",
      ctaHref: "/demo",
      featured: true,
    },
    {
      key: "managed",
      name: "Managed",
      tagline: "We run it end-to-end",
      description: "A Ditto expert runs your program and handles your most advanced needs.",
      scope: "Multiple frameworks",
      highlights: [
        "Everything in Guided",
        "Program run end-to-end by an expert",
        "Score simulation & optimization",
        "ESG strategy & materiality analysis",
        "Carbon accounting & decarbonation",
        "Professional report writing & design",
      ],
      cta: "Book a demo",
      ctaHref: "/demo",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      tagline: "Scaled across your organization",
      description: "For groups running compliance and sustainability across multiple entities.",
      scope: "Unlimited",
      highlights: [
        "Everything in Managed",
        "Multiple entities consolidated",
        "Supplier engagement at scale",
        "Dedicated customer success manager",
        "SSO, security review & custom integrations",
      ],
      cta: "Contact us",
      ctaHref: "/demo",
    },
  ],
  comparison: {
    heading: "Compare plans",
    columns: ["Essentials", "Guided", "Managed", "Enterprise"],
    groups: [
      {
        title: "Platform",
        rows: [
          { label: "Frameworks included", cells: ["1", "1", "Multiple", "Unlimited"] },
          { label: "AI gap analysis", cells: [true, true, true, true] },
          { label: "Document templates & resources", cells: [true, true, true, true] },
          { label: "Automatic report generation", cells: [true, true, true, true] },
          { label: "Self-managed projects & document base", cells: [true, true, true, true] },
        ],
      },
      {
        title: "Action plan & coaching",
        rows: [
          { label: "Prioritized 12-month action plan", cells: [false, true, true, true] },
          { label: "Dedicated coach & project management", cells: [false, true, true, true] },
          { label: "Document review & recommendations", cells: [false, true, true, true] },
          { label: "AI-assisted questionnaire completion", cells: [false, true, true, true] },
          { label: "Score progress tracking", cells: [false, true, true, true] },
        ],
      },
      {
        title: "Done-for-you & advanced services",
        rows: [
          { label: "Program run end-to-end by an expert", cells: [false, false, true, true] },
          { label: "Score simulation & optimization", cells: [false, false, true, true] },
          { label: "ESG strategy & materiality analysis", cells: [false, false, true, true] },
          { label: "Carbon accounting & decarbonation", cells: [false, false, true, true] },
          { label: "Certification roadmaps & audit prep", cells: [false, false, true, true] },
          { label: "Professional report writing & design", cells: [false, false, true, true] },
        ],
      },
      {
        title: "Scale & security",
        rows: [
          { label: "Multiple entities consolidated", cells: [false, false, false, true] },
          { label: "Supplier engagement at scale", cells: [false, false, false, true] },
          { label: "Dedicated customer success manager", cells: [false, false, false, true] },
          { label: "Priority support & SLAs", cells: [false, false, false, true] },
          { label: "SSO, security review & custom integrations", cells: [false, false, false, true] },
        ],
      },
    ],
  },
  faq: {
    heading: "Frequently asked questions",
    items: [
      {
        q: "How much does Ditto cost?",
        a: "Pricing depends on the plan you choose and the scope of your program. Book a demo and we'll put together a tailored quote.",
      },
      {
        q: "What's the difference between Guided and Managed?",
        a: "With Guided, a dedicated coach helps you do the work and prioritize what matters. With Managed, a Ditto expert runs the program end-to-end for you and takes on advanced services like strategy and carbon.",
      },
      {
        q: "Can I start with one framework and add more later?",
        a: "Yes. Many teams start on Essentials with a single framework and expand as their program grows — you can upgrade at any time.",
      },
      {
        q: "Do you support groups with several entities?",
        a: "Yes. The Enterprise plan consolidates multiple entities and frameworks, with dedicated support, security review and custom integrations.",
      },
      {
        q: "Is Ditto just software, or do you provide support?",
        a: "Both. Essentials is self-serve software; Guided, Managed and Enterprise add increasing levels of expert support — up to a fully managed program.",
      },
    ],
  },
};

const FR: PricingContent = {
  hero: {
    eyebrow: "",
    title: "Trouvez votre formule",
    subtitle:
      "Du pilotage d'un seul référentiel en autonomie à un programme entièrement géré à l'échelle de votre organisation — choisissez le plan adapté et réservez une démo pour un devis sur mesure.",
    cta: "Obtenir un tarif personnalisé",
    ctaHref: "/demo",
  },
  plans: [
    {
      key: "essentials",
      name: "Essentials",
      tagline: "En autonomie",
      description: "La plateforme pour piloter un référentiel en toute autonomie, à votre rythme.",
      scope: "1 référentiel",
      highlights: [
        "Un référentiel de votre choix",
        "Analyse des écarts par l'IA",
        "Modèles et ressources documentaires",
        "Génération automatique de rapport",
        "Projets gérés en autonomie dans Ditto",
      ],
      cta: "Réserver une démo",
      ctaHref: "/demo",
    },
    {
      key: "guided",
      name: "Guided",
      tagline: "Un coach expert à vos côtés",
      description: "Le logiciel et un coach dédié pour prioriser le travail et améliorer vos résultats.",
      scope: "1 référentiel",
      highlights: [
        "Tout ce qui est inclus dans Essentials",
        "Plan d'action priorisé sur 12 mois",
        "Un coach Ditto dédié",
        "Revue documentaire et recommandations",
        "Remplissage des questionnaires assisté par IA",
      ],
      cta: "Réserver une démo",
      ctaHref: "/demo",
      featured: true,
    },
    {
      key: "managed",
      name: "Managed",
      tagline: "Nous le pilotons de bout en bout",
      description: "Un expert Ditto pilote votre programme et prend en charge vos besoins les plus avancés.",
      scope: "Plusieurs référentiels",
      highlights: [
        "Tout ce qui est inclus dans Guided",
        "Programme piloté de bout en bout par un expert",
        "Simulation et optimisation du score",
        "Stratégie ESG et analyse de matérialité",
        "Bilan carbone et décarbonation",
        "Rédaction et mise en forme du rapport",
      ],
      cta: "Réserver une démo",
      ctaHref: "/demo",
    },
    {
      key: "enterprise",
      name: "Enterprise",
      tagline: "À l'échelle de votre organisation",
      description: "Pour les groupes qui pilotent leur conformité et leur durabilité sur plusieurs entités.",
      scope: "Illimité",
      highlights: [
        "Tout ce qui est inclus dans Managed",
        "Consolidation de plusieurs entités",
        "Engagement fournisseurs à grande échelle",
        "Customer success manager dédié",
        "SSO, revue de sécurité et intégrations sur mesure",
      ],
      cta: "Nous contacter",
      ctaHref: "/demo",
    },
  ],
  comparison: {
    heading: "Comparer les plans",
    columns: ["Essentials", "Guided", "Managed", "Enterprise"],
    groups: [
      {
        title: "Plateforme",
        rows: [
          { label: "Référentiels inclus", cells: ["1", "1", "Plusieurs", "Illimité"] },
          { label: "Analyse des écarts par l'IA", cells: [true, true, true, true] },
          { label: "Modèles et ressources documentaires", cells: [true, true, true, true] },
          { label: "Génération automatique de rapport", cells: [true, true, true, true] },
          { label: "Projets et base documentaire en autonomie", cells: [true, true, true, true] },
        ],
      },
      {
        title: "Plan d'action et coaching",
        rows: [
          { label: "Plan d'action priorisé sur 12 mois", cells: [false, true, true, true] },
          { label: "Coach dédié et gestion de projet", cells: [false, true, true, true] },
          { label: "Revue documentaire et recommandations", cells: [false, true, true, true] },
          { label: "Remplissage des questionnaires assisté par IA", cells: [false, true, true, true] },
          { label: "Suivi de la progression du score", cells: [false, true, true, true] },
        ],
      },
      {
        title: "Services clé en main et avancés",
        rows: [
          { label: "Programme piloté de bout en bout par un expert", cells: [false, false, true, true] },
          { label: "Simulation et optimisation du score", cells: [false, false, true, true] },
          { label: "Stratégie ESG et analyse de matérialité", cells: [false, false, true, true] },
          { label: "Bilan carbone et décarbonation", cells: [false, false, true, true] },
          { label: "Feuilles de route de certification et préparation à l'audit", cells: [false, false, true, true] },
          { label: "Rédaction et mise en forme du rapport", cells: [false, false, true, true] },
        ],
      },
      {
        title: "Échelle et sécurité",
        rows: [
          { label: "Consolidation de plusieurs entités", cells: [false, false, false, true] },
          { label: "Engagement fournisseurs à grande échelle", cells: [false, false, false, true] },
          { label: "Customer success manager dédié", cells: [false, false, false, true] },
          { label: "Support prioritaire et SLA", cells: [false, false, false, true] },
          { label: "SSO, revue de sécurité et intégrations sur mesure", cells: [false, false, false, true] },
        ],
      },
    ],
  },
  faq: {
    heading: "Questions fréquentes",
    items: [
      {
        q: "Combien coûte Ditto ?",
        a: "Le tarif dépend du plan choisi et du périmètre de votre programme. Réservez une démo et nous préparerons un devis sur mesure.",
      },
      {
        q: "Quelle est la différence entre Guided et Managed ?",
        a: "Avec Guided, un coach dédié vous aide à réaliser le travail et à prioriser l'essentiel. Avec Managed, un expert Ditto pilote le programme de bout en bout et prend en charge les services avancés comme la stratégie et le carbone.",
      },
      {
        q: "Puis-je commencer avec un seul référentiel et en ajouter ensuite ?",
        a: "Oui. De nombreuses équipes démarrent sur Essentials avec un seul référentiel puis en ajoutent à mesure que leur démarche se développe — vous pouvez évoluer à tout moment.",
      },
      {
        q: "Gérez-vous les groupes avec plusieurs entités ?",
        a: "Oui. Le plan Enterprise consolide plusieurs entités et référentiels, avec un support dédié, une revue de sécurité et des intégrations sur mesure.",
      },
      {
        q: "Ditto, est-ce un logiciel ou un accompagnement ?",
        a: "Les deux. Essentials est un logiciel en autonomie ; Guided, Managed et Enterprise ajoutent des niveaux croissants d'accompagnement par nos experts — jusqu'à un programme entièrement géré.",
      },
    ],
  },
};

export function getPricingContent(locale: string): PricingContent {
  return locale === "fr" ? FR : EN;
}
