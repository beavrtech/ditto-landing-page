import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../../components/NavbarServer";
import { Footer } from "../../../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../../webflow/devlinkScope";
import { getGuideBySlug } from "../../../../../lib/cms";
import { localizedHref } from "../../../../../lib/localized-paths";
import { transformRichText } from "../../../../../lib/rich-text";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getGuideBySlug(slug, locale as "en" | "fr");
  if (!item) return {};
  return {
    title: item.seo_title || item.name,
    description: item.seo_meta_desc || item.description || undefined,
  };
}

const GUIDE_FORM_CSS = `
/* Reset HubSpot defaults inside the guide form card */
.guide-form-card .hs-form { font-family: var(--font-family--paragraph, sans-serif); }
.guide-form-card .hs-form fieldset { margin: 0 0 1.5rem 0; padding: 0; border: none; max-width: 100% !important; }
.guide-form-card .hs-form-field { display: flex; flex-direction: column; gap: 0.375rem; flex: 1; }

/* Two-column rows */
.guide-form-card .form-columns-2 { display: flex; gap: 1.5rem; }
.guide-form-card .form-columns-2 .hs-form-field { flex: 1 1 0; min-width: 0; }
/* Single-column rows */
.guide-form-card .form-columns-1 { display: flex; flex-direction: column; }

/* Labels */
.guide-form-card .hs-form-field > label { font-size: 0.9375rem; font-weight: 500; color: #130E30; letter-spacing: -0.01em; margin-bottom: 0.25rem; }

/* Inputs — cream bg, no border, rounded */
.guide-form-card .hs-input {
  height: 3.125rem;
  padding: 0 1rem;
  background-color: #ffffff;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  color: #130E30;
  box-sizing: border-box;
  width: 100%;
  outline: none;
  font-family: inherit;
}
.guide-form-card .hs-input::placeholder { color: #9e9b91; }
.guide-form-card .hs-input:focus { box-shadow: 0 0 0 2px #130E3033; }
.guide-form-card textarea.hs-input { height: 7rem; padding: 0.75rem 1rem; resize: vertical; }
.guide-form-card select.hs-input { appearance: auto; }

/* Legal / consent text */
.guide-form-card .legal-consent-container { margin-top: 0.5rem; }
.guide-form-card .legal-consent-container,
.guide-form-card .legal-consent-container p,
.guide-form-card .legal-consent-container span { font-size: 0.8125rem; color: #5F5C6E; line-height: 1.5; letter-spacing: -0.01em; }
.guide-form-card .legal-consent-container a { color: #130E30; text-decoration: underline; }
.guide-form-card .hs-form-booleancheckbox-display { display: flex; align-items: flex-start; gap: 0.5rem; }
.guide-form-card .hs-form-booleancheckbox-display input[type="checkbox"] { width: 1.125rem; height: 1.125rem; margin-top: 0.125rem; flex-shrink: 0; }

/* Submit button — dark navy pill */
.guide-form-card .hs-button.primary {
  margin-top: 0.5rem;
  padding: 0.875rem 1.75rem;
  background-color: #130E30;
  color: #EFF2E5;
  border-radius: 999px;
  font-size: 1rem;
  font-weight: 400;
  font-family: inherit;
  border: 2px solid #130E30;
  cursor: pointer;
  transition: background-color 200ms ease;
  letter-spacing: -0.01em;
}
.guide-form-card .hs-button.primary:hover { background-color: #1d1844; border-color: #1d1844; }

/* Error messages */
.guide-form-card .hs-error-msgs { list-style: none; padding: 0; margin: 0.25rem 0 0 0; }
.guide-form-card .hs-error-msgs li label { font-size: 0.75rem; color: #c0392b; font-weight: 400; }

/* Multi-checkbox lists */
.guide-form-card ul.inputs-list { list-style: none; padding: 0; margin: 0; display: flex; flex-wrap: wrap; gap: 0.75rem; }
.guide-form-card .hs-form-checkbox { display: flex; align-items: center; gap: 0.5rem; }
`;

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

  const categoryLabel = item.tag?.name || "Guide";

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs */}
        <SectionBreadcrumbs
          backgroundBackground="Yellow"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text="Guides"
          item2Item2Link={{ href: localizedHref("/resources/guides", locale) }}
          item3Item3Visibility={true}
          item3Item3Text={item.name}
          item3Item3Link={{ href: `${prefix}/resources/guides/${slug}` }}
        />

        {/* Hero — yellow bg, form overlapping into body */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          {item.form && <style dangerouslySetInnerHTML={{ __html: GUIDE_FORM_CSS }} />}
          <section className="post-hero_section">
            <div className="padding-global">
              <div className="hide-tablet">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
              <div className="container-84rem">
                <div className="post-hero_component">
                  <div className="post-hero_content">
                    <div className="label">{categoryLabel}</div>
                    <div className="spacer-1x5rem" />
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
                  </div>
                  {/* Form card — overlaps into body section */}
                  <div
                    className="post-hero_banner_wrapper guide-form-card"
                    style={{
                      backgroundColor: "var(--_colors-•-semantic---surface-secondary, #eff2e5)",
                      padding: "2.5rem",
                      overflow: "visible",
                      height: "auto",
                      minHeight: "auto",
                    }}
                  >
                    {item.form ? (
                      <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: item.form }} />
                    ) : item.banner_url ? (
                      <img src={item.banner_url} loading="lazy" alt={item.banner_alt_desc || ""} className="media-full-size" style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                    ) : null}
                  </div>
                </div>
              </div>
              <div className="show-tablet">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
            </div>
            <div className="layer-4">
              <div className="background" data-wf--background--color="yellow" />
            </div>
          </section>
        </div>

        {/* Article body — no sidebar for guides */}
        {item.body && (
          <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
            <section className="post_section">
              <div className="padding-global">
                <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
                <div className="container-48rem">
                  <div className="post_content">
                    <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: transformRichText(item.body) }} />
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
          buttonLink={{ href: localizedHref("/get-started", locale) }}
        />

        <Footer />
      </main>
    </div>
  );
}
