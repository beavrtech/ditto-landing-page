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

export default async function FrameworksIso14001Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("frameworksIso14001.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/iso-14001` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksIso14001.hero.title")}
          paragraph={t("frameworksIso14001.hero.subtitle")}
          image="/images/ecovadis-hero_4.avif"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                text={t("frameworksIso14001.hero.cta")}
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
          title={
            <>
              {t("frameworksIso14001.approach.title")}
            </>
          }
          text={t("frameworksIso14001.approach.subtitle")}
        />

        {/* 5. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksIso14001.step1.label")}
          title={t("frameworksIso14001.step1.title")}
          paragraph={t("frameworksIso14001.step1.description")}
          image="/images/ecovadis-step-4_2.svg"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature Step 2 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksIso14001.step2.label")}
          title={t("frameworksIso14001.step2.title")}
          paragraph={t("frameworksIso14001.step2.description")}
          image="/images/ecovadis-step-3_2.svg"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksIso14001.step3.label")}
          title={t("frameworksIso14001.step3.title")}
          paragraph={t("frameworksIso14001.step3.description")}
          image="/images/ecovadis-step-2_5.avif"
          buttonButtonVisibility={false}
        />

        {/* 8. Feature Step 4 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksIso14001.step4.label")}
          title={t("frameworksIso14001.step4.title")}
          paragraph={t("frameworksIso14001.step4.description")}
          image="/images/management-feature-1_2.svg"
          buttonButtonVisibility={false}
        />

        {/* 9. Compliant carousel */}
        <SectionCompliantCarousel
          title={t("frameworksIso14001.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 10. CTA Pill */}
        <SectionCtaPill />

        {/* 11. Testimonials */}
        <SectionTestimonials
          title={t("frameworksIso14001.testimonials.title")}
          text={t("frameworksIso14001.testimonials.subtitle")}
          buttonText={t("frameworksIso14001.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 12. CTA */}
        <SectionCta
          title={t("frameworksIso14001.cta.title")}
          paragraph={t("frameworksIso14001.cta.subtitle")}
          buttonText={t("frameworksIso14001.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
