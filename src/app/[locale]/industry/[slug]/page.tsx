import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { LogoTile } from "../../../../components/LogoTile";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Button } from "../../../../../devlink/elements/Button";
import { DEVLINK_SCOPE_CLASS } from "../../../../../devlink/devlinkScope";
import { getCustomersByIndustry, getCustomerStories } from "../../../../lib/cms";
import { localizedHref, localizedCmsHref } from "../../../../lib/localized-paths";
import {
  CUSTOMER_INDUSTRIES,
  getCustomerIndustry,
  industryName,
  industryIntro,
} from "../../../../lib/customer-industries";
import { getIndustryContent } from "../../../../lib/industry-content";

// Industry slugs that have a hero illustration in /public/images/industries.
const INDUSTRY_ILLUSTRATIONS = new Set([
  "aerospace-defense",
  "construction",
  "cosmetics-beauty",
  "electronics",
  "manufacturing-equipment",
  "retail",
  "technology-software",
  "transportation-logistics",
]);

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of ["en", "fr"]) {
    for (const industry of CUSTOMER_INDUSTRIES) {
      params.push({ locale, slug: industry.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const industry = getCustomerIndustry(slug);
  if (!industry) return {};
  const name = industryName(industry, locale);
  const content = getIndustryContent(slug, locale);
  const title =
    locale === "fr" ? `Ditto pour ${name}` : `Ditto for ${name}`;
  const description = content?.subhead ?? industryIntro(industry, locale);
  return {
    title,
    description,
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/industry/${slug}`,
      languages: {
        "x-default": `https://www.trustditto.com/en/industry/${slug}`,
        en: `https://www.trustditto.com/en/industry/${slug}`,
        fr: `https://www.trustditto.com/fr/industry/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function IndustryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;
  const isFr = locale === "fr";

  const industry = getCustomerIndustry(slug);
  if (!industry) {
    notFound();
  }

  const content = getIndustryContent(slug, locale);

  const [customers, stories] = await Promise.all([
    getCustomersByIndustry(slug).catch(() => []),
    getCustomerStories(locale as "en" | "fr").catch(() => []),
  ]);

  // Map EN story slug → { slug, slug_fr } so case-study links resolve to the
  // locale-correct customer-story URL (same approach as the homepage strip).
  const storySlugMap: Record<string, { slug: string; slug_fr: string | null }> = {};
  for (const s of stories || []) {
    storySlugMap[s.slug] = { slug: s.slug, slug_fr: s.slug_fr };
  }

  const caseStudyHref = (caseStudyUrl: string | null | undefined): string | null => {
    if (!caseStudyUrl) return null;
    const enSlug = caseStudyUrl.split("/").pop() as string;
    const story = storySlugMap[enSlug];
    return story
      ? localizedCmsHref("/customer-stories", story.slug, story.slug_fr, locale)
      : localizedHref(caseStudyUrl, locale);
  };

  // Resolve the proof CTA to the locale-correct customer-story URL when we have
  // a known story slug; otherwise fall back to the customer-stories index.
  const proofHref = (() => {
    const csSlug = content?.proof.caseStudySlug;
    if (csSlug) {
      const story = storySlugMap[csSlug];
      if (story) {
        return localizedCmsHref("/customer-stories", story.slug, story.slug_fr, locale);
      }
    }
    return localizedHref("/customer-stories", locale);
  })();

  const name = industryName(industry, locale);
  const alternateUrls = {
    en: `/en/industry/${slug}`,
    fr: `/fr/industry/${slug}`,
  };

  const heroEyebrow = content?.eyebrow ?? (isFr ? "Secteur" : "Industry");
  const heroTitle =
    content?.h1 ?? (isFr ? `Ditto pour ${name}` : `Ditto for ${name}`);
  const heroSubhead = content?.subhead ?? industryIntro(industry, locale);

  const primaryCtaText = isFr
    ? "Réserver un appel stratégique gratuit"
    : "Book a free strategy call";
  const secondaryCtaText = isFr ? "Voir comment ça marche" : "See how it works";

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar alternateUrls={alternateUrls} />

        {/* Breadcrumbs */}
        <Breadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={isFr ? "Témoignages clients" : "Customer stories"}
          item1Item1Link={{ href: localizedHref("/customer-stories", locale) }}
          item2Item2Visibility={true}
          item2Item2Text={name}
          item2Item2Link={{ href: `${prefix}/industry/${slug}` }}
          item3Item3Visibility={false}
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
                    <p className="label">{heroEyebrow}</p>
                    <div className="spacer-1x5rem" />
                    <h1 className="heading-size-3rem">{heroTitle}</h1>
                    <div className="spacer-1x5rem" />
                    <p className="text-size-1x375rem">{heroSubhead}</p>
                    <div className="spacer-2rem" />
                    <div className="button-group">
                      <Button
                        arrow={false}
                        link={{ href: `${prefix}/demo` }}
                        text={primaryCtaText}
                        variant="Primary"
                      />
                      <Button
                        arrow={false}
                        link={{ href: `${prefix}/solutions/ai-solutions` }}
                        text={secondaryCtaText}
                        variant="Secondary"
                      />
                    </div>
                  </div>
                  {INDUSTRY_ILLUSTRATIONS.has(slug) && (
                    // Decorative industry illustration filling the empty right
                    // side of the hero on desktop (hidden on tablet/mobile).
                    <div
                      className="hide-tablet"
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        src={`/images/industries/${slug}.png`}
                        alt=""
                        width={1024}
                        height={1024}
                        priority
                        sizes="(min-width: 992px) 30rem, 0px"
                        style={{
                          width: "100%",
                          maxWidth: "30rem",
                          height: "auto",
                          borderRadius: "var(--radius--radius-default)",
                        }}
                      />
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

        {/* Customers in this industry */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="logostrip_section">
            <div className="padding-global">
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
              <div className="container-80rem">
                {customers && customers.length > 0 ? (
                  <>
                    <div className="header">
                      <h2 className="heading-size-2rem">
                        {isFr
                          ? "Ils nous font confiance"
                          : "Companies that trust us"}
                      </h2>
                    </div>
                    <div className="spacer-2rem" />
                    <div className="customer-logos_rows">
                      <div className="customer-logos_row">
                        {customers.map((c: any) => (
                          <LogoTile
                            key={c.id}
                            name={c.name}
                            logoUrl={c.logo_url}
                            caseStudyHref={caseStudyHref(c.case_study_url)}
                            caseStudyLabel={t("socialProof.caseStudy")}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="header">
                    <p className="text-size-1x375rem">
                      {isFr
                        ? "De nouveaux témoignages clients arrivent bientôt pour ce secteur."
                        : "New customer stories for this industry are coming soon."}
                    </p>
                  </div>
                )}
              </div>
              <div className="spacer-component" data-wf--padding--space="small-3rem" />
            </div>
            <div className="layer-4">
              <div className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" data-wf--background--color="secondary" />
            </div>
          </section>
        </div>

        {content && (
          <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
            {/* Context */}
            <section>
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-80rem">
                  <div style={{ maxWidth: "48rem" }}>
                    <h2 className="heading-size-2rem">
                      {isFr ? "Le contexte" : "The context"}
                    </h2>
                    <div className="spacer-1x5rem" />
                    {content.context.map((para, i) => (
                      <div key={i}>
                        {i > 0 && <div className="spacer-1x5rem" />}
                        <p className="text-size-1x375rem">{para}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
            </section>

            {/* How Ditto helps */}
            <section>
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-80rem">
                  <h2 className="heading-size-2rem">
                    {isFr ? "Comment Ditto vous aide" : "How Ditto helps"}
                  </h2>
                  <div className="spacer-1x5rem" />
                  <p className="text-size-1x375rem" style={{ maxWidth: "48rem" }}>
                    {content.howHelpsIntro}
                  </p>
                  <div className="spacer-2rem" />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
                      gap: "2rem",
                    }}
                  >
                    {content.frameworks.map((f) => (
                      <div key={f.title}>
                        <h3 className="heading-size-2rem" style={{ fontSize: "1.25rem" }}>
                          {f.title}
                        </h3>
                        <div className="spacer-1x5rem" />
                        <p className="text-size-1x375rem">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
            </section>

            {/* Outcomes */}
            <section className="logostrip_section">
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-80rem">
                  <h2 className="heading-size-2rem">
                    {isFr ? "Ce que vous y gagnez" : "Outcomes"}
                  </h2>
                  <div className="spacer-2rem" />
                  <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "grid", gap: "1rem" }}>
                    {content.outcomes.map((o, i) => (
                      <li key={i} className="text-size-1x375rem">
                        <strong>{o.strong}</strong> {o.text}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
              <div className="layer-4">
                <div className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" data-wf--background--color="secondary" />
              </div>
            </section>

            {/* Proof / case study */}
            <section>
              <div className="padding-global">
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
                <div className="container-80rem">
                  <div style={{ maxWidth: "48rem" }}>
                    <p className="label">
                      {isFr ? "Preuve" : "Proof"}
                    </p>
                    <div className="spacer-1x5rem" />
                    {content.proof.heading && (
                      <h2 className="heading-size-2rem">{content.proof.heading}</h2>
                    )}
                    {content.proof.body && (
                      <>
                        <div className="spacer-1x5rem" />
                        <p className="text-size-1x375rem">{content.proof.body}</p>
                      </>
                    )}
                    {content.proof.quote && (
                      <>
                        <div className="spacer-1x5rem" />
                        <p className="text-size-1x375rem">
                          <em>“{content.proof.quote}”</em>
                        </p>
                        {content.proof.author && (
                          <>
                            <div className="spacer-1x5rem" />
                            <p className="text-size-1x375rem">
                              <strong>{content.proof.author}</strong>
                            </p>
                          </>
                        )}
                      </>
                    )}
                    <div className="spacer-2rem" />
                    <div className="button-group">
                      <Button
                        arrow={true}
                        link={{ href: proofHref }}
                        text={content.proof.ctaLabel}
                        variant="Secondary"
                      />
                    </div>
                  </div>
                </div>
                <div className="spacer-component" data-wf--padding--space="small-3rem" />
              </div>
            </section>
          </div>
        )}

        {/* Final CTA */}
        <SectionCta
          title={content?.finalCta.heading ?? t("cta.title")}
          paragraph={content?.finalCta.body ?? t("cta.subtitle")}
          buttonText={content?.finalCta.button ?? t("cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer alternateUrls={alternateUrls} />
      </main>
    </div>
  );
}
