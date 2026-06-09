import { DEVLINK_SCOPE_CLASS } from "../../webflow/devlinkScope";
import Block from "../../webflow/webflow_modules/Basic/components/Block";
import Heading from "../../webflow/webflow_modules/Basic/components/Heading";
import Image from "../../webflow/webflow_modules/Basic/components/Image";
import Section from "../../webflow/webflow_modules/Layout/components/Section";
import { Background } from "../../webflow/Background";
import { ElementCollectionArticleLink } from "../../webflow/elements/ElementCollectionArticleLink";
import { Label } from "../../webflow/elements/Label";
import { Padding } from "../../webflow/Padding";
import { getCollectionItems, getCategoryTranslations } from "../lib/cms";
import { localizedHref } from "../lib/localized-paths";

type CategoryDef = {
  name: string;
  icon: string;
  heading: { en: string; fr: string };
};

export const FRAMEWORK_CONFIG: Record<string, {
  title: string;
  heroTitle: { en: string; fr: string };
  heroDesc: { en: string; fr: string };
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
      { name: "Introduction to EcoVadis", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Introduction to EcoVadis", fr: "Introduction \u00e0 EcoVadis" } },
      { name: "Preparing for EcoVadis", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152c34ca7caf3a490b8_Icon%201.png", heading: { en: "Preparing for a EcoVadis audit", fr: "Se pr\u00e9parer \u00e0 EcoVadis" } },
      { name: "Succeeding with EcoVadis", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cad37b73c312337f_Icon%2012.png", heading: { en: "Succeeding with EcoVadis", fr: "R\u00e9ussir EcoVadis" } },
      { name: "EcoVadis performance & results", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cf1d54d25b2a5ff2_Icon%202.png", heading: { en: "EcoVadis performance & results", fr: "Performance & R\u00e9sultats EcoVadis" } },
      { name: "EcoVadis compared to other frameworks", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152405312512f5d8b66_Icon%205.png", heading: { en: "EcoVadis compared to other frameworks", fr: "EcoVadis et les autres r\u00e9f\u00e9rentiels" } },
      { name: "EcoVadis by company size and industry", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1528594922b61752e25_Icon%206.png", heading: { en: "EcoVadis by company size and industry", fr: "EcoVadis par taille et secteur d\u2019activit\u00e9" } },
      { name: "Additional EcoVadis resources", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Additional EcoVadis resources", fr: "Ressources compl\u00e9mentaires EcoVadis" } },
    ],
  },
  cdp: {
    title: "CDP",
    heroTitle: { en: "CDP Resources", fr: "Ressources CDP" },
    heroDesc: {
      en: "Master your CDP assessment with our dedicated resources. From questionnaire preparation to score optimization.",
      fr: "Maîtrisez votre évaluation CDP grâce à nos ressources dédiées. De la préparation du questionnaire à l'optimisation du score.",
    },
    heroImage: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/696fa42ad6c7fb668d42e911_cdp-hero.avif",
    sectionTitle: { en: "Explore CDP articles", fr: "Explorez les articles CDP" },
    categories: [
      { name: "Introduction to CDP", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Introduction to CDP", fr: "Introduction au CDP" } },
      { name: "Preparing for CDP", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152c34ca7caf3a490b8_Icon%201.png", heading: { en: "Preparing for CDP", fr: "Se préparer au CDP" } },
      { name: "Succeeding with CDP", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cad37b73c312337f_Icon%2012.png", heading: { en: "Succeeding with CDP", fr: "Réussir avec le CDP" } },
      { name: "CDP performance & results", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cf1d54d25b2a5ff2_Icon%202.png", heading: { en: "CDP performance & results", fr: "Performance et résultats CDP" } },
      { name: "CDP compared to other frameworks", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152405312512f5d8b66_Icon%205.png", heading: { en: "CDP compared to other frameworks", fr: "CDP comparé aux autres référentiels" } },
      { name: "CDP by company size and industry", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1528594922b61752e25_Icon%206.png", heading: { en: "CDP by company size and industry", fr: "CDP par taille d'entreprise et secteur" } },
      { name: "Additional CDP resources", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Additional CDP resources", fr: "Ressources CDP supplémentaires" } },
    ],
  },
  vsme: {
    title: "VSME",
    heroTitle: { en: "VSME Resources", fr: "Ressources VSME" },
    heroDesc: {
      en: "Structure your ESG reporting with the VSME standard. Resources for SMEs navigating European sustainability requirements.",
      fr: "Structurez votre reporting ESG avec le standard VSME. Ressources pour les PME face aux exigences européennes de durabilité.",
    },
    heroImage: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6a0b26331cfe4fd628ae2f4d_csrd-hero.webp",
    sectionTitle: { en: "Explore VSME articles", fr: "Explorez les articles VSME" },
    categories: [
      { name: "Introduction to VSME", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Introduction to VSME", fr: "Introduction au VSME" } },
      { name: "Preparing for VSME", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152c34ca7caf3a490b8_Icon%201.png", heading: { en: "Preparing for VSME", fr: "Se préparer au VSME" } },
      { name: "Succeeding with VSME", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cad37b73c312337f_Icon%2012.png", heading: { en: "Succeeding with VSME", fr: "Réussir avec le VSME" } },
      { name: "VSME performance & results", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152cf1d54d25b2a5ff2_Icon%202.png", heading: { en: "VSME performance & results", fr: "Performance et résultats VSME" } },
      { name: "VSME compared to other frameworks", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c152405312512f5d8b66_Icon%205.png", heading: { en: "VSME compared to other frameworks", fr: "VSME comparé aux autres référentiels" } },
      { name: "VSME by company size and industry", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1528594922b61752e25_Icon%206.png", heading: { en: "VSME by company size and industry", fr: "VSME par taille d'entreprise et secteur" } },
      { name: "Additional VSME resources", icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png", heading: { en: "Additional VSME resources", fr: "Ressources VSME supplémentaires" } },
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
      en: "Simplify EU sustainability reporting with our CSRD resources.",
      fr: "Simplifiez votre reporting de durabilité européen avec nos ressources CSRD.",
    },
    heroImage: "",
    sectionTitle: { en: "Explore CSRD articles", fr: "Explorez les articles CSRD" },
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

  const prefix = `/${locale}`;

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

  // Build category defs: use config for icons/order, translations from Supabase
  const categoryDefs = config.categories.length > 0
    ? config.categories
        .filter((c) => grouped[c.name]?.length > 0)
        .map((c) => ({
          ...c,
          heading: {
            en: c.heading.en,
            fr: catTranslations[c.name] || c.heading.fr,
          },
        }))
    : Object.keys(grouped).map((name) => ({
        name,
        icon: "https://cdn.prod.website-files.com/682d7fad3c89203197a56faa/6887c1520f8ba57b7a6b29c2_Icon%204.png",
        heading: { en: name, fr: catTranslations[name] || name },
      }));

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
                      : `${prefix}/collection/${framework}/${slug}`;
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
