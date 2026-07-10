import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { SectionHero } from "../../../../../devlink/sections/SectionHero";
import { SectionCustomerLogos } from "../../../../components/CustomerLogosServer";
import { ElementSocialproofTrustpilot } from "../../../../../devlink/elements/ElementSocialproofTrustpilot";
import { SectionFeaturesHeader } from "../../../../../devlink/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../devlink/sections/SectionFeature";
import { SectionCompliantCarousel } from "../../../../components/SectionCompliantCarouselInit";
import { SectionCtaPill } from "../../../../components/SectionCtaPillI18n";
import { SectionTestimonials } from "../../../../components/TestimonialsServer";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Button } from "../../../../../devlink/elements/Button";
import { collectionPath } from "../../../../lib/localized-paths";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("frameworksCarbon.title"),
    description: t("frameworksCarbon.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/frameworks/carbon`,
      languages: {
        "x-default": "https://www.trustditto.com/en/frameworks/carbon",
        en: "https://www.trustditto.com/en/frameworks/carbon",
        fr: "https://www.trustditto.com/fr/frameworks/carbon",
      },
    },
    openGraph: {
      title: t("frameworksCarbon.title"),
      description: t("frameworksCarbon.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function FrameworksCarbonPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  // Internal maillage into the carbon article cluster
  // (/[locale]/collection/carbon/...). FR articles are live; only the EN
  // pillar is published, so EN links only that one and the other tags
  // render as plain text (no dead links).
  const articles =
    locale === "fr"
      ? {
          pillar: collectionPath("carbon", locale, "bilan-carbone-entreprise"),
          beges: collectionPath("carbon", locale, "bilan-carbone-obligatoire-beges"),
          scopes: collectionPath("carbon", locale, "scopes-1-2-3"),
        }
      : {
          pillar: collectionPath("carbon", locale, "carbon-footprint-company"),
          beges: null,
          scopes: null,
        };

  const link = (href: string | null) => (chunks: ReactNode) =>
    href ? (
      <a href={href} style={{ textDecoration: "underline" }}>
        {chunks}
      </a>
    ) : (
      <>{chunks}</>
    );

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          item1Item1Text={t("frameworksCarbon.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/carbon` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksCarbon.hero.title")}
          paragraph={t.rich("frameworksCarbon.hero.subtitle", {
            pillar: link(articles.pillar),
            beges: link(articles.beges),
          })}
          image="/images/carbon-hero.webp"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                text={t("frameworksCarbon.hero.cta")}
                link={{ href: `${prefix}/demo` }}
              />
            </div>
          }
          buttonRight={<div></div>}
        />

        {/* 3. Logo strip */}
        <SectionCustomerLogos locale={locale} afterContent={<ElementSocialproofTrustpilot />} />

        {/* 4. Approach header — no key-figures block (follows the CDP layout) */}
        <SectionFeaturesHeader
          title={t("frameworksCarbon.approach.title")}
          text={t("frameworksCarbon.approach.subtitle")}
        />

        {/* 5. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCarbon.step1.label")}
          title={t("frameworksCarbon.step1.title")}
          paragraph={t.rich("frameworksCarbon.step1.description", {
            scopes: link(articles.scopes),
          })}
          image="/images/carbon-step-1.webp"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature Step 2 — CTA button under this step */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCarbon.step2.label")}
          title={t("frameworksCarbon.step2.title")}
          paragraph={t("frameworksCarbon.step2.description")}
          image="/images/carbon-step-2.webp"
          buttonButtonVisibility={true}
          buttonButtonText={t("frameworksCarbon.step2.button")}
          buttonButtonLink={{ href: `${prefix}/demo` }}
        />

        {/* 7. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCarbon.step3.label")}
          title={t("frameworksCarbon.step3.title")}
          paragraph={t("frameworksCarbon.step3.description")}
          image="/images/carbon-step-3.webp"
          buttonButtonVisibility={false}
        />

        {/* 8. Feature Step 4 — CTA button under this step */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCarbon.step4.label")}
          title={t("frameworksCarbon.step4.title")}
          paragraph={t("frameworksCarbon.step4.description")}
          image="/images/carbon-step-4.webp"
          buttonButtonVisibility={true}
          buttonButtonText={t("frameworksCarbon.step4.button")}
          buttonButtonLink={{ href: `${prefix}/demo` }}
        />

        {/* 9. Cross-framework carousel (reuse your data) */}
        <SectionCompliantCarousel
          title={t("frameworksCarbon.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 10. Platform CTA pill */}
        <SectionCtaPill />

        {/* 11. Testimonials */}
        <SectionTestimonials
          locale={locale}
          title={t("frameworksCarbon.testimonials.title")}
          text={t("frameworksCarbon.testimonials.subtitle")}
          buttonText={t("frameworksCarbon.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 12. Closing CTA */}
        <SectionCta
          title={t("frameworksCarbon.cta.title")}
          paragraph={t("frameworksCarbon.cta.subtitle")}
          buttonText={t("frameworksCarbon.cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer />
      </main>
    </div>
  );
}
