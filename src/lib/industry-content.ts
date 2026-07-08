/**
 * Rich, hand-written marketing content for the /industry/[slug] pages.
 *
 * The canonical slug list + short names still live in `customer-industries.ts`
 * (they drive the CMS logo strip and static params). This file layers the
 * long-form page copy — hero subhead, context, framework list, outcomes, proof
 * and final CTA — on top, in both `en` and `fr`.
 *
 * Framework acronyms (EcoVadis, RoHS, REACH, CBAM, EUDR, …) are kept verbatim
 * across locales.
 */

export type IndustryFramework = { title: string; desc: string };

/** One outcome bullet: a bold lead-in (`strong`) followed by the rest. */
export type IndustryOutcome = { strong: string; text: string };

export type IndustryProof = {
  /** Narrative case study: bold heading + body paragraph. */
  heading?: string;
  body?: string;
  /** Quote-style proof: pull quote + attribution. */
  quote?: string;
  author?: string;
  ctaLabel: string;
  /**
   * EN slug of a customer story; resolved to the locale-correct URL at render
   * time. Omit to link to the customer-stories index instead.
   */
  caseStudySlug?: string;
};

export type IndustryFinalCta = { heading: string; body: string; button: string };

export type IndustryContentLocale = {
  eyebrow: string;
  h1: string;
  subhead: string;
  context: string[];
  howHelpsIntro: string;
  frameworks: IndustryFramework[];
  outcomes: IndustryOutcome[];
  proof: IndustryProof;
  finalCta: IndustryFinalCta;
};

export type IndustryContent = {
  en: IndustryContentLocale;
  fr: IndustryContentLocale;
};

