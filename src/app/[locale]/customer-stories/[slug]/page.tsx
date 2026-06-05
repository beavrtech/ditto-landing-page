import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarI18n";
import { Footer } from "../../../../components/FooterI18n";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../webflow/devlinkScope";
import { getCustomerStoryBySlug } from "../../../../lib/cms";

export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const story = await getCustomerStoryBySlug(slug, locale as "en" | "fr");

  if (!story) {
    notFound();
  }

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs */}
        <SectionBreadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Témoignages clients" : "Customer stories"}
          item1Item1Link={{ href: `${prefix}/customer-stories` }}
          item2Item2Visibility={true}
          item2Item2Text={story.name}
          item2Item2Link={{ href: `${prefix}/customer-stories/${slug}` }}
          item3Item3Visibility={false}
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
                    {story.industry?.name_en && (
                      <>
                        <p className="label">{locale === "fr" ? story.industry.name_fr || story.industry.name_en : story.industry.name_en}</p>
                        <div className="spacer-1x5rem" />
                      </>
                    )}
                    <h1 className="heading-size-3rem">{story.name}</h1>
                    <div className="spacer-1x5rem" />
                    <p className="text-size-1x375rem">{story.description}</p>
                  </div>
                  {story.banner_url && (
                    <div className="post-hero_banner_wrapper">
                      <img src={story.banner_url} loading="lazy" alt="" className="media-full-size" />
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

        {/* Intro cards: About / Challenges / Impact */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="stories-intro_section">
            <div className="padding-global">
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
              <div className="container-84rem">
                <div className="customer-intro_component">
                  {/* About card */}
                  <div className="customer-intro_card">
                    <h3 className="heading-size-2rem">{locale === "fr" ? "À propos" : "About"}</h3>
                    <div className="spacer-1x5rem spacer-mob-1rem" />
                    <div className="customer-intro_details_list">
                      {story.localisation && (
                        <div className="customer-intro_details_item">
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Localisation" : "Location"}</p>
                          <p className="text-size-1rem">{story.localisation}</p>
                        </div>
                      )}
                      {story.industry && (
                        <div className="customer-intro_details_item">
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Industrie" : "Industry"}</p>
                          <p className="text-size-1rem">{locale === "fr" ? story.industry.name_fr || story.industry.name_en : story.industry.name_en}</p>
                        </div>
                      )}
                      {story.team_size && (
                        <div className="customer-intro_details_item">
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Effectif" : "Size"}</p>
                          <p className="text-size-1rem">{story.team_size}</p>
                        </div>
                      )}
                      {story.score && (
                        <div className="customer-intro_details_item">
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Revenus" : "Revenue"}</p>
                          <p className="text-size-1rem">{story.score}</p>
                        </div>
                      )}
                      {story.frameworks && story.frameworks.length > 0 && (
                        <div className="customer-intro_details_item">
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Référentiels" : "Frameworks"}</p>
                          <p className="text-size-1rem">{story.frameworks.map((f: any) => f.name).join(", ")}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Challenges card */}
                  {story.challenge_summary && (
                    <div className="customer-intro_card">
                      <h3 className="heading-size-2rem">{locale === "fr" ? "Défis" : "Challenges"}</h3>
                      <div className="spacer-1x5rem spacer-mob-1rem" />
                      <div className="rich-text_bullet-list w-richtext" dangerouslySetInnerHTML={{ __html: story.challenge_summary }} />
                    </div>
                  )}

                  {/* Impact card */}
                  {story.impact_summary && (
                    <div className="customer-intro_card">
                      <h3 className="heading-size-2rem">Impact</h3>
                      <div className="spacer-1x5rem spacer-mob-1rem" />
                      <div className="rich-text_bullet-list w-richtext" dangerouslySetInnerHTML={{ __html: story.impact_summary }} />
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

        {/* Main content sections */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="post_section">
            <div className="padding-global">
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
              <div className="container-84rem">
                <div className="post_grid">
                  <div className="post_main">
                    <div className="post_content">
                      {/* Company / Presentation */}
                      {story.presentation && (
                        <div id="company" className="post_chapter">
                          <p className="label">{locale === "fr" ? "Entreprise" : "Company"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.presentation }} />
                        </div>
                      )}

                      {/* Quote 1 */}
                      {story.quote && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <div className="post_testimonial_content">
                              <p className="heading-size-2rem">{story.quote}</p>
                            </div>
                            {(story.quote_author || story.quote_author_role) && (
                              <>
                                <div className="spacer-1x5rem" />
                                <div className="profile_wrapper">
                                  {story.quote_author_picture_url && (
                                    <div className="profile_image">
                                      <img width={48} height={48} alt="" loading="lazy" src={story.quote_author_picture_url} className="media-full-size" />
                                    </div>
                                  )}
                                  <div className="profile_content">
                                    {story.quote_author && <h4 className="text-size-1rem text-weight-400">{story.quote_author}</h4>}
                                    {story.quote_author_role && (
                                      <>
                                        <div className="spacer-0x25rem" />
                                        <p className="text-size-0x875rem text-color-neutral">{story.quote_author_role}</p>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* CSR Context */}
                      {story.contexte_rse && (
                        <div className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">{locale === "fr" ? "Contexte RSE" : "CSR Context"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.contexte_rse }} />
                        </div>
                      )}

                      {/* Challenges */}
                      {story.challenges && (
                        <div id="challenge" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">{locale === "fr" ? "Défis" : "Challenges"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.challenges }} />
                        </div>
                      )}

                      {/* Solution */}
                      {story.solution && (
                        <div id="solution" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">Solution</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.solution }} />
                        </div>
                      )}

                      {/* Quote 2 */}
                      {story.quote_2 && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <div className="post_testimonial_content">
                              <p className="heading-size-2rem">{story.quote_2}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Impact */}
                      {story.impact && (
                        <div id="impact" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">Impact</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.impact }} />
                        </div>
                      )}

                      {/* Quote 3 */}
                      {story.quote_3 && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <div className="post_testimonial_content">
                              <p className="heading-size-2rem">{story.quote_3}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Ending / Conclusion */}
                      {story.ending && (
                        <div className="post_chapter">
                          <div className="spacer-2rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: story.ending }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
            </div>
            <div className="layer-4">
              <div className="background" data-wf--background--color="primary" />
            </div>
          </section>
        </div>

        {/* CTA */}
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
