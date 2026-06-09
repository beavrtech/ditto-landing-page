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

export const revalidate = 3600;

export default async function FrameworksCsrdPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("frameworksCsrd.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/csrd` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksCsrd.hero.title")}
          paragraph={t("frameworksCsrd.hero.subtitle")}
          image="/images/ecovadis-hero_1.svg"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                text={t("frameworksCsrd.hero.cta")}
                link={{ href: `${prefix}/get-started` }}
              />
            </div>
          }
          buttonRight={<div></div>}
        />

        {/* 3. Logo strip */}
        <SectionLogostrip />

        {/* 4. Approach header */}
        <SectionFeaturesHeader
          title={t("frameworksCsrd.approach.title")}
          text={t("frameworksCsrd.approach.subtitle")}
        />

        {/* 5. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCsrd.step1.label")}
          title={t("frameworksCsrd.step1.title")}
          paragraph={t("frameworksCsrd.step1.description")}
          image="/images/management-feature-2_5.avif"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature Step 2 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCsrd.step2.label")}
          title={t("frameworksCsrd.step2.title")}
          paragraph={t("frameworksCsrd.step2.description")}
          image="/images/ecovadis-step-2_4.avif"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksCsrd.step3.label")}
          title={t("frameworksCsrd.step3.title")}
          paragraph={t("frameworksCsrd.step3.description")}
          image="/images/home-feature-3.svg"
          buttonButtonVisibility={false}
        />

        {/* 8. Feature Step 4 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksCsrd.step4.label")}
          title={t("frameworksCsrd.step4.title")}
          paragraph={t("frameworksCsrd.step4.description")}
          image="/images/management-feature-1.svg"
          buttonButtonVisibility={false}
        />

        {/* 9. Compliant carousel */}
        <SectionCompliantCarousel
          title={t("frameworksCsrd.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 10. CTA Pill */}
        <SectionCtaPill />

        {/* 11. Testimonials */}
        <SectionTestimonials
          title={t("frameworksCsrd.testimonials.title")}
          text={t("frameworksCsrd.testimonials.subtitle")}
          buttonText={t("frameworksCsrd.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 12. CTA */}
        <SectionCta
          title={t("frameworksCsrd.cta.title")}
          paragraph={t("frameworksCsrd.cta.subtitle")}
          buttonText={t("frameworksCsrd.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