export const INDUSTRY_CONTENT: Record<string, IndustryContent> = {
  // 1. Electronics -----------------------------------------------------------
  electronics: {
    en: {
      eyebrow: "For electronics manufacturers & distributors",
      h1: "The sustainability & compliance platform for electronics manufacturers and distributors",
      subhead:
        "RoHS, REACH, conflict minerals, EcoVadis, carbon — every OEM wants proof before they buy. Ditto helps you deliver it faster and score higher, with expert guidance built in.",
      context: [
        "Electronics manufacturers and distributors sit deep in the supply chains of automotive, industrial and aerospace OEMs — buyers who now make ESG and product compliance a condition of every contract. An EcoVadis medal in the tender, RoHS and REACH declarations, conflict-minerals due diligence, carbon data: the asks keep coming, from every key account, in every format.",
        "The hard part is keeping up. Miss a deadline or score poorly and you can drop off an approved-vendor list you've been on for years. Get it right and the same requirements become a reason customers choose you over a competitor who can't prove a thing.",
      ],
      howHelpsIntro:
        "One platform, one expert coach, every framework your customers ask about — plus AI that pre-fills the questionnaires so you answer in minutes, not days.",
      frameworks: [
        { title: "EcoVadis", desc: "The medal buyers expect in every tender. We structure your program and prepare the assessment to earn the rating you deserve — as an approved EcoVadis training partner." },
        { title: "RoHS & REACH", desc: "Keep hazardous-substance and SVHC declarations consistent and response-ready, so compliance never holds up a customer order." },
        { title: "Conflict minerals (3TG)", desc: "Run responsible-sourcing due diligence and reporting when your OEM customers demand it." },
        { title: "CDP & carbon", desc: "Measure your value-chain emissions and file a credible climate disclosure when a major account requests one." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires your large EU customers send you as a supplier — on the standard built for SMEs." },
        { title: "ISO 14001", desc: "Keep your environmental management system audit-ready, with every piece of evidence in one place." },
      ],
      outcomes: [
        { strong: "Stay on the approved-vendor lists", text: "that drive your revenue." },
        { strong: "Win tenders on ESG, not just price", text: "— turn a compliance ask into a selling point." },
        { strong: "Score higher", text: "— a structured program and a real coach, not a blank template." },
        { strong: "Cut questionnaire time from days to minutes", text: "with AI and a single source of truth." },
        { strong: "Give your sales team a story", text: "they can take to key accounts." },
      ],
      proof: {
        heading: "Niedax France — from client pressure to a gold EcoVadis medal.",
        body: "Under growing demands from its clients, cable-management manufacturer Niedax France used Ditto to structure its CSR approach and earn a gold EcoVadis medal — turning a compliance obligation into a commercial asset.",
        quote:
          "There was a loss of internal expertise, client pressure was real, and there was a fairly urgent need to get all these programmes back on track.",
        author: "Julie Gay, Quality Director, Niedax France",
        ctaLabel: "Read the Niedax case study",
        caseStudySlug: "niedax-client-pressure-gold-ecovadis-medal",
      },
      finalCta: {
        heading: "Turn electronics compliance into an advantage.",
        body: "Book a free strategy call. We'll map the frameworks your customers are asking for and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour les fabricants et distributeurs de l'électronique",
      h1: "La plateforme durabilité & conformité pour les fabricants et distributeurs de l'électronique",
      subhead:
        "RoHS, REACH, minerais de conflit, EcoVadis, carbone — chaque donneur d'ordre veut des preuves avant d'acheter. Ditto vous aide à les fournir plus vite et à mieux vous noter, avec l'expertise intégrée.",
      context: [
        "Les fabricants et distributeurs de l'électronique sont au cœur des chaînes d'approvisionnement des donneurs d'ordre de l'automobile, de l'industrie et de l'aéronautique — des acheteurs qui font désormais de la RSE et de la conformité produit une condition de chaque contrat. Une médaille EcoVadis dans l'appel d'offres, des déclarations RoHS et REACH, un devoir de vigilance sur les minerais de conflit, des données carbone : les demandes s'enchaînent, de chaque compte clé, dans tous les formats.",
        "Le plus dur, c'est de suivre le rythme. Un délai manqué ou une note trop faible, et vous pouvez sortir d'une liste de fournisseurs référencés où vous figuriez depuis des années. Bien géré, ce même exigence devient une raison pour vos clients de vous choisir plutôt qu'un concurrent incapable de prouver quoi que ce soit.",
      ],
      howHelpsIntro:
        "Une plateforme, un coach expert, tous les référentiels que vos clients demandent — et une IA qui pré-remplit les questionnaires pour répondre en minutes, pas en jours.",
      frameworks: [
        { title: "EcoVadis", desc: "La médaille attendue dans chaque appel d'offres. Nous structurons votre démarche et préparons l'évaluation pour décrocher la note que vous méritez — en tant que partenaire de formation agréé EcoVadis." },
        { title: "RoHS & REACH", desc: "Gardez vos déclarations de substances dangereuses et SVHC cohérentes et prêtes à l'envoi, pour que la conformité ne bloque jamais une commande client." },
        { title: "Minerais de conflit (3TG)", desc: "Menez le devoir de vigilance et le reporting sur l'approvisionnement responsable quand vos donneurs d'ordre l'exigent." },
        { title: "CDP & carbone", desc: "Mesurez les émissions de votre chaîne de valeur et publiez une déclaration climat crédible quand un grand compte la demande." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que vos grands clients européens vous envoient en tant que fournisseur — sur le standard conçu pour les PME." },
        { title: "ISO 14001", desc: "Gardez votre système de management environnemental prêt pour l'audit, avec chaque preuve au même endroit." },
      ],
      outcomes: [
        { strong: "Restez sur les listes de fournisseurs référencés", text: "qui font votre chiffre d'affaires." },
        { strong: "Gagnez des appels d'offres sur la RSE, pas seulement sur le prix", text: "— transformez une exigence en argument commercial." },
        { strong: "Obtenez une meilleure note", text: "— une démarche structurée et un vrai coach, pas un modèle vierge." },
        { strong: "Réduisez le temps de traitement des questionnaires", text: "de plusieurs jours à quelques minutes grâce à l'IA et à une source unique de vérité." },
        { strong: "Donnez à vos commerciaux un argumentaire", text: "à porter auprès des comptes clés." },
      ],
      proof: {
        heading: "Niedax France — de la pression client à la médaille d'or EcoVadis.",
        body: "Face aux exigences croissantes de ses clients, le fabricant de chemins de câbles Niedax France a utilisé Ditto pour structurer sa démarche RSE et décrocher une médaille d'or EcoVadis — transformant une obligation de conformité en atout commercial.",
        quote:
          "Il y avait une perte de compétences en interne, une pression client qui était là, et un besoin assez urgent de réactiver toutes ces démarches.",
        author: "Julie Gay, Directrice Qualité, Niedax France",
        ctaLabel: "Lire le cas Niedax",
        caseStudySlug: "niedax-client-pressure-gold-ecovadis-medal",
      },
      finalCta: {
        heading: "Faites de la conformité électronique un avantage.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les référentiels que vos clients demandent et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 2. Manufacturing & Equipment --------------------------------------------
  "manufacturing-equipment": {
    en: {
      eyebrow: "For industrial manufacturers & equipment makers",
      h1: "The sustainability & compliance platform for manufacturers and equipment makers",
      subhead:
        "Energy-intensive sites and demanding OEM buyers put ESG on your desk from both sides. Ditto helps you turn EcoVadis, carbon and ISO 50001 into won tenders and lower energy bills.",
      context: [
        "Industrial manufacturers and equipment makers supply demanding OEMs and operate energy-intensive sites — two reasons ESG lands squarely on your desk. Large customers ask for an EcoVadis rating and product carbon data before they'll place an order; regulators and energy costs push you toward ISO 50001 and real decarbonization; and if you buy or process steel and aluminium, carbon-border rules now touch your inputs.",
        "The hard part is doing all of it with a lean team. Requests arrive in different formats from every account, audits loom, and the work competes with production. Handled well, strong ESG performance becomes a genuine edge in competitive tenders.",
      ],
      howHelpsIntro:
        "Everything your buyers and auditors ask for, in one place — with an expert coach beside you and AI that drafts the questionnaire answers.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating buyers expect in tenders, guided by an approved EcoVadis training partner." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires your large customers send you as a supplier, on the SME-ready standard." },
        { title: "Carbon & CDP", desc: "Measure Scope 1–3 emissions and produce the product carbon data buyers increasingly require." },
        { title: "ISO 14001 & ISO 50001", desc: "Keep your environmental and energy management systems audit-ready, evidence organized in one place." },
        { title: "REACH & RoHS", desc: "Manage substance declarations on your components and keep responses consistent across customers." },
        { title: "CBAM", desc: "Get ahead of carbon-border reporting on the steel, aluminium and other inputs you source or transform." },
      ],
      outcomes: [
        { strong: "Win the tenders", text: "where an EcoVadis medal and carbon data decide the shortlist." },
        { strong: "Stay ahead of audits", text: "— ISO evidence and energy data ready when the auditor arrives." },
        { strong: "Cut energy costs", text: "by turning ISO 50001 work into real efficiency gains." },
        { strong: "Answer buyer questionnaires in minutes", text: ", not days, from a single source of truth." },
        { strong: "Compete on more than price", text: "with proof your competitors can't show." },
      ],
      proof: {
        heading: "Émile Maurin — a family business strengthening its CSR strategy with Ditto.",
        body: "The long-standing industrial supplier used Ditto to structure and advance its CSR approach — proof that a mid-sized manufacturer can turn sustainability into a durable advantage.",
        quote:
          "Ditto has truly been a key partner - part structured tool, part supportive outside perspective. It helped us gain clarity, lay solid foundations for our CSR approach, and better understand what EcoVadis expects",
        author: "Camille Bernard, CSR Project Manager, Émile Maurin",
        ctaLabel: "Read the Émile Maurin case study",
        caseStudySlug: "emile-maurin-a-family-business-strengthening-its-csr-strategy-with-ditto",
      },
      finalCta: {
        heading: "Turn manufacturing compliance into an advantage.",
        body: "Book a free strategy call. We'll map the frameworks your customers and auditors expect and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour les industriels et fabricants d'équipements",
      h1: "La plateforme durabilité & conformité pour les industriels et fabricants d'équipements",
      subhead:
        "Des sites énergivores et des donneurs d'ordre exigeants placent la RSE sur votre bureau des deux côtés. Ditto vous aide à transformer EcoVadis, carbone et ISO 50001 en appels d'offres gagnés et en factures d'énergie allégées.",
      context: [
        "Les industriels et fabricants d'équipements fournissent des donneurs d'ordre exigeants et exploitent des sites énergivores — deux raisons pour lesquelles la RSE atterrit directement sur votre bureau. Les grands clients réclament une note EcoVadis et des données carbone produit avant de passer commande ; la réglementation et le coût de l'énergie vous poussent vers l'ISO 50001 et une vraie décarbonation ; et si vous achetez ou transformez de l'acier et de l'aluminium, le mécanisme d'ajustement carbone aux frontières touche désormais vos intrants.",
        "Le plus dur, c'est de tout mener de front avec une équipe réduite. Les demandes arrivent dans des formats différents de chaque compte, les audits approchent, et ce travail entre en concurrence avec la production. Bien gérée, une performance RSE solide devient un vrai avantage dans les appels d'offres.",
      ],
      howHelpsIntro:
        "Tout ce que vos acheteurs et auditeurs demandent, au même endroit — avec un coach expert à vos côtés et une IA qui rédige les réponses aux questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note attendue en appel d'offres, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que vos grands clients vous envoient en tant que fournisseur, sur le standard adapté aux PME." },
        { title: "Carbone & CDP", desc: "Mesurez vos émissions Scope 1–3 et produisez les données carbone produit de plus en plus exigées par les acheteurs." },
        { title: "ISO 14001 & ISO 50001", desc: "Gardez vos systèmes de management environnemental et de l'énergie prêts pour l'audit, preuves organisées au même endroit." },
        { title: "REACH & RoHS", desc: "Gérez les déclarations de substances sur vos composants et gardez des réponses cohérentes d'un client à l'autre." },
        { title: "CBAM", desc: "Prenez de l'avance sur le reporting carbone aux frontières pour l'acier, l'aluminium et les autres intrants que vous achetez ou transformez." },
      ],
      outcomes: [
        { strong: "Gagnez les appels d'offres", text: "où la médaille EcoVadis et les données carbone décident de la short-list." },
        { strong: "Gardez une longueur d'avance sur les audits", text: "— preuves ISO et données énergie prêtes quand l'auditeur arrive." },
        { strong: "Réduisez vos coûts d'énergie", text: "en transformant le travail ISO 50001 en gains d'efficacité réels." },
        { strong: "Répondez aux questionnaires acheteurs", text: "en quelques minutes, pas en jours, depuis une source unique de vérité." },
        { strong: "Différenciez-vous au-delà du prix", text: "avec des preuves que vos concurrents ne peuvent pas montrer." },
      ],
      proof: {
        heading: "Émile Maurin — une entreprise familiale qui renforce sa stratégie RSE avec Ditto.",
        body: "Ce fournisseur industriel de longue date a utilisé Ditto pour structurer et faire avancer sa démarche RSE — la preuve qu'un industriel de taille intermédiaire peut faire de la durabilité un avantage durable.",
        quote:
          "Pour nous, Ditto a vraiment été un partenaire clé, à mi-chemin entre l'outil structurant et le regard extérieur bienveillant des coachs. Ça nous a permis d'y voir plus clair, de poser les bases solides de notre démarche RSE et de mieux comprendre les attentes d'Ecovadis.",
        author: "Camille Bernard, Chargée de mission RSE, Émile Maurin",
        ctaLabel: "Lire le cas Émile Maurin",
        caseStudySlug: "emile-maurin-a-family-business-strengthening-its-csr-strategy-with-ditto",
      },
      finalCta: {
        heading: "Faites de la conformité industrielle un avantage.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les référentiels attendus par vos clients et vos auditeurs et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 3. Transportation & Logistics -------------------------------------------
  "transportation-logistics": {
    en: {
      eyebrow: "For transport, logistics & fleet operators",
      h1: "The sustainability & compliance platform for transportation and logistics",
      subhead:
        "Your fleet is a line in every shipper's Scope 3 report — and now a line in their RFP. Ditto helps carriers measure emissions, earn their EcoVadis rating and turn the numbers into contract wins.",
      context: [
        "Transport and logistics sit at the sharp end of decarbonization. Your biggest clients — retailers, manufacturers, distributors — report their own Scope 3 emissions, and your fleet is a line in it. So the RFP now includes an EcoVadis rating, a carbon footprint and a decarbonization plan alongside price and service.",
        "The hard part is producing credible numbers and answers across a fragmented operation, often with a small team. Fall short and you lose the tender; get it right and your emissions data becomes a reason shippers keep and expand your contracts.",
      ],
      howHelpsIntro:
        "The frameworks your shippers care about, handled together — with an expert coach and AI that turns your data into ready-to-send answers.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating shippers increasingly require in RFPs, guided by an approved EcoVadis training partner." },
        { title: "Carbon & GHG reporting", desc: "Measure fleet and value-chain emissions and give clients the Scope 3 data they need from you." },
        { title: "CDP", desc: "File a credible climate disclosure when a major shipper requests one." },
        { title: "CSRD / VSME", desc: "Meet EU sustainability reporting expectations, whether you report directly or answer as a supplier." },
        { title: "ISO 14001 & ISO 50001", desc: "Keep environmental and energy management audit-ready across sites and depots." },
      ],
      outcomes: [
        { strong: "Win and defend contracts", text: "where emissions data and EcoVadis now decide the shortlist." },
        { strong: "Give shippers the Scope 3 numbers", text: "they need — before they have to chase you." },
        { strong: "Turn a decarbonization plan", text: "into a commercial argument, not just a cost." },
        { strong: "Answer client questionnaires in minutes", text: "from one source of truth." },
        { strong: "Report with confidence", text: "— a coach beside you, not a blank spreadsheet." },
      ],
      proof: {
        heading: "Trusted by carriers across the sector",
        body: "From national hauliers like Groupe Mauffrey and Jacky Perrenot to specialists like Chemship and Sénalia, Ditto helps transport and logistics operators of every size turn emissions reporting into contract wins.",
        quote: "EcoVadis has become non-negotiable. You see it in every client request.",
        author: "Louis Gauthier, CSR Coordinator & Executive Assistant, Groupe Brangeon",
        ctaLabel: "Read the Groupe Brangeon case study",
        caseStudySlug: "groupe-brangeon-ecovadis-progression",
      },
      finalCta: {
        heading: "Turn transport compliance into contract wins.",
        body: "Book a free strategy call. We'll map what your shippers are asking for and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour le transport, la logistique et les flottes",
      h1: "La plateforme durabilité & conformité pour le transport et la logistique",
      subhead:
        "Votre flotte est une ligne dans le bilan Scope 3 de chaque chargeur — et désormais une ligne dans son appel d'offres. Ditto aide les transporteurs à mesurer leurs émissions, décrocher leur note EcoVadis et transformer ces chiffres en contrats gagnés.",
      context: [
        "Le transport et la logistique sont en première ligne de la décarbonation. Vos plus gros clients — enseignes, industriels, distributeurs — publient leurs propres émissions Scope 3, et votre flotte en est une ligne. L'appel d'offres inclut donc désormais une note EcoVadis, un bilan carbone et un plan de décarbonation, à côté du prix et du service.",
        "Le plus dur, c'est de produire des chiffres et des réponses crédibles sur une activité fragmentée, souvent avec une petite équipe. À défaut, vous perdez l'appel d'offres ; bien géré, votre reporting d'émissions devient une raison pour les chargeurs de conserver et d'élargir vos contrats.",
      ],
      howHelpsIntro:
        "Les référentiels qui comptent pour vos chargeurs, traités ensemble — avec un coach expert et une IA qui transforme vos données en réponses prêtes à l'envoi.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note de plus en plus exigée par les chargeurs dans leurs appels d'offres, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "Carbone & reporting GES", desc: "Mesurez les émissions de votre flotte et de votre chaîne de valeur et fournissez aux clients les données Scope 3 qu'ils attendent de vous." },
        { title: "CDP", desc: "Publiez une déclaration climat crédible quand un grand chargeur la demande." },
        { title: "CSRD / VSME", desc: "Répondez aux attentes de reporting durabilité de l'UE, que vous reportiez directement ou en tant que fournisseur." },
        { title: "ISO 14001 & ISO 50001", desc: "Gardez le management environnemental et énergétique prêt pour l'audit sur l'ensemble des sites et dépôts." },
      ],
      outcomes: [
        { strong: "Gagnez et défendez des contrats", text: "où les données d'émissions et EcoVadis décident désormais de la short-list." },
        { strong: "Donnez aux chargeurs les chiffres Scope 3", text: "dont ils ont besoin — avant qu'ils aient à les réclamer." },
        { strong: "Transformez un plan de décarbonation", text: "en argument commercial, pas seulement en coût." },
        { strong: "Répondez aux questionnaires clients en minutes", text: "depuis une source unique de vérité." },
        { strong: "Reportez en confiance", text: "— un coach à vos côtés, pas un tableur vierge." },
      ],
      proof: {
        heading: "La confiance des transporteurs de tout le secteur",
        body: "Des transporteurs nationaux comme le Groupe Mauffrey et Jacky Perrenot aux spécialistes comme Chemship et Sénalia, Ditto aide les opérateurs du transport et de la logistique de toute taille à transformer le reporting d'émissions en contrats gagnés.",
        quote: "EcoVadis est devenu incontournable. On le voit dans toutes les demandes clients.",
        author: "Louis Gauthier, Coordinateur RSE & Attaché de Direction Générale, Groupe Brangeon",
        ctaLabel: "Lire le cas Groupe Brangeon",
        caseStudySlug: "groupe-brangeon-ecovadis-progression",
      },
      finalCta: {
        heading: "Transformez la conformité transport en contrats gagnés.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les demandes de vos chargeurs et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 4. Technology & Software -------------------------------------------------
  "technology-software": {
    en: {
      eyebrow: "For software, IT services & telecom companies",
      h1: "The sustainability & compliance platform for technology and software companies",
      subhead:
        "ESG questionnaires now sit between you and the signed contract. Ditto helps you clear procurement — EcoVadis, carbon, security-and-sustainability reviews — and shorten the sales cycle.",
      context: [
        "For technology and software companies, ESG shows up in the sales cycle. Enterprise and public-sector buyers run vendor assessments — an EcoVadis rating, a security-and-sustainability questionnaire, a carbon footprint for your cloud footprint — before a contract clears procurement. A weak answer stalls the deal.",
        "The hard part is that these requests land on teams focused on product and growth, in endless one-off formats. Done once and done well, your ESG credentials stop being a blocker and start shortening your sales cycle.",
      ],
      howHelpsIntro:
        "Clear procurement's ESG checklist from one platform — with an expert coach and AI that fills the security-and-sustainability sections for you.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating that clears enterprise vendor assessments, guided by an approved EcoVadis training partner." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires your enterprise clients send you as a supplier, on the SME-ready standard." },
        { title: "Carbon", desc: "Measure your digital and value-chain emissions, including cloud and data-center footprint, and report them credibly." },
        { title: "CDP", desc: "File a strong climate disclosure when a major customer requests it." },
        { title: "ISO 14001", desc: "Stand up a credible environmental management system and keep the evidence organized." },
      ],
      outcomes: [
        { strong: "Shorten the sales cycle", text: "— clear procurement's ESG gate the first time." },
        { strong: "Win enterprise and public tenders", text: "where an EcoVadis rating is now table stakes." },
        { strong: "Answer security & ESG questionnaires in minutes", text: "with AI and one source of truth." },
        { strong: "Show real carbon numbers", text: "for your cloud footprint, not estimates." },
        { strong: "Free your team", text: "to focus on product while Ditto and your coach handle compliance." },
      ],
      proof: {
        quote:
          "Before Ditto, we tested another solution, but it didn't meet our expectations in terms of speed, autonomy, and added value. With Ditto, it's the opposite: we've found a true CSR partner that helps us structure our approach while saving us a lot of time.",
        author: "Audrey Evin, Marketing & Communications Director and CSR Manager, WAAT",
        ctaLabel: "See customer stories",
      },
      finalCta: {
        heading: "Turn ESG from a deal-blocker into a deal-maker.",
        body: "Book a free strategy call. We'll map what your buyers are asking for in procurement and show you how Ditto gets you through faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour les éditeurs de logiciels, ESN et télécoms",
      h1: "La plateforme durabilité & conformité pour la tech et le logiciel",
      subhead:
        "Les questionnaires RSE se glissent désormais entre vous et le contrat signé. Ditto vous aide à passer les achats — EcoVadis, carbone, revues sécurité et durabilité — et à raccourcir votre cycle de vente.",
      context: [
        "Pour les entreprises de la tech et du logiciel, la RSE apparaît dans le cycle de vente. Les grands comptes et le secteur public mènent des évaluations fournisseurs — note EcoVadis, questionnaire sécurité et durabilité, bilan carbone de votre empreinte cloud — avant qu'un contrat ne passe les achats. Une réponse faible bloque le deal.",
        "Le plus dur, c'est que ces demandes tombent sur des équipes concentrées sur le produit et la croissance, dans des formats ponctuels sans fin. Fait une fois et bien fait, votre profil RSE cesse d'être un frein et se met à raccourcir votre cycle de vente.",
      ],
      howHelpsIntro:
        "Passez la checklist RSE des achats depuis une seule plateforme — avec un coach expert et une IA qui remplit pour vous les sections sécurité et durabilité.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note qui valide les évaluations fournisseurs des grands comptes, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que vos clients grands comptes vous envoient en tant que fournisseur, sur le standard adapté aux PME." },
        { title: "Carbone", desc: "Mesurez vos émissions numériques et de chaîne de valeur, empreinte cloud et data-centers comprises, et reportez-les de façon crédible." },
        { title: "CDP", desc: "Publiez une déclaration climat solide quand un grand client la demande." },
        { title: "ISO 14001", desc: "Mettez en place un système de management environnemental crédible et gardez les preuves organisées." },
      ],
      outcomes: [
        { strong: "Raccourcissez le cycle de vente", text: "— franchissez la barrière RSE des achats du premier coup." },
        { strong: "Gagnez des appels d'offres grands comptes et publics", text: "où la note EcoVadis est désormais un prérequis." },
        { strong: "Répondez aux questionnaires sécurité et RSE en minutes", text: "grâce à l'IA et une source unique de vérité." },
        { strong: "Montrez de vrais chiffres carbone", text: "pour votre empreinte cloud, pas des estimations." },
        { strong: "Libérez votre équipe", text: "pour se concentrer sur le produit pendant que Ditto et votre coach gèrent la conformité." },
      ],
      proof: {
        quote:
          "Avant Ditto, nous avions testé une autre solution, mais elle ne répondait pas à nos attentes en termes de rapidité, d'autonomie et de valeur ajoutée. Avec Ditto, c'est l'inverse : nous avons trouvé un vrai partenaire RSE qui nous aide à structurer notre démarche tout en nous faisant gagner beaucoup de temps.",
        author: "Audrey Evin, Directrice Marketing & Communication et Responsable RSE, WAAT",
        ctaLabel: "Voir les témoignages clients",
      },
      finalCta: {
        heading: "Faites de la RSE un accélérateur de deals, et non plus un frein.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions ce que le service achats de vos clients exige et vous montrons comment Ditto vous fait passer plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 5. Aerospace & Defense ---------------------------------------------------
  "aerospace-defense": {
    en: {
      eyebrow: "For aerospace & defense suppliers",
      h1: "The sustainability & compliance platform for aerospace and defense",
      subhead:
        "Primes push REACH, RoHS, conflict-minerals and EcoVadis requirements down to every supplier. Ditto helps you meet each one with defensible evidence — and stay qualified for the next program.",
      context: [
        "Aerospace and defense supply chains are long, tightly regulated and unforgiving. Primes and tier-1s pass their obligations down to you: an EcoVadis rating in the qualification pack, REACH and RoHS declarations on materials and special processes, conflict-minerals due diligence, and increasingly carbon data across the program.",
        "The hard part is meeting exacting standards with the evidence to defend them — across years-long programs and dozens of parts. Handled well, rigorous compliance is exactly what keeps you qualified and wins the next program.",
      ],
      howHelpsIntro:
        "Every prime requirement in one defensible system — with an expert coach and AI that pre-fills supplier questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating primes expect in supplier qualification, guided by an approved EcoVadis training partner." },
        { title: "REACH & RoHS", desc: "Keep substance declarations on materials and special processes consistent and defensible." },
        { title: "Conflict minerals (3TG)", desc: "Run and document responsible-sourcing due diligence across your parts." },
        { title: "Carbon & CDP", desc: "Measure program and value-chain emissions and disclose credibly when asked." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires primes and tier-1s send you as a supplier." },
        { title: "ISO 14001", desc: "Keep your environmental management system audit-ready with defensible evidence." },
      ],
      outcomes: [
        { strong: "Stay qualified", text: "on prime and tier-1 supplier panels." },
        { strong: "Defend every declaration", text: "with organized, audit-ready evidence." },
        { strong: "Win the next program", text: "with ESG credentials competitors can't match." },
        { strong: "Answer supplier questionnaires in minutes", text: ", not weeks, from one source of truth." },
        { strong: "Turn rigorous compliance", text: "into a reason to be designed in." },
      ],
      proof: {
        quote:
          "We are delighted with our collaboration with Ditto and the involvement of our coach: you have enabled us to make rapid and structural progress on our ESG roadmap! A great mix of expertise and cheerful energy.",
        author: "Laurence Sauphanor, Director of Sustainable Development, Communication & Impact, Quito Aero",
        ctaLabel: "See customer stories",
      },
      finalCta: {
        heading: "Turn aerospace compliance into your next program win.",
        body: "Book a free strategy call. We'll map what your primes require and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour les fournisseurs de l'aérospatiale et de la défense",
      h1: "La plateforme durabilité & conformité pour l'aérospatiale et la défense",
      subhead:
        "Les donneurs d'ordre répercutent les exigences REACH, RoHS, minerais de conflit et EcoVadis sur chaque fournisseur. Ditto vous aide à répondre à chacune avec des preuves défendables — et à rester qualifié pour le prochain programme.",
      context: [
        "Les chaînes d'approvisionnement de l'aérospatiale et de la défense sont longues, très réglementées et sans indulgence. Les donneurs d'ordre et rang 1 vous répercutent leurs obligations : une note EcoVadis dans le dossier de qualification, des déclarations REACH et RoHS sur les matériaux et procédés spéciaux, un devoir de vigilance sur les minerais de conflit, et de plus en plus de données carbone sur l'ensemble du programme.",
        "Le plus dur, c'est de répondre à des standards exigeants avec les preuves pour les défendre — sur des programmes longs de plusieurs années et des dizaines de pièces. Bien gérée, une conformité rigoureuse est précisément ce qui vous garde qualifié et remporte le prochain programme.",
      ],
      howHelpsIntro:
        "Chaque exigence des donneurs d'ordre dans un seul système défendable — avec un coach expert et une IA qui pré-remplit les questionnaires fournisseurs.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note attendue par les donneurs d'ordre en qualification fournisseur, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "REACH & RoHS", desc: "Gardez les déclarations de substances sur les matériaux et procédés spéciaux cohérentes et défendables." },
        { title: "Minerais de conflit (3TG)", desc: "Menez et documentez le devoir de vigilance sur l'approvisionnement responsable pour l'ensemble de vos pièces." },
        { title: "Carbone & CDP", desc: "Mesurez les émissions du programme et de la chaîne de valeur et publiez-les de façon crédible quand on vous le demande." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que les donneurs d'ordre et rang 1 vous envoient en tant que fournisseur." },
        { title: "ISO 14001", desc: "Gardez votre système de management environnemental prêt pour l'audit, avec des preuves défendables." },
      ],
      outcomes: [
        { strong: "Restez qualifié", text: "sur les panels fournisseurs des donneurs d'ordre et de rang 1." },
        { strong: "Défendez chaque déclaration", text: "avec des preuves organisées et prêtes pour l'audit." },
        { strong: "Remportez le prochain appel d'offres", text: "avec un profil RSE que vos concurrents ne peuvent pas égaler." },
        { strong: "Répondez aux questionnaires fournisseurs", text: "en quelques minutes, pas en semaines, depuis une source unique de vérité." },
        { strong: "Faites de votre rigueur de conformité", text: "une raison d'être retenu dès la conception." },
      ],
      proof: {
        quote:
          "Nous sommes ravis de notre collaboration avec Ditto et de l'implication de notre coach : vous nous avez permis d'avancer rapidement et structurellement sur notre feuille de route RSE ! Un beau mélange d'expertise et d'énergie joyeuse.",
        author: "Laurence Sauphanor, Directrice Développement Durable, Communication & Impact, Quito Aero",
        ctaLabel: "Voir les témoignages clients",
      },
      finalCta: {
        heading: "Faites de la conformité aéronautique votre prochain contrat gagné.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les exigences de vos donneurs d'ordre et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 6. Construction ----------------------------------------------------------
  construction: {
    en: {
      eyebrow: "For construction & building-materials companies",
      h1: "The sustainability & compliance platform for construction and building materials",
      subhead:
        "Sustainability is now scored in the bid. Ditto helps you prove your EcoVadis rating, embodied carbon and CBAM/EUDR readiness — and win more tenders.",
      context: [
        "In construction, sustainability is now written into the bid. Public procurement and major private clients score environmental performance alongside price; developers ask for embodied-carbon data on materials; and if you produce or import steel, cement or aluminium, carbon-border rules touch your costs. For anyone using timber, deforestation rules add another layer.",
        "The hard part is proving it across projects, sites and a long supplier base. Fall short and you're screened out of the tender; get it right and your credentials become a genuine differentiator on the shortlist.",
      ],
      howHelpsIntro:
        "What tenders and clients demand, managed in one place — with an expert coach and AI that drafts your responses.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating that wins points in public and private tenders, guided by an approved EcoVadis training partner." },
        { title: "Carbon & CDP", desc: "Measure embodied and value-chain emissions and give clients the carbon data they request." },
        { title: "CSRD / VSME", desc: "Meet EU sustainability reporting expectations, directly or as a supplier." },
        { title: "ISO 14001 & ISO 50001", desc: "Keep environmental and energy management audit-ready across sites." },
        { title: "CBAM", desc: "Get ahead of carbon-border reporting on steel, cement and aluminium." },
        { title: "EUDR", desc: "Prove deforestation-free sourcing on the timber and wood products you use." },
      ],
      outcomes: [
        { strong: "Win more tenders", text: "where ESG scoring decides the award." },
        { strong: "Answer client and public-procurement questionnaires in minutes", text: "from one source of truth." },
        { strong: "Show embodied-carbon data", text: "developers increasingly demand." },
        { strong: "Stay ahead of CBAM and EUDR", text: "instead of scrambling at the deadline." },
        { strong: "Keep every site audit-ready", text: "with organized ISO evidence." },
      ],
      proof: {
        heading: "Aico — building a strong CSR framework to aim for excellence.",
        body: "The building life-safety manufacturer used Ditto to structure a rigorous CSR framework and pursue top-tier ratings — showing how a construction-products company turns compliance into a mark of quality.",
        quote:
          "Thanks again- your platform really made the process much easier and helped us achieve this result. We especially valued Ditto's templates, the quality of support, the simplicity of reporting, and the clarity of the validation process.",
        author: "Daniel Rivers, Facilities & Compliance Lead, Aico",
        ctaLabel: "Read the Aico case study",
        caseStudySlug: "aico-building-a-strong-csr-framework-to-aim-for-excellence",
      },
      finalCta: {
        heading: "Turn construction compliance into more won bids.",
        body: "Book a free strategy call. We'll map what your tenders and clients require and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour la construction et les matériaux de construction",
      h1: "La plateforme durabilité & conformité pour la construction et les matériaux",
      subhead:
        "La durabilité est désormais notée dans l'appel d'offres. Ditto vous aide à prouver votre note EcoVadis, votre carbone incorporé et votre conformité CBAM/EUDR — et à gagner plus d'appels d'offres.",
      context: [
        "Dans la construction, la durabilité est désormais inscrite dans l'appel d'offres. La commande publique et les grands clients privés notent la performance environnementale au même titre que le prix ; les promoteurs réclament des données de carbone incorporé sur les matériaux ; et si vous produisez ou importez de l'acier, du ciment ou de l'aluminium, le mécanisme carbone aux frontières touche vos coûts. Pour quiconque utilise du bois, les règles sur la déforestation ajoutent une couche supplémentaire.",
        "Le plus dur, c'est de le prouver à travers les chantiers, les sites et une large base fournisseurs. À défaut, vous êtes écarté de l'appel d'offres ; bien géré, votre profil devient un vrai facteur de différenciation sur la short-list.",
      ],
      howHelpsIntro:
        "Ce que vos appels d'offres et vos clients exigent, géré au même endroit — avec un coach expert et une IA qui rédige vos réponses.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note qui gagne des points dans les appels d'offres publics et privés, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "Carbone & CDP", desc: "Mesurez le carbone incorporé et les émissions de votre chaîne de valeur et fournissez aux clients les données qu'ils demandent." },
        { title: "CSRD / VSME", desc: "Répondez aux attentes de reporting durabilité de l'UE, en direct ou en tant que fournisseur." },
        { title: "ISO 14001 & ISO 50001", desc: "Gardez le management environnemental et énergétique prêt pour l'audit sur l'ensemble des sites." },
        { title: "CBAM", desc: "Prenez de l'avance sur le reporting carbone aux frontières pour l'acier, le ciment et l'aluminium." },
        { title: "EUDR", desc: "Prouvez un approvisionnement zéro déforestation sur le bois et les produits ligneux que vous utilisez." },
      ],
      outcomes: [
        { strong: "Gagnez plus d'appels d'offres", text: "où la notation RSE décide de l'attribution." },
        { strong: "Répondez en minutes aux questionnaires des clients et de la commande publique", text: "depuis une source unique de vérité." },
        { strong: "Montrez les données de carbone incorporé", text: "de plus en plus exigées par les promoteurs." },
        { strong: "Gardez une longueur d'avance sur CBAM et EUDR", text: "au lieu de courir à l'échéance." },
        { strong: "Gardez chaque site prêt pour l'audit", text: "avec des preuves ISO organisées." },
      ],
      proof: {
        heading: "Aico — bâtir un cadre RSE solide pour viser l'excellence.",
        body: "Ce fabricant de solutions de sécurité incendie pour le bâtiment a utilisé Ditto pour structurer un cadre RSE rigoureux et viser les meilleures notes — montrant comment une entreprise de produits de construction transforme la conformité en gage de qualité.",
        quote:
          "Merci encore – votre plateforme a vraiment simplifié le processus et nous a permis d'atteindre ce résultat. Nous avons particulièrement apprécié les modèles proposés par Ditto, la qualité de l'accompagnement, la simplicité du reporting et la clarté du processus de validation.",
        author: "Daniel Rivers, Facilities & Compliance Lead, Aico",
        ctaLabel: "Lire le cas Aico",
        caseStudySlug: "aico-building-a-strong-csr-framework-to-aim-for-excellence",
      },
      finalCta: {
        heading: "Transformez la conformité construction en appels d'offres gagnés.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les exigences de vos appels d'offres et de vos clients et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 7. Retail ----------------------------------------------------------------
  retail: {
    en: {
      eyebrow: "For retail, wholesale & consumer-goods companies",
      h1: "The sustainability & compliance platform for retail and consumer goods",
      subhead:
        "Retailers and marketplaces won't stock what suppliers can't prove. Ditto helps consumer brands stay listed — EcoVadis, packaging, deforestation-free sourcing and carbon — and turn ESG into a selling point.",
      context: [
        "Retail and consumer-goods companies face ESG pressure from every side: retailers and marketplaces run supplier assessments, packaging and deforestation rules tighten, and consumers reward brands that can prove their claims. An EcoVadis rating, a packaging plan, deforestation-free sourcing and carbon data are becoming conditions of shelf space.",
        "The hard part is managing it across a wide product range and a long supplier base. Handled well, credible sustainability is exactly what keeps you listed and sets your brand apart.",
      ],
      howHelpsIntro:
        "Everything your retail partners assess, in one platform — with an expert coach and AI that pre-fills the questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating retailers and marketplaces expect in supplier assessments, guided by an approved EcoVadis training partner." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires your retail partners send you as a supplier, on the SME-ready standard." },
        { title: "PPWR (packaging)", desc: "Prepare for tightening packaging and EPR rules with supplier evidence in hand." },
        { title: "EUDR", desc: "Prove deforestation-free sourcing on commodities like leather, paper, cocoa and rubber." },
        { title: "Carbon & CDP", desc: "Measure product and value-chain emissions and disclose them credibly." },
        { title: "Responsible sourcing & due diligence", desc: "Run supplier due diligence to meet human-rights and CSDDD expectations." },
      ],
      outcomes: [
        { strong: "Keep your listings", text: "— clear retailer and marketplace supplier assessments." },
        { strong: "Turn ESG into a selling point", text: "consumers and buyers reward." },
        { strong: "Stay ahead of packaging and deforestation rules", text: "instead of scrambling." },
        { strong: "Answer buyer questionnaires in minutes", text: "from one source of truth." },
        { strong: "Prove your claims", text: "with data, not marketing." },
      ],
      proof: {
        heading: "Superga Beauty — structuring and promoting its CSR approach for sustainable leadership.",
        quote:
          "Ditto is the all-in-one tool that lets us turn our CSR compliance into a competitive advantage.",
        author: "Sophie Wardan, Group CSR Manager, Superga Beauty",
        ctaLabel: "Read the Superga Beauty case study",
        caseStudySlug: "superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership",
      },
      finalCta: {
        heading: "Turn retail compliance into a competitive advantage.",
        body: "Book a free strategy call. We'll map what your retail partners require and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour la distribution, le négoce et les biens de consommation",
      h1: "La plateforme durabilité & conformité pour la distribution et les biens de consommation",
      subhead:
        "Les distributeurs et les marketplaces ne référencent pas ce que les fournisseurs ne peuvent pas prouver. Ditto aide les marques à rester référencées — EcoVadis, emballages, approvisionnement zéro déforestation et carbone — et à faire de la RSE un argument de vente.",
      context: [
        "Les entreprises de la distribution et des biens de consommation subissent une pression RSE de toutes parts : les distributeurs et les marketplaces mènent des évaluations fournisseurs, les règles sur les emballages et la déforestation se durcissent, et les consommateurs récompensent les marques capables de prouver leurs allégations. Une note EcoVadis, un plan d'emballage, un approvisionnement zéro déforestation et des données carbone deviennent des conditions d'accès au linéaire.",
        "Le plus dur, c'est de gérer tout cela sur une large gamme de produits et une longue base fournisseurs. Bien menée, une durabilité crédible est exactement ce qui vous garde référencé et distingue votre marque.",
      ],
      howHelpsIntro:
        "Tout ce que vos partenaires distributeurs évaluent, dans une seule plateforme — avec un coach expert et une IA qui pré-remplit les questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note attendue par les distributeurs et les marketplaces dans leurs évaluations fournisseurs, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que vos partenaires distributeurs vous envoient en tant que fournisseur, sur le standard adapté aux PME." },
        { title: "PPWR (emballages)", desc: "Préparez-vous au durcissement des règles sur les emballages et la REP, preuves fournisseurs en main." },
        { title: "EUDR", desc: "Prouvez un approvisionnement zéro déforestation sur des matières comme le cuir, le papier, le cacao et le caoutchouc." },
        { title: "Carbone & CDP", desc: "Mesurez les émissions produit et de chaîne de valeur et publiez-les de façon crédible." },
        { title: "Achats responsables & devoir de vigilance", desc: "Menez le devoir de vigilance fournisseurs pour répondre aux attentes en matière de droits humains et de CSDDD." },
      ],
      outcomes: [
        { strong: "Gardez vos référencements", text: "— passez les évaluations fournisseurs des distributeurs et des marketplaces." },
        { strong: "Faites de la RSE un argument de vente", text: "que consommateurs et acheteurs récompensent." },
        { strong: "Gardez une longueur d'avance sur les règles emballages et déforestation", text: "au lieu de courir après les délais." },
        { strong: "Répondez aux questionnaires acheteurs en minutes", text: "depuis une source unique de vérité." },
        { strong: "Prouvez vos allégations", text: "avec des données, pas du marketing." },
      ],
      proof: {
        heading: "Superga Beauty — structurer et valoriser sa démarche RSE pour un leadership durable.",
        quote:
          "Ditto est l'outil tout-en-un qui nous permet de transformer notre conformité RSE en avantage concurrentiel.",
        author: "Sophie Wardan, Responsable RSE Groupe, Superga Beauty",
        ctaLabel: "Lire le cas Superga Beauty",
        caseStudySlug: "superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership",
      },
      finalCta: {
        heading: "Faites de la conformité retail un avantage concurrentiel.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les exigences de vos partenaires distributeurs et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },

  // 8. Cosmetics & Beauty ----------------------------------------------------
  "cosmetics-beauty": {
    en: {
      eyebrow: "For cosmetics & beauty brands and suppliers",
      h1: "The sustainability & compliance platform for cosmetics and beauty",
      subhead:
        "Retailers, marketplaces and regulators all want proof before your products reach the shelf. Ditto helps beauty brands stay listed and stay compliant: EcoVadis, ingredient and packaging rules, responsible sourcing, and carbon, with an expert coach built in.",
      context: [
        "Cosmetics and beauty companies answer to everyone at once. Retailers and marketplaces run supplier assessments, the EU Cosmetics Regulation governs every ingredient and claim, packaging and deforestation rules keep tightening, and shoppers reward brands that can back up 'clean', 'natural' and 'cruelty-free'. An EcoVadis rating, safe and compliant formulas, recyclable packaging and carbon data are becoming conditions of shelf space.",
        "The hard part is holding it together across a fast-moving range, a long ingredient list and a global supplier base. Done well, credible sustainability is exactly what keeps you listed, keeps regulators satisfied, and sets your brand apart.",
      ],
      howHelpsIntro:
        "Everything your retail partners and regulators check, in one platform, with an expert coach and AI that pre-fills the questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Earn the rating retailers and marketplaces expect in supplier assessments, guided by an approved EcoVadis training partner." },
        { title: "CSRD / VSME", desc: "Answer the sustainability questionnaires your retail and distribution partners send you as a supplier, on the SME-ready standard." },
        { title: "EU Cosmetics Regulation & ingredients", desc: "Keep formula, safety and ingredient-restriction records (REACH, allergens, microplastics) consistent and ready the moment a buyer or authority asks." },
        { title: "PPWR (packaging)", desc: "Prepare for tightening packaging and EPR rules on bottles, jars and cartons with supplier evidence in hand." },
        { title: "Green claims & responsible sourcing", desc: "Back your 'natural', 'clean' and 'cruelty-free' claims with evidence, and run due diligence on ingredients like palm oil and mica to meet EUDR and CSDDD expectations." },
        { title: "Carbon & CDP", desc: "Measure product and value-chain emissions and disclose them credibly when a major account requests one." },
      ],
      outcomes: [
        { strong: "Keep your listings", text: "by clearing retailer and marketplace supplier assessments." },
        { strong: "Turn ESG into a selling point", text: "that shoppers and buyers reward." },
        { strong: "Stay ahead of ingredient, packaging and claims rules", text: "instead of scrambling." },
        { strong: "Answer buyer questionnaires in minutes", text: "from one source of truth." },
        { strong: "Prove your claims", text: "with data, not marketing." },
      ],
      proof: {
        heading: "Superga Beauty: structuring and promoting its CSR approach for sustainable leadership.",
        quote:
          "Ditto is the all-in-one tool that lets us turn our CSR compliance into a competitive advantage.",
        author: "Sophie Wardan, Group CSR Manager, Superga Beauty",
        ctaLabel: "Read the Superga Beauty case study",
        caseStudySlug: "superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership",
      },
      finalCta: {
        heading: "Turn beauty compliance into a competitive advantage.",
        body: "Book a free strategy call. We'll map what your retail partners and regulators require, and show you how Ditto gets you there faster.",
        button: "Book a demo",
      },
    },
    fr: {
      eyebrow: "Pour les marques et fournisseurs de cosmétiques et de beauté",
      h1: "La plateforme durabilité & conformité pour les cosmétiques et la beauté",
      subhead:
        "Distributeurs, marketplaces et régulateurs veulent tous des preuves avant que vos produits n'atteignent le linéaire. Ditto aide les marques de beauté à rester référencées et conformes : EcoVadis, règles sur les ingrédients et les emballages, achats responsables et carbone, avec un coach expert intégré.",
      context: [
        "Les entreprises des cosmétiques et de la beauté rendent des comptes à tout le monde en même temps. Les distributeurs et les marketplaces mènent des évaluations fournisseurs, le règlement européen sur les cosmétiques encadre chaque ingrédient et chaque allégation, les règles sur les emballages et la déforestation se durcissent, et les consommateurs récompensent les marques capables de justifier « clean », « naturel » et « non testé sur les animaux ». Une note EcoVadis, des formules sûres et conformes, des emballages recyclables et des données carbone deviennent des conditions d'accès au linéaire.",
        "Le plus dur, c'est de tout tenir ensemble sur une gamme qui évolue vite, une longue liste d'ingrédients et une base fournisseurs mondiale. Bien menée, une durabilité crédible est exactement ce qui vous garde référencé, satisfait les régulateurs et distingue votre marque.",
      ],
      howHelpsIntro:
        "Tout ce que vos partenaires distributeurs et les régulateurs vérifient, dans une seule plateforme, avec un coach expert et une IA qui pré-remplit les questionnaires.",
      frameworks: [
        { title: "EcoVadis", desc: "Décrochez la note attendue par les distributeurs et les marketplaces dans leurs évaluations fournisseurs, guidé par un partenaire de formation agréé EcoVadis." },
        { title: "CSRD / VSME", desc: "Répondez aux questionnaires durabilité que vos partenaires distributeurs vous envoient en tant que fournisseur, sur le standard adapté aux PME." },
        { title: "Règlement Cosmétiques & ingrédients", desc: "Gardez vos dossiers formule, sécurité et restrictions d'ingrédients (REACH, allergènes, microplastiques) cohérents et prêts dès qu'un acheteur ou une autorité les demande." },
        { title: "PPWR (emballages)", desc: "Préparez-vous au durcissement des règles sur les emballages et la REP pour les flacons, pots et étuis, preuves fournisseurs en main." },
        { title: "Allégations vertes & achats responsables", desc: "Justifiez vos allégations « naturel », « clean » et « non testé sur les animaux » avec des preuves, et menez le devoir de vigilance sur des ingrédients comme l'huile de palme et le mica pour répondre aux attentes EUDR et CSDDD." },
        { title: "Carbone & CDP", desc: "Mesurez les émissions produit et de chaîne de valeur et publiez-les de façon crédible quand un grand compte le demande." },
      ],
      outcomes: [
        { strong: "Gardez vos référencements", text: "en passant les évaluations fournisseurs des distributeurs et des marketplaces." },
        { strong: "Faites de la RSE un argument de vente", text: "que consommateurs et acheteurs récompensent." },
        { strong: "Gardez une longueur d'avance sur les règles ingrédients, emballages et allégations", text: "au lieu de courir après les délais." },
        { strong: "Répondez aux questionnaires acheteurs en minutes", text: "depuis une source unique de vérité." },
        { strong: "Prouvez vos allégations", text: "avec des données, pas du marketing." },
      ],
      proof: {
        heading: "Superga Beauty : structurer et valoriser sa démarche RSE pour un leadership durable.",
        quote:
          "Ditto est l'outil tout-en-un qui nous permet de transformer notre conformité RSE en avantage concurrentiel.",
        author: "Sophie Wardan, Responsable RSE Groupe, Superga Beauty",
        ctaLabel: "Lire le cas Superga Beauty",
        caseStudySlug: "superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership",
      },
      finalCta: {
        heading: "Faites de la conformité beauté un avantage concurrentiel.",
        body: "Réservez un appel stratégique gratuit. Nous cartographions les exigences de vos partenaires distributeurs et des régulateurs, et vous montrons comment Ditto vous y amène plus vite.",
        button: "Réserver une démo",
      },
    },
  },
};

export function getIndustryContent(
  slug: string,
  locale: string,
): IndustryContentLocale | undefined {
  const entry = INDUSTRY_CONTENT[slug];
  if (!entry) return undefined;
  return locale === "fr" ? entry.fr : entry.en;
}
