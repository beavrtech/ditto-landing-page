import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarServer";
import { Footer } from "../../../../../components/FooterServer";
import { ArticleSidebar, injectHeadingIds } from "../../../../../components/ArticleSidebar";
import { Breadcrumbs } from "../../../../../components/BreadcrumbsWithSchema";
import { SectionCta } from "../../../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../devlink/devlinkScope";
import { getCollectionItemBySlug, getCollectionItems, getCategoryTranslations, getGuideByFrameworkId, getFeaturedGuide } from "../../../../../lib/cms";
import { localizedHref } from "../../../../../lib/localized-paths";
import { transformRichText } from "../../../../../lib/rich-text";
import { JsonLd, articleJsonLd } from "../../../../../components/JsonLd";
import { ExploreArticlesSection } from "../../../../../components/ExploreArticlesSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; framework: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, framework, slug } = await params;
  const item = await getCollectionItemBySlug(framework, slug, locale as "en" | "fr");
  if (!item) return {};
  const enSlug = item.slug;
  const frSlug = item.slug_fr || item.slug;

  // Collection is the canonical URL for articles (blog twins redirect here).
  const enUrl = `https://www.trustditto.com/en/collection/${framework}/${enSlug}`;
  const frUrl = `https://www.trustditto.com/fr/collection/${framework}/${frSlug}`;

  return {
    title: item.seo_title || item.name,
    description: item.seo_meta_desc || item.description || undefined,
    alternates: {
      canonical: locale === "fr" ? frUrl : enUrl,
      languages: {
        "x-default": enUrl,
        en: enUrl,
        fr: frUrl,
      },
    },
    openGraph: {
      title: item.seo_title || item.name,
      description: item.seo_meta_desc || item.description || undefined,
      ...(item.banner_url && { images: [{ url: item.banner_url }] }),
      url: `https://www.trustditto.com/${locale}/collection/${framework}/${slug}`,
    },
  };
}

const FRAMEWORK_TITLES: Record<string, string> = {
  ecovadis: "EcoVadis",
  cdp: "CDP",
  vsme: "VSME",
  "iso-14001": "ISO 14001",
  csrd: "CSRD",
};


export async function generateStaticParams() {
  const frameworks = ["ecovadis", "cdp", "csrd", "iso-14001", "vsme"];
  const params: { locale: string; framework: string; slug: string }[] = [];
  for (const fw of frameworks) {
    const items = await getCollectionItems(fw, "en").catch(() => []);
    for (const item of items || []) {
      params.push({ locale: "en", framework: fw, slug: item.slug });
      if (item.slug_fr) params.push({ locale: "fr", framework: fw, slug: item.slug_fr });
    }
  }
  return params;
}

export const revalidate = 3600;

export default async function CollectionArticlePage({
  params,
}: {
  params: Promise<{ locale: string; framework: string; slug: string }>;
}) {
  const { locale, framework, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const fwTitle = FRAMEWORK_TITLES[framework];
  if (!fwTitle) notFound();

  const [item, catTranslations] = await Promise.all([
    getCollectionItemBySlug(framework, slug, locale as "en" | "fr"),
    getCategoryTranslations(),
  ]);
  if (!item) notFound();

  // Fetch related guide for sidebar (fallback to featured guide)
  let guide = item.framework_id
    ? await getGuideByFrameworkId(item.framework_id, locale as "en" | "fr").catch(() => null)
    : null;
  if (!guide) {
    guide = await getFeaturedGuide(locale as "en" | "fr").catch(() => null);
  }

  const categoryLabel = item.categorie
    ? (locale === "fr" ? catTranslations[item.categorie] || item.categorie : item.categorie)
    : null;

  // Inject heading IDs into body for TOC links
  const bodyHtml = item.body ? injectHeadingIds(transformRichText(item.body, locale)) : "";

  return (
    <div className="page-wrapper">
      <JsonLd data={articleJsonLd({
        title: item.name,
        description: item.description,
        url: `https://www.trustditto.com/${locale}/collection/${framework}/${slug}`,
        imageUrl: item.banner_url,
        datePublished: item.date_de_publication,
        authorName: item.author?.name,
      })} />
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs: Resources > EcoVadis > Article */}
        <Breadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text={fwTitle}
          item2Item2Link={{ href: `${prefix}/collection/${framework}` }}
          item3Item3Visibility={true}
          item3Item3Text={item.name}
          item3Item3Link={{ href: `${prefix}/collection/${framework}/${slug}` }}
        />

        {/* Hero */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="post-hero_section">
            <div className="padding-global">
              <div className="hide-tablet">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
              <div className="container-80rem">
                <div className="post-hero_component">
                  <div className="post-hero_content">
                    {categoryLabel && (
                      <>
                        <p className="label">{categoryLabel}</p>
                        <div className="spacer-1x5rem" />
                      </>
                    )}
                    <h1 className="heading-size-3rem">{item.name}</h1>
                    {item.description && (
                      <>
                        <div className="spacer-1x5rem" />
                        <p className="text-size-1x375rem">{item.description}</p>
                      </>
                    )}
                    {item.author && (
                      <>
                        <div className="spacer-1x5rem" />
                        <div className="profile_wrapper">
                          {item.author.picture_url && (
                            <div className="profile_image">
                              <Image width={48} height={48} alt="" src={item.author.picture_url} className="media-full-size" />
                            </div>
                          )}
                          <div className="profile_content">
                            <a href={`${prefix}/authors/${item.author.slug}`} className="text-size-1rem text-weight-400 link-hover-parent">{item.author.name}</a>
                            {item.author.job_title && (
                              <>
                                <div className="spacer-0x25rem" />
                                <p className="text-size-0x875rem text-color-neutral">{locale === "fr" ? item.author.job_title_fr || item.author.job_title : item.author.job_title}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {item.banner_url && (
                    <div className="post-hero_banner_wrapper">
                      <Image src={item.banner_url} alt={item.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" priority />
                    </div>
                  )}
                </div>
              </div>
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
            </div>
            <div className="layer-4">
              <div className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" data-wf--background--color="secondary" />
            </div>
          </section>
        </div>

        {/* Article body + sidebar */}
        {bodyHtml && (
          <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
            <section className="post_section">
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-80rem">
                  <div className="post_grid">
                    <div className="post_main">
                      <div className="post_content">
                        <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                      </div>
                    </div>
                    <ArticleSidebar body={bodyHtml} guide={guide} locale={locale} />
                  </div>
                </div>
                <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
              </div>
              <div className="layer-4">
                <div className="background" data-wf--background--color="primary" />
              </div>
            </section>
          </div>
        )}

        {/* Explore [Framework] articles */}
        <ExploreArticlesSection framework={framework} locale={locale} />

        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: localizedHref("/demo", locale) }}
        />

        <Footer />
      </main>
    </div>
  );
}
