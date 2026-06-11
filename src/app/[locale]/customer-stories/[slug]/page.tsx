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
import { transformRichText } from "../../../../lib/rich-text";

const QUOTE_OPEN_SVG = `<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <g style="mix-blend-mode:multiply"> <path d="M23.04 24.908C20.992 24.908 19.328 24.172 18.048 22.7C16.832 21.164 16.224 19.084 16.224 16.46C16.224 13.452 17.152 10.54 19.008 7.72403C20.864 4.90803 23.808 2.44403 27.84 0.332031L29.472 2.63603C26.016 4.68403 23.68 6.76403 22.464 8.87603C21.312 10.924 20.736 13.164 20.736 15.596L18.528 19.628C18.528 18.092 19.008 16.844 19.968 15.884C20.992 14.86 22.24 14.348 23.712 14.348C25.184 14.348 26.4 14.828 27.36 15.788C28.384 16.748 28.896 17.996 28.896 19.532C28.896 21.068 28.352 22.348 27.264 23.372C26.176 24.396 24.768 24.908 23.04 24.908ZM6.816 24.908C4.768 24.908 3.104 24.172 1.824 22.7C0.608001 21.164 0 19.084 0 16.46C0 13.452 0.928 10.54 2.784 7.72403C4.64 4.90803 7.584 2.44403 11.616 0.332031L13.248 2.63603C9.792 4.68403 7.456 6.76403 6.24 8.87603C5.088 10.924 4.512 13.164 4.512 15.596L2.304 19.628C2.304 18.092 2.784 16.844 3.744 15.884C4.768 14.86 6.016 14.348 7.488 14.348C8.96 14.348 10.176 14.828 11.136 15.788C12.16 16.748 12.672 17.996 12.672 19.532C12.672 21.068 12.128 22.348 11.04 23.372C9.952 24.396 8.544 24.908 6.816 24.908Z" fill="#FFE228"></path> </g> </svg>`;
const QUOTE_CLOSE_SVG = `<svg width="30" height="25" viewBox="0 0 30 25" fill="none" xmlns="http://www.w3.org/2000/svg"> <g style="mix-blend-mode:multiply"> <path d="M6.42875 0.33025C8.47675 0.33025 10.1407 1.06625 11.4207 2.53825C12.6367 4.07425 13.2447 6.15425 13.2447 8.77825C13.2447 11.7863 12.3167 14.6982 10.4607 17.5142C8.60475 20.3302 5.66075 22.7943 1.62875 24.9062L-0.00325203 22.6023C3.45275 20.5543 5.78875 18.4743 7.00475 16.3623C8.15675 14.3143 8.73275 12.0742 8.73275 9.64225L10.9407 5.61024C10.9407 7.14625 10.4607 8.39425 9.50075 9.35425C8.47675 10.3782 7.22875 10.8902 5.75675 10.8902C4.28475 10.8902 3.06875 10.4102 2.10875 9.45025C1.08475 8.49025 0.57275 7.24225 0.57275 5.70625C0.57275 4.17025 1.11675 2.89025 2.20475 1.86625C3.29275 0.842249 4.70075 0.33025 6.42875 0.33025ZM22.6527 0.33025C24.7007 0.33025 26.3647 1.06625 27.6447 2.53825C28.8607 4.07425 29.4688 6.15425 29.4688 8.77825C29.4688 11.7863 28.5407 14.6982 26.6847 17.5142C24.8287 20.3302 21.8847 22.7943 17.8527 24.9062L16.2207 22.6023C19.6767 20.5543 22.0127 18.4743 23.2287 16.3623C24.3807 14.3143 24.9567 12.0742 24.9567 9.64225L27.1647 5.61024C27.1647 7.14625 26.6847 8.39425 25.7247 9.35425C24.7007 10.3782 23.4527 10.8902 21.9807 10.8902C20.5087 10.8902 19.2927 10.4102 18.3327 9.45025C17.3087 8.49025 16.7967 7.24225 16.7967 5.70625C16.7967 4.17025 17.3407 2.89025 18.4287 1.86625C19.5167 0.842249 20.9247 0.33025 22.6527 0.33025Z" fill="#FFE228"></path> </g> </svg>`;

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

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

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
                      <Image src={story.banner_url} alt={story.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" />
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

        <Footer />
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
