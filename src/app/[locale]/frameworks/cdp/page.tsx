import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionHero } from "../../../../../webflow/sections/SectionHero";
import { SectionLogostrip } from "../../../../components/LogostripServer";
import { SectionFeaturesHeader } from "../../../../../webflow/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../webflow/sections/SectionFeature";
import { SectionCompliantCarousel } from "../../../../components/SectionCompliantCarouselInit";
import { SectionCtaPill } from "../../../../components/SectionCtaPillI18n";
import { SectionTestimonials } from "../../../../components/TestimonialsServer";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { Button } from "../../../../../webflow/elements/Button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("frameworksCdp.title"),
    description: t("frameworksCdp.description"),
  };
}

export const revalidate = 3600;

export default async function FrameworksCdpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("frameworksCdp.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/cdp` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksCdp.hero.title")}
          paragraph={t("frameworksCdp.hero.subtitle")}
          image="/images/cdp-hero.avif"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                text={t("frameworksCdp.hero.cta")}
                link={{ href: `${prefix}/get-started` }}
              />
            </div>
          }
          buttonRight={<div></div>}
        />

        {/* 3. Logo strip */}
        <SectionLogostrip locale={locale} />

        {/* 4. Approach header */}
        <SectionFeaturesHeader
          title={t("frameworksCdp.approach.title")}
          text={t("frameworksCdp.approach.subtitle")}
        />

        {/* 5. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCdp.step1.label")}
          title={t("frameworksCdp.step1.title")}
          paragraph={t("frameworksCdp.step1.description")}
          image="/images/management-feature-2_1.avif"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature Step 2 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCdp.step2.label")}
          title={t("frameworksCdp.step2.title")}
          paragraph={t("frameworksCdp.step2.description")}
          image="/images/ecovadis-step-2_2.avif"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCdp.step3.label")}
          title={t("frameworksCdp.step3.title")}
          paragraph={t("frameworksCdp.step3.description")}
          image="/images/ecovadis-step-3_1.svg"
          buttonButtonVisibility={false}
        />

        {/* 8. Feature Step 4 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCdp.step4.label")}
          title={t("frameworksCdp.step4.title")}
          paragraph={t("frameworksCdp.step4.description")}
          image="/images/ecovadis-step-4_1.svg"
          buttonButtonVisibility={false}
        />

        {/* 9. Compliant carousel */}
        <SectionCompliantCarousel
          title={t("frameworksCdp.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 10. CTA Pill */}
        <SectionCtaPill />

        {/* 11. Testimonials */}
        <SectionTestimonials
          locale={locale}
          title={t("frameworksCdp.testimonials.title")}
          text={t("frameworksCdp.testimonials.subtitle")}
          buttonText={t("frameworksCdp.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 12. CTA */}
        <SectionCta
          title={t("frameworksCdp.cta.title")}
          paragraph={t("frameworksCdp.cta.subtitle")}
          buttonText={t("frameworksCdp.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
