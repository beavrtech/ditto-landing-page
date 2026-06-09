import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarServer";
import { Footer } from "../../../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../webflow/devlinkScope";
import { getBlogPostBySlug, getBlogPosts, getGuideByFrameworkId, getFeaturedGuide } from "../../../../../lib/cms";
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
  const item = await getBlogPostBySlug(slug, locale as "en" | "fr");
  if (!item) return {};
  const enSlug = item.slug;
  const frSlug = item.slug_fr || item.slug;
  return {
    title: item.seo_title || item.name,
    description: item.seo_meta_desc || item.description || undefined,
    alternates: {
      canonical: locale === "fr"
        ? `https://www.trustditto.com/fr/ressources/blog/${frSlug}`
        : `https://www.trustditto.com/en/resources/blog/${enSlug}`,
      languages: {
        "x-default": `https://www.trustditto.com/en/resources/blog/${enSlug}`,
        en: `https://www.trustditto.com/en/resources/blog/${enSlug}`,
        fr: `https://www.trustditto.com/fr/ressources/blog/${frSlug}`,
      },
    },
    openGraph: {
      title: item.seo_title || item.name,
      description: item.seo_meta_desc || item.description || undefined,
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts("en").catch(() => []);
  const params: { locale: string; slug: string }[] = [];
  for (const post of posts || []) {
    params.push({ locale: "en", slug: post.slug });
    if (post.slug_fr) params.push({ locale: "fr", slug: post.slug_fr });
  }
  return params;
}

export const revalidate = 3600;

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const item = await getBlogPostBySlug(slug, locale as "en" | "fr");
  if (!item) notFound();

  let guide = item.category_id
    ? await getGuideByFrameworkId(item.category_id, locale as "en" | "fr").catch(() => null)
    : null;
  if (!guide) {
    guide = await getFeaturedGuide(locale as "en" | "fr").catch(() => null);
  }

  const categoryLabel = item.category?.name ?? null;
  const bodyHtml = item.body ? injectHeadingIds(transformRichText(item.body)) : "";

  return (
    <div className="page-wrapper">
      <JsonLd data={articleJsonLd({
        title: item.name,
        description: item.description,
        url: `https://www.trustditto.com/${locale}/resources/blog/${slug}`,
        imageUrl: item.banner_url,
        datePublished: item.date_de_publication,
        authorName: item.author?.name,
      })} />
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs: Resources > Blog > Article title */}
        <SectionBreadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text="Blog"
          item2Item2Link={{ href: localizedHref("/resources/blog", locale) }}
          item3Item3Visibility={true}
          item3Item3Text={item.name}
          item3Item3Link={{ href: `${prefix}/resources/blog/${slug}` }}
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
