import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { LogoTile } from "../../../../components/LogoTile";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../devlink/devlinkScope";
import { getCustomersByIndustry, getCustomerStories } from "../../../../lib/cms";
import { localizedHref, localizedCmsHref } from "../../../../lib/localized-paths";
import {
  CUSTOMER_INDUSTRIES,
  getCustomerIndustry,
  industryName,
  industryIntro,
} from "../../../../lib/customer-industries";

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
  const title =
    locale === "fr" ? `Ditto pour ${name}` : `Ditto for ${name}`;
  const description = industryIntro(industry, locale);
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

  const industry = getCustomerIndustry(slug);
  if (!industry) {
    notFound();
  }

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

  const name = industryName(industry, locale);
  const alternateUrls = {
    en: `/en/industry/${slug}`,
    fr: `/fr/industry/${slug}`,
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
                <div className="post-hero_content">
                  <p className="label">{locale === "fr" ? "Secteur" : "Industry"}</p>
                  <div className="spacer-1x5rem" />
                  <h1 className="heading-size-3rem">
                    {locale === "fr" ? `Ditto pour ${name}` : `Ditto for ${name}`}
                  </h1>
                  <div className="spacer-1x5rem" />
                  <p className="text-size-1x375rem">{industryIntro(industry, locale)}</p>
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
                        {locale === "fr"
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
                      {locale === "fr"
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

        {/* CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer alternateUrls={alternateUrls} />
      </main>
    </div>
  );
}
