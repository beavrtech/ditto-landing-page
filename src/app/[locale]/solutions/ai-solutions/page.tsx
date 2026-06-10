import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { SectionHero } from "../../../../../webflow/sections/SectionHero";
import { SectionFeaturesHeader } from "../../../../../webflow/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../../webflow/sections/SectionFeature";
import { SectionTestimonials } from "../../../../components/TestimonialsServer";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { Button } from "../../../../../webflow/elements/Button";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("solutionsAi.title"),
    description: t("solutionsAi.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/solutions/ai-solutions`,
      languages: {
        "x-default": "https://www.trustditto.com/en/solutions/ai-solutions",
        en: "https://www.trustditto.com/en/solutions/ai-solutions",
        fr: "https://www.trustditto.com/fr/solutions/ai-solutions",
      },
    },
    openGraph: {
      title: t("solutionsAi.title"),
      description: t("solutionsAi.description"),
      images: [{ url: "https://www.trustditto.com/images/ditto-frameworks-hero.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function AiSolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          item1Item1Text={t("solutionsAi.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/solutions/ai-solutions` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("solutionsAi.hero.title")}
          paragraph={t("solutionsAi.hero.paragraph")}
          image="/images/ecovadis-hero_1.avif"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <Button
              text={t("solutionsAi.hero.button")}
              link={{ href: `${prefix}/get-started` }}
              variant="Primary"
            />
          }
        />

        {/* 3. Generic section header */}
        <SectionFeaturesHeader
          title={t("solutionsAi.header.title")}
          textVisibility={false}
        />

        {/* 4. Feature 1: Gap analysis & roadmap */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsAi.feature1.label")}
          title={t("solutionsAi.feature1.title")}
          paragraph={t("solutionsAi.feature1.paragraph")}
          image="/images/management-feature-2_3.avif"
          buttonButtonText={t("solutionsAi.feature1.button")}
          buttonButtonLink={{ href: `${prefix}/get-started` }}
        />

        {/* 5. Feature 2: Framework experts */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsAi.feature2.label")}
          title={t("solutionsAi.feature2.title")}
          paragraph={t("solutionsAi.feature2.paragraph")}
          image="/images/ecovadis-step-3_4.svg"
          buttonButtonText={t("solutionsAi.feature2.button")}
          buttonButtonLink={{ href: `${prefix}/get-started` }}
        />

        {/* 6. Feature 3: Document review */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsAi.feature3.label")}
          title={t("solutionsAi.feature3.title")}
          paragraph={t("solutionsAi.feature3.paragraph")}
          image="/images/ecovadis-step-3_3.svg"
          buttonButtonText={t("solutionsAi.feature3.button")}
          buttonButtonLink={{ href: `${prefix}/get-started` }}
        />

        {/* 7. Feature 4: Questionnaire module */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsAi.feature4.label")}
          title={t("solutionsAi.feature4.title")}
          paragraph={t("solutionsAi.feature4.paragraph")}
          image="/images/ecovadis-step-2_3.avif"
          buttonButtonText={t("solutionsAi.feature4.button")}
          buttonButtonLink={{ href: `${prefix}/solutions/compliance-questionnaires` }}
        />

        {/* 8. Feature 5: Report generation */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsAi.feature5.label")}
          title={t("solutionsAi.feature5.title")}
          paragraph={t("solutionsAi.feature5.paragraph")}
          image="/images/home-feature-3_1.svg"
          buttonButtonText={t("solutionsAi.feature5.button")}
          buttonButtonLink={{ href: `${prefix}/get-started` }}
        />

        {/* 9. Testimonials carousel */}
        <SectionTestimonials
          locale={locale}
          title={t("solutionsAi.testimonials.title")}
          text={t("solutionsAi.testimonials.text")}
          buttonText={t("solutionsAi.testimonials.button")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 10. CTA */}
        <SectionCta
          title={t("solutionsAi.cta.title")}
          paragraph={t("solutionsAi.cta.paragraph")}
          buttonText={t("solutionsAi.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
