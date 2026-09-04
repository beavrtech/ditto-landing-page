import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { SectionHero } from "../../../../../devlink/sections/SectionHero";
import { SectionCustomerLogos } from "../../../../components/CustomerLogosServer";
import { ElementSocialproofTrustpilot } from "../../../../../devlink/elements/ElementSocialproofTrustpilot";
import { SectionNumbers } from "../../../../../devlink/sections/SectionNumbers";
import { SectionFeaturesHeader } from "../../../../../devlink/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../devlink/sections/SectionFeature";
import { SectionCompliantCarousel } from "../../../../components/SectionCompliantCarouselInit";
import { SectionCtaPill } from "../../../../components/SectionCtaPillI18n";
import { SectionTestimonials } from "../../../../components/TestimonialsServer";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Button } from "../../../../../devlink/elements/Button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("frameworksVsme.title"),
    description: t("frameworksVsme.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/frameworks/vsme`,
      languages: {
        "x-default": "https://www.trustditto.com/en/frameworks/vsme",
        en: "https://www.trustditto.com/en/frameworks/vsme",
        fr: "https://www.trustditto.com/fr/frameworks/vsme",
      },
    },
    openGraph: {
      title: t("frameworksVsme.title"),
      description: t("frameworksVsme.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function FrameworksVsmePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          item1Item1Text={t("frameworksVsme.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/vsme` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksVsme.hero.title")}
          paragraph={t("frameworksVsme.hero.subtitle")}
          image="/images/csrd-hero.png"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                text={t("frameworksVsme.hero.cta")}
                link={{ href: `${prefix}/demo` }}
              />
            </div>
          }
          buttonRight={<div></div>}
        />

        {/* 3. Logo strip */}
        <SectionCustomerLogos locale={locale} afterContent={<ElementSocialproofTrustpilot />} />

        {/* 4. Key stats */}
        <SectionNumbers
          title={t("frameworksVsme.numbers.title")}
          card1Card1Number={t("frameworksVsme.numbers.card1Number")}
          card1Card1Text={t("frameworksVsme.numbers.card1Text")}
          card2Card2Number={t("frameworksVsme.numbers.card2Number")}
          card2Card2Text={t("frameworksVsme.numbers.card2Text")}
          card3Card3Number={t("frameworksVsme.numbers.card3Number")}
          card3Card3Text={t("frameworksVsme.numbers.card3Text")}
        />

        {/* 5. Approach header */}
        <SectionFeaturesHeader
          title={t("frameworksVsme.approach.title")}
          text={t("frameworksVsme.approach.subtitle")}
        />

        {/* 6. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksVsme.step1.label")}
          title={t("frameworksVsme.step1.title")}
          paragraph={t("frameworksVsme.step1.description")}
          image="/images/management-feature-2_2.avif"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature Step 2 — CTA button under this step */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksVsme.step2.label")}
          title={t("frameworksVsme.step2.title")}
          paragraph={t("frameworksVsme.step2.description")}
          image="/images/ecovadis-step-2_3.avif"
          buttonButtonVisibility={true}
          buttonButtonText={t("frameworksVsme.step2.button")}
          buttonButtonLink={{ href: `${prefix}/demo` }}
        />

        {/* 8. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksVsme.step3.label")}
          title={t("frameworksVsme.step3.title")}
          paragraph={t("frameworksVsme.step3.description")}
          image="/images/management-feature-3.svg"
          buttonButtonVisibility={false}
        />

        {/* 9. Feature Step 4 — CTA button under this step */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksVsme.step4.label")}
          title={t("frameworksVsme.step4.title")}
          paragraph={t("frameworksVsme.step4.description")}
          image="/images/ecovadis-step-4_3.svg"
          buttonButtonVisibility={true}
          buttonButtonText={t("frameworksVsme.step4.button")}
          buttonButtonLink={{ href: `${prefix}/demo` }}
        />

        {/* 10. Compliant carousel — reused identically from the template */}
        <SectionCompliantCarousel
          title={t("frameworksVsme.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 11. CTA Pill */}
        <SectionCtaPill />

        {/* 12. Testimonials — generic/default selection, no dedicated VSME testimonial yet */}
        <SectionTestimonials
          locale={locale}
          title={t("frameworksVsme.testimonials.title")}
          text={t("frameworksVsme.testimonials.subtitle")}
          buttonText={t("frameworksVsme.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 13. CTA */}
        <SectionCta
          title={t("frameworksVsme.cta.title")}
          paragraph={t("frameworksVsme.cta.subtitle")}
          buttonText={t("frameworksVsme.cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer />
      </main>
    </div>
  );
}
