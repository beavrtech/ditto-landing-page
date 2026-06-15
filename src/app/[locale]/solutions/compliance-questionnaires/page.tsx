import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { SectionHero } from "../../../../../devlink/sections/SectionHero";
import { SectionFeaturesHeader } from "../../../../../devlink/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../devlink/sections/SectionFeature";
import { SectionTestimonials } from "../../../../components/TestimonialsServer";
import { SectionCta } from "../../../../../devlink/sections/SectionCta";
import { Breadcrumbs } from "../../../../components/BreadcrumbsWithSchema";
import { Button } from "../../../../../devlink/elements/Button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("solutionsQuestionnaires.title"),
    description: t("solutionsQuestionnaires.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/solutions/compliance-questionnaires`,
      languages: {
        "x-default": "https://www.trustditto.com/en/solutions/compliance-questionnaires",
        en: "https://www.trustditto.com/en/solutions/compliance-questionnaires",
        fr: "https://www.trustditto.com/fr/solutions/compliance-questionnaires",
      },
    },
    openGraph: {
      title: t("solutionsQuestionnaires.title"),
      description: t("solutionsQuestionnaires.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function ComplianceQuestionnairesPage({ params }: { params: Promise<{ locale: string }> }) {
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
              link={{ href: `${prefix}/demo` }}
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
          locale={locale}
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
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer />
      </main>
    </div>
  );
}
