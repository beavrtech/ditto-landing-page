import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarServer";
import { Footer } from "../../../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../webflow/devlinkScope";
import { getNewsItemBySlug, getNews, getFeaturedGuide } from "../../../../../lib/cms";
import { ArticleSidebar, injectHeadingIds } from "../../../../../components/ArticleSidebar";
import { localizedHref } from "../../../../../lib/localized-paths";
import { transformRichText } from "../../../../../lib/rich-text";
import { JsonLd, articleJsonLd } from "../../../../../components/JsonLd";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getNewsItemBySlug(slug, locale as "en" | "fr");
  if (!item) return {};
  const enSlug = item.slug;
  const frSlug = item.slug_fr || item.slug;
  return {
    title: item.seo_title || item.name,
    description: item.seo_meta_desc || item.description || undefined,
    alternates: {
      canonical: locale === "fr"
        ? `https://www.trustditto.com/fr/ressources/news/${frSlug}`
        : `https://www.trustditto.com/en/resources/news/${enSlug}`,
      languages: {
        "x-default": `https://www.trustditto.com/en/resources/news/${enSlug}`,
        en: `https://www.trustditto.com/en/resources/news/${enSlug}`,
        fr: `https://www.trustditto.com/fr/ressources/news/${frSlug}`,
      },
    },
  };
}

export async function generateStaticParams() {
  const items = await getNews("en").catch(() => []);
  const params: { locale: string; slug: string }[] = [];
  for (const item of items || []) {
    params.push({ locale: "en", slug: item.slug });
    if (item.slug_fr) params.push({ locale: "fr", slug: item.slug_fr });
  }
  return params;
}

export const revalidate = 3600;

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const item = await getNewsItemBySlug(slug, locale as "en" | "fr");
  if (!item) notFound();

  const bodyHtml = item.body ? injectHeadingIds(transformRichText(item.body)) : "";
  const guide = await getFeaturedGuide(locale as "en" | "fr").catch(() => null);

  // Author can be a reference object or inline fields
  const authorObj = item.author;
  const authorName = authorObj?.name ?? (item as any).author_name ?? null;
  const authorSlug = authorObj?.slug ?? null;
  const authorPicture = authorObj?.picture_url ?? null;
  const authorJobTitle = authorObj?.job_title ?? null;
  const authorJobTitleFr = authorObj?.job_title_fr ?? null;

  return (
    <div className="page-wrapper">
      <JsonLd data={articleJsonLd({
        title: item.name,
        description: item.description,
        url: `https://www.trustditto.com/${locale}/resources/news/${slug}`,
        imageUrl: item.banner_url,
        datePublished: item.published_date,
        authorName: item.author?.name,
      })} />
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs: Resources > News > Article title */}
        <SectionBreadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text={locale === "fr" ? "Actualités" : "News"}
          item2Item2Link={{ href: localizedHref("/resources/news", locale) }}
          item3Item3Visibility={true}
          item3Item3Text={item.name}
          item3Item3Link={{ href: `${prefix}/resources/news/${slug}` }}
        />

        {/* Hero */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="post-hero_section">
            <div className="padding-global">
              <div className="hide-tablet">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
              <div className="container-84rem">
                <div className="post-hero_component">
                  <div className="post-hero_content">
                    <h1 className="heading-size-3rem">{item.name}</h1>
                    {item.description && (
                      <>
                        <div className="spacer-1x5rem" />
                        <p className="text-size-1x375rem">{item.description}</p>
                      </>
                    )}
                    {authorName && (
                      <>
                        <div className="spacer-1x5rem" />
                        <div className="profile_wrapper">
                          {authorPicture && (
                            <div className="profile_image">
                              <Image width={48} height={48} alt="" src={authorPicture} className="media-full-size" />
                            </div>
                          )}
                          <div className="profile_content">
                            {authorSlug ? (
                              <a href={`${prefix}/authors/${authorSlug}`} className="text-size-1rem text-weight-400 link-hover-parent">{authorName}</a>
                            ) : (
                              <p className="text-size-1rem text-weight-400">{authorName}</p>
                            )}
                            {authorJobTitle && (
                              <>
                                <div className="spacer-0x25rem" />
                                <p className="text-size-0x875rem text-color-neutral">{locale === "fr" ? authorJobTitleFr || authorJobTitle : authorJobTitle}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  {item.banner_url && (
                    <div className="post-hero_banner_wrapper">
                      <Image src={item.banner_url} alt={item.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" />
                    </div>
                  )}
                </div>
              </div>
              <div className="show-tablet">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
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
                <div className="container-84rem">
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

        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
