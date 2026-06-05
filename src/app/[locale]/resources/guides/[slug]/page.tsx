import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarI18n";
import { Footer } from "../../../../../components/FooterI18n";
import { SectionBreadcrumbs } from "../../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../webflow/devlinkScope";
import { getGuideBySlug } from "../../../../../lib/cms";
import { localizedHref } from "../../../../../lib/localized-paths";

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const item = await getGuideBySlug(slug, locale as "en" | "fr");
  if (!item) notFound();

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs: Resources > Guides > Guide title */}
        <SectionBreadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text="Guides"
          item2Item2Link={{ href: localizedHref("/resources/guides", locale) }}
          item3Item3Visibility={true}
          item3Item3Text={item.name}
          item3Item3Link={{ href: `${prefix}/resources/guides/${slug}` }}
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
                    {item.author && (
                      <>
                        <div className="spacer-1x5rem" />
                        <div className="profile_wrapper">
                          {item.author.picture_url && (
                            <div className="profile_image">
                              <img width={48} height={48} alt="" loading="lazy" src={item.author.picture_url} className="media-full-size" />
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
                    {item.document_url && (
                      <>
                        <div className="spacer-1x5rem" />
                        <a
                          href={item.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          data-wf--button--variant="secondary"
                          className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block"
                        >
                          <div>{locale === "fr" ? "Télécharger" : "Download"}</div>
                        </a>
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
                      {item.form ? (
                        <div className="post_sidebar_cta">
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: item.form }} />
                        </div>
                      ) : (
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
                      )}
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
