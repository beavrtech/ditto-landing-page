import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../devlink/devlinkScope";
import { getCustomerStoryBySlug, getCustomerStories } from "../../../../lib/cms";
import { localizedCmsHref, localizedHref } from "../../../../lib/localized-paths";
import { transformRichText, QUOTE_OPEN_SVG, QUOTE_CLOSE_SVG } from "../../../../lib/rich-text";


// Yellow quotation marks around customer story quotes (from the original
// design; rebuilt with spans so the markup is valid inside <p>)
function TestimonialQuote({ text }: { text: string }) {
  return (
    <div className="post_testimonial_content">
      <p className="heading-size-2rem display-inline">
        <span>{text}</span>
        <span className="post_testimonial_quote_bottom_span">
          <span className="post_testimonial_quote_bottom">
            <span className="icon w-embed" dangerouslySetInnerHTML={{ __html: QUOTE_CLOSE_SVG }} />
          </span>
        </span>
      </p>
      <div className="post_testimonial_quote_top">
        <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: QUOTE_OPEN_SVG }} />
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const story = await getCustomerStoryBySlug(slug, locale as "en" | "fr");
  if (!story) return {};
  const enSlug = story.slug;
  const frSlug = story.slug_fr || story.slug;
  return {
    title: story.seo_title || story.name,
    description: story.seo_meta_desc || story.description || undefined,
    alternates: {
      canonical: locale === "fr"
        ? `https://www.trustditto.com/fr/cas-clients/${frSlug}`
        : `https://www.trustditto.com/en/customer-stories/${enSlug}`,
      languages: {
        "x-default": `https://www.trustditto.com/en/customer-stories/${enSlug}`,
        en: `https://www.trustditto.com/en/customer-stories/${enSlug}`,
        fr: `https://www.trustditto.com/fr/cas-clients/${frSlug}`,
      },
    },
    openGraph: {
      title: story.seo_title || story.name,
      description: story.seo_meta_desc || story.description || undefined,
      ...(story.banner_url && { images: [{ url: story.banner_url }] }),
      url: locale === "fr" ? `https://www.trustditto.com/fr/cas-clients/${slug}` : `https://www.trustditto.com/en/customer-stories/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  const stories = await getCustomerStories("en").catch(() => []);
  const params: { locale: string; slug: string }[] = [];
  for (const story of stories || []) {
    params.push({ locale: "en", slug: story.slug });
    if (story.slug_fr) params.push({ locale: "fr", slug: story.slug_fr });
  }
  return params;
}

export const revalidate = 3600;

export default async function CustomerStoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const story = await getCustomerStoryBySlug(slug, locale as "en" | "fr");

  if (!story) {
    notFound();
  }

  const enSlug = story.slug;
  const frSlug = story.slug_fr || story.slug;

  const alternateUrls = {
    en: `/en/customer-stories/${enSlug}`,
    fr: `/fr/cas-clients/${frSlug}`,
  };

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar alternateUrls={alternateUrls} />

        {/* Breadcrumbs */}
        <Breadcrumbs
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
                      <Image src={story.banner_url} alt={story.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" priority />
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
                          <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Région" : "Location"}</p>
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
                      <div className="rich-text_bullet-list w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.challenge_summary, locale) }} />
                    </div>
                  )}

                  {/* Impact card */}
                  {story.impact_summary && (
                    <div className="customer-intro_card">
                      <h3 className="heading-size-2rem">Impact</h3>
                      <div className="spacer-1x5rem spacer-mob-1rem" />
                      <div className="rich-text_bullet-list w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.impact_summary, locale) }} />
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
                      {story.presentation && (
                        <div id="company" className="post_chapter">
                          <p className="label">{locale === "fr" ? "Entreprise" : "Company"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.presentation, locale) }} />
                        </div>
                      )}
                      {story.quote && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <TestimonialQuote text={story.quote} />
                            {(story.quote_author || story.quote_author_role) && (
                              <>
                                <div className="spacer-1x5rem" />
                                <div className="profile_wrapper">
                                  {story.quote_author_picture_url && (
                                    <div className="profile_image">
                                      <Image width={48} height={48} alt="" src={story.quote_author_picture_url} className="media-full-size" />
                                    </div>
                                  )}
                                  <div className="profile_content">
                                    {story.quote_author && <h4 className="text-size-1rem text-weight-400">{story.quote_author}</h4>}
                                    {story.quote_author_role && (<><div className="spacer-0x25rem" /><p className="text-size-0x875rem text-color-neutral">{story.quote_author_role}</p></>)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {story.contexte_rse && (
                        <div className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">{locale === "fr" ? "Contexte RSE" : "CSR Context"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.contexte_rse, locale) }} />
                        </div>
                      )}
                      {story.challenges && (
                        <div id="challenge" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">{locale === "fr" ? "Défis" : "Challenges"}</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.challenges, locale) }} />
                        </div>
                      )}
                      {story.solution && (
                        <div id="solution" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">Solution</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.solution, locale) }} />
                        </div>
                      )}
                      {story.quote_2 && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <TestimonialQuote text={story.quote_2} />
                            {(story.quote_author || story.quote_author_role) && (
                              <>
                                <div className="spacer-1x5rem" />
                                <div className="profile_wrapper">
                                  {story.quote_author_picture_url && (
                                    <div className="profile_image">
                                      <Image width={48} height={48} alt="" src={story.quote_author_picture_url} className="media-full-size" />
                                    </div>
                                  )}
                                  <div className="profile_content">
                                    {story.quote_author && <h4 className="text-size-1rem text-weight-400">{story.quote_author}</h4>}
                                    {story.quote_author_role && (<><div className="spacer-0x25rem" /><p className="text-size-0x875rem text-color-neutral">{story.quote_author_role}</p></>)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {story.impact && (
                        <div id="impact" className="post_chapter">
                          <div className="spacer-2rem" />
                          <p className="label">Impact</p>
                          <div className="spacer-1rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.impact, locale) }} />
                        </div>
                      )}
                      {story.quote_3 && (
                        <div className="post_testimonial_wrapper">
                          <div className="post_testimonial">
                            <TestimonialQuote text={story.quote_3} />
                            {(story.quote_author || story.quote_author_role) && (
                              <>
                                <div className="spacer-1x5rem" />
                                <div className="profile_wrapper">
                                  {story.quote_author_picture_url && (
                                    <div className="profile_image">
                                      <Image width={48} height={48} alt="" src={story.quote_author_picture_url} className="media-full-size" />
                                    </div>
                                  )}
                                  <div className="profile_content">
                                    {story.quote_author && <h4 className="text-size-1rem text-weight-400">{story.quote_author}</h4>}
                                    {story.quote_author_role && (<><div className="spacer-0x25rem" /><p className="text-size-0x875rem text-color-neutral">{story.quote_author_role}</p></>)}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}
                      {story.ending && (
                        <div className="post_chapter">
                          <div className="spacer-2rem" />
                          <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(story.ending, locale) }} />
                        </div>
                      )}
                    </div>{/* /post_content */}
                  </div>{/* /post_main */}
                  <div className="post_sidebar">
                    <div className="post_sidebar_toc hide-tablet">
                      <div className="post_toc_heading">
                        <p className="text-size-1rem text-weight-600">{locale === "fr" ? "Sommaire" : "Table of contents"}</p>
                      </div>
                      <div className="post_toc_content_grid">
                        <div className="post_toc_content_clip">
                          <div className="post_toc_content">
                            <div className="post_toc_content_list">
                              {story.presentation && <a href="#company" className="link-size-1rem">{locale === "fr" ? "Entreprise" : "Company"}</a>}
                              {story.challenges && <a href="#challenge" className="link-size-1rem">{locale === "fr" ? "Défis" : "Challenge"}</a>}
                              {story.solution && <a href="#solution" className="link-size-1rem">Solution</a>}
                              {story.impact && <a href="#impact" className="link-size-1rem">Impact</a>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-1x5rem hide-tablet" />
                    <div className="post_sidebar_guide">
                      <div className="post_sidebar_guide_content">
                        <div className="post_sidebar_guide_thumbnail">
                          <Image src="/images/The-Complete-EcoVadis-Guide---Cover-Website-EN.avif" alt="" width={800} height={450} className="media-full-size" />
                        </div>
                        <div className="spacer-1x5rem hide-tablet" />
                        <div>
                          <p className="label">{locale === "fr" ? "Guide EcoVadis" : "EcoVadis Guide"}</p>
                          <div className="spacer-0x75rem" />
                          <p className="heading-size-2rem">{locale === "fr" ? "3 semaines pour réussir votre évaluation RSE" : "3 weeks to succeed in your CSR assessment"}</p>
                          <div className="spacer-0x75rem" />
                          <p className="text-size-1rem text-style-3lines">{locale === "fr" ? "Une méthode éprouvée, étape par étape, pour maximiser votre score et transformer l'évaluation en véritable avantage." : "A proven, step-by-step method to maximize your score and turn the evaluation into a real advantage."}</p>
                        </div>
                      </div>
                      <div className="spacer-1x5rem" />
                      <a data-wf--button--variant="primary" href={localizedHref("/resources/guides/ecovadis-guide-3-weeks-to-succeed-in-your-csr-assessment", locale)} className="button w-inline-block">
                        <div>{locale === "fr" ? "Télécharger le guide" : "Download Guide"}</div>
                      </a>
                    </div>
                    <div className="spacer-1x5rem spacer-mob-1rem" />
                    <div className="post_sidebar_cta">
                      <p className="heading-size-1x375rem">{locale === "fr" ? "Conformité RSE : on vous accompagne (CSRD, EcoVadis, etc.) !" : "CSR compliance: we'll guide you (CSRD, EcoVadis, etc.)!"}</p>
                      <div className="spacer-0x75rem" />
                      <p className="text-size-1rem">{locale === "fr" ? "Avec Ditto, améliorez votre performance RSE et renforcez la confiance de vos partenaires." : "With Ditto, improve your CSR performance and boost your partners' confidence."}</p>
                      <div className="spacer-1x5rem" />
                      <a data-wf--button--variant="secondary" href={localizedHref("/get-started", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                        <div>{locale === "fr" ? "Contactez-nous" : "Contact Us"}</div>
                      </a>
                    </div>
                  </div>{/* /post_sidebar */}
                </div>{/* /post_grid */}
              </div>{/* /container-84rem */}
              <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
            </div>{/* /padding-global */}
            <div className="layer-4">
              <div className="background" data-wf--background--color="primary" />
            </div>
          </section>
        </div>

        {/* Read more customer stories */}
        <ReadMoreStories locale={locale} currentSlug={slug} prefix={prefix} />

        {/* CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer alternateUrls={alternateUrls} />
      </main>
    </div>
  );
}

async function ReadMoreStories({ locale, currentSlug, prefix }: { locale: string; currentSlug: string; prefix: string }) {
  const stories = await getCustomerStories(locale as "en" | "fr");
  const otherStories = (stories || []).filter((s: any) => s.slug !== currentSlug).slice(0, 3);

  if (otherStories.length === 0) return null;

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
      <section className="blog-preview_section">
        <div className="padding-global">
          <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
          <div className="container-48rem">
            <div className="header">
              <h2 className="heading-size-3rem">{locale === "fr" ? "Découvrez d'autres témoignages clients" : "Read more customer stories"}</h2>
            </div>
          </div>
          <div className="spacer-3rem" />
          <div className="container-84rem">
            <div className="blog_list_wrapper">
              <div className="blog_list" role="list">
                {otherStories.map((story: any) => (
                  <div key={story.slug} className="blog-preview_item" role="listitem">
                    <a href={localizedCmsHref("/customer-stories", story.slug, story.slug_fr, locale)} className="card-image w-inline-block">
                      {story.banner_url && (
                        <div className="card-image_thumbnail">
                          <Image src={story.banner_url} alt={story.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" />
                        </div>
                      )}
                      <div className="card-image_content">
                        <div className="spacer-1x5rem spacer-mob-1rem" />
                        {story.industry && (
                          <p className="label">{locale === "fr" ? story.industry.name_fr || story.industry.name_en : story.industry.name_en}</p>
                        )}
                        <div className="spacer-0x75rem" />
                        <div className="card-image_link_wrapper">
                          <p className="heading-size-2rem link-hover-parent text-style-2lines">{story.name}</p>
                        </div>
                        <div className="spacer-0x75rem" />
                        <p className="text-size-1rem text-style-3lines">{story.description}</p>
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div className="spacer-3rem" />
            <div className="button-group x-center">
              <a data-wf--button--variant="secondary" href={localizedHref("/get-started", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                <div>{locale === "fr" ? "Voir toutes les ressources" : "View All Resources"}</div>
              </a>
            </div>
          </div>
          <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
        </div>
        <div className="layer-4">
          <div className="background" data-wf--background--color="primary" />
        </div>
      </section>
    </div>
  );
}
