import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";
import Block from "../../devlink/modules/Basic/components/Block";
import Heading from "../../devlink/modules/Basic/components/Heading";
import Image from "../../devlink/modules/Basic/components/Image";
import Section from "../../devlink/modules/Layout/components/Section";
import { Background } from "../../devlink/Background";
import { ElementCollectionArticleLink } from "../../devlink/elements/ElementCollectionArticleLink";
import { Label } from "../../devlink/elements/Label";
import { Padding } from "../../devlink/Padding";
import { getCollectionItems, getCategoryTranslations } from "../lib/cms";
import { localizedHref, collectionPath } from "../lib/localized-paths";

/**
 * Resolves an article's `categorie` value to its display label.
 *
 * For frameworks with a curated `categories` list, `categorie` is a slug that
 * maps to a hardcoded EN/FR heading. For legacy frameworks it is the full
 * category string, optionally translated to FR via `category_translations`.
 */
export function categoryLabelFor(
  framework: string,
  categorie: string,
  locale: "en" | "fr",
  catTranslations: Record<string, string>
): string {
  const def = FRAMEWORK_CONFIG[framework]?.categories.find((c) => c.name === categorie);
  if (def) {
    return locale === "fr" ? catTranslations[def.name] || def.heading.fr : def.heading.en;
  }
  return locale === "fr" ? catTranslations[categorie] || categorie : categorie;
}

type CategoryDef = {
  name: string;
  icon: string;
  heading: { en: string; fr: string };
};

// Default icon reused for categories that don't have a dedicated one
// (e.g. dynamically-appended CMS categories not covered by a config's
// curated `categories` list).
const DEFAULT_CATEGORY_ICON =
  "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png";

