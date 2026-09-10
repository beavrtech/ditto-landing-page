import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Button } from "../../../../../devlink/elements/Button";
import { DEVLINK_SCOPE_CLASS } from "../../../../../devlink/devlinkScope";
import { getGuideBySlug, getGuides, getRelatedGuides } from "../../../../lib/cms";
import { GuideCard } from "../../../../components/ArticleSidebar";
import { SectionCustomerLogos } from "../../../../components/CustomerLogosServer";
import { localizedHref } from "../../../../lib/localized-paths";
import type { GuideData } from "../../../../components/ArticleSidebar";

const BASE_URL = "https://www.trustditto.com";

type FrameworkTag = {
  name?: string;
  name_fr?: string;
  page_url?: string | null;
};

type RelatedGuide = NonNullable<GuideData>;

/**
 * Public thank-you URL for a guide (e.g. /en/thank-you-ecovadis-guide).
 * A single hyphenated segment per the product spec — bridged to this route's
 * real /[locale]/thank-you/[slug] folder by the rewrite in next.config.ts
 * (app-router dynamic segments can't mix static prefix text with a bracketed
 * param, so the folder itself stays a plain nested [slug]).
 */
function thankYouPath(locale: string, slug: string) {
  return `/${locale}/thank-you-${slug}`;
}

// Locale-appropriate slug for a guide (falls back to the English slug when no
// French slug is set), matching the fallback used throughout the guide pages.
function guideSlugFor(guide: { slug: string; slug_fr?: string | null }, locale: string) {
  return locale === "fr" ? guide.slug_fr || guide.slug : guide.slug;
}

// frameworks.page_url is stored locale-agnostic (e.g. "/frameworks/vsme");
// strip any legacy /en|/fr prefix before applying the current locale's,
// same defensive handling as the frameworks index page.
function frameworkHref(pageUrl: string | null | undefined, locale: string) {
  if (!pageUrl) return null;
  return `/${locale}${pageUrl.replace(/^\/(en|fr)\//, "/")}`;
}

const RELATED_GRID_CSS = `
.thank-you_related-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
@media screen and (max-width: 767px) { .thank-you_related-grid { grid-template-columns: 1fr; } }
.thank-you_soft-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 2.5rem;
  border-radius: var(--radius--radius-default, 1rem);
  background-color: var(--_colors-•-primitives---brand--yellow, #FFE228);
}
.thank-you_soft-cta_content { max-width: 40rem; }
`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = await getGuideBySlug(slug, locale as "en" | "fr");
  if (!item) return {};
  const t = await getTranslations({ locale, namespace: "metadata" });
  const enSlug = item.slug;
  const frSlug = item.slug_fr || item.slug;
  return {
    title: t("thankYouGuide.title", { guide: item.name }),
    description: t("thankYouGuide.description", { guide: item.name }),
    alternates: {
      canonical: `${BASE_URL}${thankYouPath(locale, slug)}`,
      languages: {
        "x-default": `${BASE_URL}${thankYouPath("en", enSlug)}`,
        en: `${BASE_URL}${thankYouPath("en", enSlug)}`,
        fr: `${BASE_URL}${thankYouPath("fr", frSlug)}`,
      },
    },
    // Post-conversion pages have nothing for search to index and no reason
    // to compete with the guide's own page for ranking.
    robots: { index: false, follow: true },
  };
}

export async function generateStaticParams() {
  const guides = await getGuides("en").catch(() => []);
  const params: { locale: string; slug: string }[] = [];
  for (const guide of guides || []) {
    params.push({ locale: "en", slug: guide.slug });
    if (guide.slug_fr) params.push({ locale: "fr", slug: guide.slug_fr });
  }
  return params;
}

export const revalidate = 3600;

