import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { SectionHero } from "../../../../../webflow/sections/SectionHero";
import { SectionFeaturesHeader } from "../../../../../webflow/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../webflow/sections/SectionFeature";
import { SectionTestimonialsI18n as SectionTestimonials } from "../../../../components/SectionTestimonialsI18n";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { Button } from "../../../../../webflow/elements/Button";

export default async function ComplianceQuestionnairesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("solutionsCompliance.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/solutions/compliance-questionnaires` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("solutionsCompliance.hero.title")}
          paragraph={t("solutionsCompliance.hero.paragraph")}
          image="/images/ecovadis-hero_3.avif"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <Button
              text={t("solutionsCompliance.hero.button")}
              link={{ href: `${prefix}/get-started` }}
              variant="Primary"
            />
          }
        />

        {/* 3. Generic section header */}
        <SectionFeaturesHeader
          title={t("solutionsCompliance.header.title")}
          text={t("solutionsCompliance.header.text")}
          textVisibility={true}
        />

        {/* 4. Feature 1: Drag & drop import */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsCompliance.feature1.label")}
          title={t("solutionsCompliance.feature1.title")}
          paragraph={t("solutionsCompliance.feature1.paragraph")}
          image="/images/home-feature-2_1.avif"
          buttonButtonVisibility={false}
        />

        {/* 5. Feature 2: AI-powered answers */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsCompliance.feature2.label")}
          title={t("solutionsCompliance.feature2.title")}
          paragraph={t("solutionsCompliance.feature2.paragraph")}
          image="/images/management-feature-1_3.svg"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature 3: Intelligent knowledge base */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsCompliance.feature3.label")}
          title={t("solutionsCompliance.feature3.title")}
          paragraph={t("solutionsCompliance.feature3.paragraph")}
          image="/images/home-feature-1.svg"
          buttonButtonVisibility={false}
        />

        {/* 7. Feature 4: Instant help */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsCompliance.feature4.label")}
          title={t("solutionsCompliance.feature4.title")}
          paragraph={t("solutionsCompliance.feature4.paragraph")}
          image="/images/management-feature-3_1.svg"
          buttonButtonVisibility={false}
        />

        {/* 8. Testimonials carousel */}
        <SectionTestimonials
          title={t("solutionsCompliance.testimonials.title")}
          text={t("solutionsCompliance.testimonials.text")}
          buttonText={t("solutionsCompliance.testimonials.button")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 9. CTA */}
        <SectionCta
          title={t("solutionsCompliance.cta.title")}
          paragraph={t("solutionsCompliance.cta.paragraph")}
          buttonText={t("solutionsCompliance.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
