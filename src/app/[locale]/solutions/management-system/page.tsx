import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarI18n";
import { Footer } from "../../../../components/FooterI18n";
import { SectionHero } from "../../../../../webflow/sections/SectionHero";
import { SectionFeaturesHeader } from "../../../../../webflow/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../webflow/sections/SectionFeature";
import { SectionTestimonialsI18n as SectionTestimonials } from "../../../../components/SectionTestimonialsI18n";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { Button } from "../../../../../webflow/elements/Button";

export default async function ManagementSystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("solutionsManagement.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/solutions/management-system` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("solutionsManagement.hero.title")}
          paragraph={t("solutionsManagement.hero.paragraph")}
          image="/images/management-hero.svg"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <Button
              text={t("solutionsManagement.hero.button")}
              link={{ href: `${prefix}/get-started` }}
              variant="Primary"
            />
          }
        />

        {/* 3. Generic section header */}
        <SectionFeaturesHeader
          title={t("solutionsManagement.header.title")}
          textVisibility={false}
        />

        {/* 4. Feature 1: Centralized dashboard */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsManagement.feature1.label")}
          title={t("solutionsManagement.feature1.title")}
          paragraph={t("solutionsManagement.feature1.paragraph")}
          image="/images/management-feature-1_1.svg"
          buttonButtonVisibility={false}
        />

        {/* 5. Feature 2: Progress tracking */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsManagement.feature2.label")}
          title={t("solutionsManagement.feature2.title")}
          paragraph={t("solutionsManagement.feature2.paragraph")}
          image="/images/management-feature-2_2.avif"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature 3: Knowledge base */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsManagement.feature3.label")}
          title={t("solutionsManagement.feature3.title")}
          paragraph={t("solutionsManagement.feature3.paragraph")}
          image="/images/management-feature-3.svg"
          buttonButtonVisibility={false}
        />

        {/* 7. Empty generic section (spacer) - SKIP: contains only a zero-width space */}

        {/* 8. Testimonials carousel */}
        <SectionTestimonials
          title={t("solutionsManagement.testimonials.title")}
          text={t("solutionsManagement.testimonials.text")}
          buttonText={t("solutionsManagement.testimonials.button")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 9. CTA */}
        <SectionCta
          title={t("solutionsManagement.cta.title")}
          paragraph={t("solutionsManagement.cta.paragraph")}
          buttonText={t("solutionsManagement.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
