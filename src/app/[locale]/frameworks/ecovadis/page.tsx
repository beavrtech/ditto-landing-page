"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../../../components/NavbarI18n";
import { Footer } from "../../../../components/FooterI18n";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionHero } from "../../../../../webflow/sections/SectionHero";
import { SectionLogostrip } from "../../../../components/SectionLogostripI18n";
import { SectionNumbers } from "../../../../../webflow/sections/SectionNumbers";
import { SectionFeaturesHeader } from "../../../../../webflow/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../webflow/sections/SectionFeature";
import { SectionCompliantCarousel } from "../../../../components/SectionCompliantCarouselInit";
import { SectionCtaPill } from "../../../../components/SectionCtaPillI18n";
import { SectionTestimonials } from "../../../../../webflow/sections/SectionTestimonials";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { Button } from "../../../../../webflow/elements/Button";

export default function FrameworksEcovadisPage() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("frameworksEcovadis.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/frameworks/ecovadis` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("frameworksEcovadis.hero.title")}
          paragraph={t("frameworksEcovadis.hero.subtitle")}
          image="/images/ecovadis-hero.svg"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <div>
              <Button
                arrow={false}
                text={t("frameworksEcovadis.hero.cta")}
                link={{ href: `${prefix}/get-started` }}
              />
            </div>
          }
          buttonRight={<div></div>}
        />

        {/* 3. Logo strip */}
        <SectionLogostrip />

        {/* 4. Numbers */}
        <SectionNumbers
          title={
            <>
              {t("frameworksEcovadis.numbers.title")}
            </>
          }
          card1Card1Number={t("frameworksEcovadis.numbers.card1Number")}
          card1Card1Text={t("frameworksEcovadis.numbers.card1Text")}
          card2Card2Number={t("frameworksEcovadis.numbers.card2Number")}
          card2Card2Text={t("frameworksEcovadis.numbers.card2Text")}
          card3Card3Number={t("frameworksEcovadis.numbers.card3Number")}
          card3Card3Text={t("frameworksEcovadis.numbers.card3Text")}
        />

        {/* 5. Approach header */}
        <SectionFeaturesHeader
          title={
            <>
              {t("frameworksEcovadis.approach.title")}
            </>
          }
          text={t("frameworksEcovadis.approach.subtitle")}
        />

        {/* 6. Feature Step 1 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksEcovadis.step1.label")}
          title={t("frameworksEcovadis.step1.title")}
          paragraph={t("frameworksEcovadis.step1.description")}
          image="/images/ecovadis-step-1.svg"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature Step 2 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksEcovadis.step2.label")}
          title={t("frameworksEcovadis.step2.title")}
          paragraph={t("frameworksEcovadis.step2.description")}
          image="/images/ecovadis-step-2_1.avif"
          buttonButtonVisibility={false}
        />

        {/* 8. Feature Step 3 */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("frameworksEcovadis.step3.label")}
          title={t("frameworksEcovadis.step3.title")}
          paragraph={t("frameworksEcovadis.step3.description")}
          image="/images/ecovadis-step-3.svg"
          buttonButtonVisibility={false}
        />

        {/* 9. Feature Step 4 */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("frameworksEcovadis.step4.label")}
          title={t("frameworksEcovadis.step4.title")}
          paragraph={t("frameworksEcovadis.step4.description")}
          image="/images/ecovadis-step-4.svg"
          buttonButtonVisibility={false}
        />

        {/* 10. Compliant carousel */}
        <SectionCompliantCarousel
          title={t("frameworksEcovadis.carousel.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
          variant="Title larger"
        />

        {/* 11. CTA Pill */}
        <SectionCtaPill />

        {/* 12. Testimonials */}
        <SectionTestimonials
          title={t("frameworksEcovadis.testimonials.title")}
          text={t("frameworksEcovadis.testimonials.subtitle")}
          buttonText={t("frameworksEcovadis.testimonials.cta")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 13. CTA */}
        <SectionCta
          title={t("frameworksEcovadis.cta.title")}
          paragraph={t("frameworksEcovadis.cta.subtitle")}
          buttonText={t("frameworksEcovadis.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
