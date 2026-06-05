import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarI18n";
import { Footer } from "../../../../../components/FooterI18n";
import { SectionBreadcrumbs } from "../../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../webflow/devlinkScope";
import { getNewsItemBySlug } from "../../../../../lib/cms";
import { localizedHref } from "../../../../../lib/localized-paths";

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

  // Author can be a reference object or inline fields
  const authorObj = item.author;
  const authorName = authorObj?.name ?? (item as any).author_name ?? null;
  const authorSlug = authorObj?.slug ?? null;
  const authorPicture = authorObj?.picture_url ?? null;
  const authorJobTitle = authorObj?.job_title ?? null;
  const authorJobTitleFr = authorObj?.job_title_fr ?? null;

  return (
    <div className="page-wrapper">
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
                              <img width={48} height={48} alt="" loading="lazy" src={authorPicture} className="media-full-size" />
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
                      <img src={item.banner_url} loading="lazy" alt="" className="media-full-size" />
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

        {/* Article body */}
        {item.body && (
          <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
            <section className="post_section">
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-84rem">
                  <div className="post_grid">
                    <div className="post_main">
                      <div className="post_content">
                        <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: item.body }} />
                      </div>
                    </div>
                    {/* Sidebar */}
                    <div className="post_sidebar">
                      <div className="post_sidebar_cta">
                        <p className="heading-size-1x375rem">
                          {locale === "fr"
                            ? "Conformité RSE : on vous accompagne (CSRD, EcoVadis, etc.) !"
                            : "CSR compliance: we'll guide you (CSRD, EcoVadis, etc.)!"}
                        </p>
                        <div className="spacer-0x75rem" />
                        <p className="text-size-1rem">
                          {locale === "fr"
                            ? "Avec Ditto, améliorez votre performance RSE et renforcez la confiance de vos partenaires."
                            : "With Ditto, improve your CSR performance and boost your partners' confidence."}
                        </p>
                        <div className="spacer-1x5rem" />
                        <a data-wf--button--variant="secondary" href={localizedHref("/get-started", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                          <div>{locale === "fr" ? "Contactez-nous" : "Contact Us"}</div>
                        </a>
                      </div>
                    </div>
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