export default async function ThankYouGuidePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  const item = await getGuideBySlug(slug, locale as "en" | "fr");
  if (!item) notFound();

  const relatedGuides: RelatedGuide[] = await getRelatedGuides(
    { id: item.id, tag_id: item.tag_id },
    locale as "en" | "fr"
  ).catch(() => []);

  const tag = item.tag as FrameworkTag | null | undefined;
  const frameworkName = locale === "fr" && tag?.name_fr ? tag.name_fr : tag?.name;
  const softCtaHref = frameworkHref(tag?.page_url, locale) || localizedHref("/frameworks", locale);

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar
          alternateUrls={{
            en: thankYouPath("en", guideSlugFor(item, "en")),
            fr: thankYouPath("fr", guideSlugFor(item, "fr")),
          }}
        />

        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <style dangerouslySetInnerHTML={{ __html: RELATED_GRID_CSS }} />

          {/* Breadcrumbs */}
          <Breadcrumbs
            backgroundBackground="Yellow"
            item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
            item1Item1Link={{ href: localizedHref("/resources", locale) }}
            item2Item2Visibility={true}
            item2Item2Text="Guides"
            item2Item2Link={{ href: localizedHref("/resources/guides", locale) }}
            item3Item3Visibility={true}
            item3Item3Text={t("thankYouGuide.breadcrumb")}
            item3Item3Link={{ href: thankYouPath(locale, slug) }}
          />

          {/* 1. Confirmation — no direct download button, the guide arrives by email */}
          <section className="guide-hero_section">
            <div className="padding-global">
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
              <div className="container-64rem">
                <div className="post-hero_component" style={{ textAlign: "center" }}>
                  <div className="post-hero_content" style={{ alignItems: "center" }}>
                    <p className="label">{t("thankYouGuide.label")}</p>
                    <div className="spacer-1x5rem" />
                    <h1 className="heading-size-3rem">{t("thankYouGuide.heading")}</h1>
                    <div className="spacer-0x75rem" />
                    <p className="text-size-1x375rem text-color-neutral">
                      {t("thankYouGuide.emailNote", { guide: item.name })}
                    </p>
                  </div>
                </div>
              </div>
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
            </div>
            <div className="layer-4">
              <div className="background w-variant-a7dfcbb5-832b-e2f7-5007-3979e521cf50" data-wf--background--color="yellow" />
            </div>
          </section>

          {/* 2. Go further — other guides on the same theme (falls back to the most recent
              other guides if the theme doesn't have two yet) */}
          {relatedGuides.length > 0 && (
            <section className="generic_section">
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="medium-6rem" />
                <div className="container-80rem">
                  <h2 className="heading-size-2rem">{t("thankYouGuide.goFurther.heading")}</h2>
                  <div className="spacer-1x5rem" />
                  <div className="thank-you_related-grid">
                    {relatedGuides.map((guide) => (
                      <GuideCard key={guide.slug} guide={guide} locale={locale} />
                    ))}
                  </div>
                </div>
                <div className="spacer-component" data-wf--padding--space="medium-6rem" />
              </div>
            </section>
          )}

          {/* 3. Soft CTA to the guide's framework page — standalone banner, not a card */}
          {frameworkName && (
            <section className="generic_section">
              <div className="padding-global">
                <div className="container-80rem">
                  <div className="thank-you_soft-cta">
                    <div className="thank-you_soft-cta_content">
                      <p className="heading-size-1x75rem">
                        {t("thankYouGuide.softCta.heading", { framework: frameworkName })}
                      </p>
                      <div className="spacer-0x75rem" />
                      <p className="text-size-1rem">
                        {t("thankYouGuide.softCta.body", { framework: frameworkName })}
                      </p>
                    </div>
                    <Button
                      text={t("thankYouGuide.softCta.button")}
                      link={{ href: softCtaHref }}
                    />
                  </div>
                </div>
                <div className="spacer-component" data-wf--padding--space="medium-6rem" />
              </div>
            </section>
          )}

          {/* 4. Social proof — real customer logos from the CMS, same component used
              on the homepage, frameworks and solutions pages */}
          <SectionCustomerLogos locale={locale} />

          {/* 5. Final CTA — the site's standard "Book a demo" section */}
          <SectionCta
            title={t("cta.title")}
            paragraph={t("cta.subtitle")}
            buttonText={t("cta.button")}
            buttonLink={{ href: localizedHref("/demo", locale) }}
          />
        </div>

        <Footer
          alternateUrls={{
            en: thankYouPath("en", guideSlugFor(item, "en")),
            fr: thankYouPath("fr", guideSlugFor(item, "fr")),
          }}
        />
      </main>
    </div>
  );
}