export const FRAMEWORK_CONFIG: Record<string, {
  title: string;
  heroTitle: { en: string; fr: string };
  heroDesc: { en: string; fr: string };
  // Optional SEO meta description override. Falls back to `heroDesc` when
  // absent (see generateMetadata in collection/[framework]/page.tsx) — used
  // when the on-page intro copy and the <meta description> need to differ.
  metaDescription?: { en: string; fr: string };
  heroImage: string;
  sectionTitle: { en: string; fr: string };
  categories: CategoryDef[];
}> = {
  ecovadis: {
    title: "EcoVadis",
    heroTitle: { en: "EcoVadis Resources", fr: "Ressources EcoVadis" },
    heroDesc: {
      en: "Achieving a strong EcoVadis score is not only about the actions you take, but about how effectively you structure and demonstrate them. This collection helps you understand the EcoVadis methodology and sustainably improve your score.",
      fr: "Obtenir un bon score EcoVadis ne dépend pas seulement des actions que vous menez, mais de la manière dont vous les structurez et les démontrez. Cette collection vous aide à comprendre la méthodologie EcoVadis et à améliorer durablement votre score.",
    },
    heroImage: "/images/ecovadis-hero_5.avif",
    sectionTitle: { en: "Explore EcoVadis articles", fr: "Explorez les articles EcoVadis" },
    categories: [
      { name: "Introduction to EcoVadis", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Introduction to EcoVadis", fr: "Introduction \u00e0 EcoVadis" } },
      { name: "Preparing for EcoVadis", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152c34ca7caf3a490b8_icon-1.png", heading: { en: "Preparing for a EcoVadis audit", fr: "Se pr\u00e9parer \u00e0 EcoVadis" } },
      { name: "Succeeding with EcoVadis", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cad37b73c312337f_icon-12.png", heading: { en: "Succeeding with EcoVadis", fr: "R\u00e9ussir EcoVadis" } },
      { name: "EcoVadis performance & results", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cf1d54d25b2a5ff2_icon-2.png", heading: { en: "EcoVadis performance & results", fr: "Performance & R\u00e9sultats EcoVadis" } },
      { name: "EcoVadis compared to other frameworks", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152405312512f5d8b66_icon-5.png", heading: { en: "EcoVadis compared to other frameworks", fr: "EcoVadis et les autres r\u00e9f\u00e9rentiels" } },
      { name: "EcoVadis by company size and industry", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1528594922b61752e25_icon-6.png", heading: { en: "EcoVadis by company size and industry", fr: "EcoVadis par taille et secteur d\u2019activit\u00e9" } },
      { name: "Additional EcoVadis resources", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Additional EcoVadis resources", fr: "Ressources compl\u00e9mentaires EcoVadis" } },
    ],
  },
  cdp: {
    title: "CDP",
    heroTitle: { en: "CDP Resources", fr: "Ressources CDP" },
    heroDesc: {
      en: "Master your CDP assessment with our dedicated resources. From questionnaire preparation to score optimization.",
      fr: "Maîtrisez votre évaluation CDP grâce à nos ressources dédiées. De la préparation du questionnaire à l'optimisation du score.",
    },
    heroImage: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/696fa42ad6c7fb668d42e911_cdp-hero.avif",
    sectionTitle: { en: "Explore CDP articles", fr: "Explorez les articles CDP" },
    categories: [
      { name: "Introduction to CDP", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Introduction to CDP", fr: "Introduction au CDP" } },
      { name: "Preparing for CDP", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152c34ca7caf3a490b8_icon-1.png", heading: { en: "Preparing for CDP", fr: "Se préparer au CDP" } },
      { name: "Succeeding with CDP", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cad37b73c312337f_icon-12.png", heading: { en: "Succeeding with CDP", fr: "Réussir avec le CDP" } },
      { name: "CDP performance & results", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cf1d54d25b2a5ff2_icon-2.png", heading: { en: "CDP performance & results", fr: "Performance et résultats CDP" } },
      { name: "CDP compared to other frameworks", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152405312512f5d8b66_icon-5.png", heading: { en: "CDP compared to other frameworks", fr: "CDP comparé aux autres référentiels" } },
      { name: "CDP by company size and industry", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1528594922b61752e25_icon-6.png", heading: { en: "CDP by company size and industry", fr: "CDP par taille d'entreprise et secteur" } },
      { name: "Additional CDP resources", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Additional CDP resources", fr: "Ressources CDP supplémentaires" } },
    ],
  },
  vsme: {
    title: "VSME",
    heroTitle: { en: "VSME Resources", fr: "Ressources VSME" },
    heroDesc: {
      en: "Structure your ESG reporting with the VSME standard. Resources for SMEs navigating European sustainability requirements.",
      fr: "Structurez votre reporting ESG avec le standard VSME. Ressources pour les PME face aux exigences européennes de durabilité.",
    },
    heroImage: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6a0b26331cfe4fd628ae2f4d_csrd-hero.webp",
    sectionTitle: { en: "Explore VSME articles", fr: "Explorez les articles VSME" },
    categories: [
      { name: "Introduction to VSME", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Introduction to VSME", fr: "Introduction au VSME" } },
      { name: "Preparing for VSME", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152c34ca7caf3a490b8_icon-1.png", heading: { en: "Preparing for VSME", fr: "Se préparer au VSME" } },
      { name: "Succeeding with VSME", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cad37b73c312337f_icon-12.png", heading: { en: "Succeeding with VSME", fr: "Réussir avec le VSME" } },
      { name: "VSME performance & results", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cf1d54d25b2a5ff2_icon-2.png", heading: { en: "VSME performance & results", fr: "Performance et résultats VSME" } },
      { name: "VSME compared to other frameworks", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152405312512f5d8b66_icon-5.png", heading: { en: "VSME compared to other frameworks", fr: "VSME comparé aux autres référentiels" } },
      { name: "VSME by company size and industry", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1528594922b61752e25_icon-6.png", heading: { en: "VSME by company size and industry", fr: "VSME par taille d'entreprise et secteur" } },
      { name: "Additional VSME resources", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Additional VSME resources", fr: "Ressources VSME supplémentaires" } },
    ],
  },
  "iso-14001": {
    title: "ISO 14001",
    heroTitle: { en: "ISO 14001 Resources", fr: "Ressources ISO 14001" },
    heroDesc: {
      en: "Build a robust environmental management system with ISO 14001.",
      fr: "Construisez un système de management environnemental robuste avec l'ISO 14001.",
    },
    heroImage: "",
    sectionTitle: { en: "Explore ISO 14001 articles", fr: "Explorez les articles ISO 14001" },
    categories: [],
  },
  csrd: {
    title: "CSRD",
    heroTitle: { en: "CSRD Resources", fr: "Ressources CSRD" },
    heroDesc: {
      en: "CSRD is more than producing a report: it's a process that shapes your entire sustainability strategy. This collection helps you understand the directive, the ESRS standards and double materiality, then build solid reporting, step by step — with the Ditto platform and an expert by your side.",
      fr: "La CSRD ne se résume pas à produire un rapport : c'est une démarche qui structure toute votre stratégie de durabilité. Cette collection vous aide à comprendre la directive, les normes ESRS et la double matérialité, puis à construire un reporting solide — avec la plateforme Ditto et un expert à vos côtés à chaque étape.",
    },
    metaDescription: {
      en: "Understand the CSRD directive, ESRS standards and double materiality, and structure your European sustainability reporting step by step, with Ditto's platform and expertise.",
      fr: "Comprenez la directive CSRD, les normes ESRS et la double matérialité, et structurez votre reporting de durabilité européen étape par étape, avec la plateforme et l'expertise Ditto.",
    },
    heroImage: "",
    sectionTitle: { en: "Explore CSRD articles", fr: "Explorez les articles CSRD" },
    // Category `name` matches the `categorie` string stored on CSRD
    // collection_items/guides in the CMS (see `category_translations`).
    // Order here drives the on-page section order; FR headings are
    // overridden by CMS translations when available (see categoryDefs
    // below), EN headings are hardcoded as the CMS category name itself.
    categories: [
      { name: "Understand CSRD", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Understand CSRD", fr: "Comprendre la CSRD" } },
      { name: "Master the ESRS standards", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152c34ca7caf3a490b8_icon-1.png", heading: { en: "Master the ESRS standards", fr: "Maîtriser les normes ESRS" } },
      { name: "Conduct double materiality", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cad37b73c312337f_icon-12.png", heading: { en: "Conduct double materiality", fr: "Réaliser sa double matérialité" } },
      { name: "Take action on CSRD", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cf1d54d25b2a5ff2_icon-2.png", heading: { en: "Take action on CSRD", fr: "Passer à l'action" } },
      { name: "Compare CSRD with other frameworks", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152405312512f5d8b66_icon-5.png", heading: { en: "Compare CSRD with other frameworks", fr: "Comparer la CSRD aux autres référentiels" } },
      { name: "Break down CSRD by size and industry", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1528594922b61752e25_icon-6.png", heading: { en: "Break down CSRD by size and industry", fr: "Décliner la CSRD par taille et secteur" } },
      { name: "Additional CSRD resources", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Additional CSRD resources", fr: "Aller plus loin" } },
    ],
  },
  carbon: {
    title: "Bilan Carbone",
    heroTitle: { en: "Carbon Footprint Resources", fr: "Ressources Bilan Carbone" },
    heroDesc: {
      en: "Measure, report and reduce your carbon footprint. Resources to help you build a carbon assessment (Bilan Carbone) and decarbonize across your value chain.",
      fr: "Mesurez, déclarez et réduisez votre empreinte carbone. Des ressources pour vous aider à réaliser votre bilan carbone et à décarboner toute votre chaîne de valeur.",
    },
    heroImage: "",
    sectionTitle: { en: "Explore Carbon articles", fr: "Explorez les articles Bilan Carbone" },
    // Category `name` is a stable slug tagged on each article's `categorie`
    // field in the CMS; the EN/FR headings are hardcoded here.
    categories: [
      { name: "understand", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c1520f8ba57b7a6b29c2_icon-4.png", heading: { en: "Understanding carbon accounting", fr: "Comprendre le bilan carbone" } },
      { name: "measure", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152c34ca7caf3a490b8_icon-1.png", heading: { en: "Measuring your carbon footprint", fr: "Mesurer son empreinte carbone" } },
      { name: "reduce", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cad37b73c312337f_icon-12.png", heading: { en: "Reducing emissions & carbon neutrality", fr: "Réduction des émissions et neutralité carbone" } },
      { name: "costs-tools", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152cf1d54d25b2a5ff2_icon-2.png", heading: { en: "Costs, tools & getting started", fr: "Coûts, outils et démarrage du bilan carbone" } },
      { name: "other-frameworks", icon: "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6887c152405312512f5d8b66_icon-5.png", heading: { en: "Carbon accounting & other frameworks", fr: "Bilan carbone et autres référentiels (EcoVadis, CDP)" } },
    ],
  },
  qhse: {
    title: "QHSE",
    heroTitle: { en: "QHSE Resources", fr: "Ressources QHSE" },
    heroDesc: {
      en: "Structure your Quality, Health, Safety and Environment (QHSE) management. Resources to help you build and improve your QHSE program.",
      fr: "Structurez votre démarche QHSE (Qualité, Hygiène, Sécurité, Environnement). Des ressources pour construire et améliorer votre système de management QHSE.",
    },
    heroImage: "",
    sectionTitle: { en: "Explore QHSE articles", fr: "Explorez les articles QHSE" },
    categories: [],
  },
};

/**
 * Server component that renders the "Explore [Framework] articles" section.
 * Used on both the framework listing page and individual article pages.
 */
export async function ExploreArticlesSection({
  framework,
  locale,
}: {
  framework: string;
  locale: string;
}) {
  const config = FRAMEWORK_CONFIG[framework];
  if (!config) return null;

  const [items, catTranslations] = await Promise.all([
    getCollectionItems(framework, locale as "en" | "fr"),
    getCategoryTranslations(),
  ]);

  // Group items by category
  const grouped: Record<string, any[]> = {};
  for (const item of items || []) {
    const cat = item.categorie || "Resources";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(item);
  }

  // Build category defs: use config for icons/order, translations from Supabase.
  // Any CMS category not covered by the curated `categories` list is appended
  // afterwards (in the order it appears from the CMS) rather than dropped, so
  // new/unlisted categories still render instead of silently disappearing.
  const knownNames = new Set(config.categories.map((c) => c.name));
  const curatedDefs = config.categories
    .filter((c) => grouped[c.name]?.length > 0)
    .map((c) => ({
      ...c,
      heading: {
        en: c.heading.en,
        fr: catTranslations[c.name] || c.heading.fr,
      },
    }));
  const extraDefs = Object.keys(grouped)
    .filter((name) => !knownNames.has(name))
    .map((name) => ({
      name,
      icon: DEFAULT_CATEGORY_ICON,
      heading: { en: name, fr: catTranslations[name] || name },
    }));
  const categoryDefs = [...curatedDefs, ...extraDefs];

  if (categoryDefs.length === 0) return null;

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
      <Section
        className={"collection_section"}
        grid={{ type: "section" }}
        tag={"section"}
      >
        <Block className={"padding-global"} tag={"div"}>
          <Padding space={"Medium (6rem)"} />
          <Block className={"container-70rem"} tag={"div"}>
            <Block className={"header"} tag={"div"}>
              <Label label={"Articles"} />
              <Block className={"spacer-1x5rem"} tag={"div"} />
              <Heading className={"heading-size-3rem"} tag={"h2"}>
                {locale === "fr" ? config.sectionTitle.fr : config.sectionTitle.en}
              </Heading>
            </Block>
            <Block className={"spacer-3rem"} tag={"div"} />
            <Block className={"collection_component"} tag={"div"}>
              {categoryDefs.map((cat) => (
                <Block key={cat.name} className={"collection_col"} tag={"div"}>
                  <Block className={"collection_col_header"} tag={"div"}>
                    <Image
                      alt={""}
                      height={"auto"}
                      loading={"lazy"}
                      src={cat.icon}
                      width={"40"}
                    />
                    <Heading className={"heading-size-1x75rem"} tag={"h3"}>
                      {locale === "fr" ? cat.heading.fr : cat.heading.en}
                    </Heading>
                  </Block>
                  <Block className={"spacer-1x5rem"} tag={"div"} />
                  {(grouped[cat.name] || []).map((item: any) => {
                    const slug = locale === "fr" && item.slug_fr ? item.slug_fr : item.slug;
                    const href = item._type === "guide"
                      ? localizedHref(`/resources/guides/${slug}`, locale)
                      : collectionPath(framework, locale, slug);
                    return (
                      <ElementCollectionArticleLink
                        key={item.slug}
                        text={item.name}
                        link={{ href }}
                      />
                    );
                  })}
                </Block>
              ))}
            </Block>
          </Block>
          <Padding space={"Medium (6rem)"} />
        </Block>
        <Block className={"layer-4"} tag={"div"}>
          <Background color={"Tertiary"} />
        </Block>
      </Section>
    </div>
  );
}
