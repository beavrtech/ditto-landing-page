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
    title: t("solutionsManagement.title"),
    description: t("solutionsManagement.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/solutions/management-system`,
      languages: {
        "x-default": "https://www.trustditto.com/en/solutions/management-system",
        en: "https://www.trustditto.com/en/solutions/management-system",
        fr: "https://www.trustditto.com/fr/solutions/management-system",
      },
    },
    openGraph: {
      title: t("solutionsManagement.title"),
      description: t("solutionsManagement.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function ManagementSystemPage({ params }: { params: Promise<{ locale: string }> }) {
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
              link={{ href: `${prefix}/demo` }}
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

        {/* 5. Feature 2: Progress tracking — CTA button under this block */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsManagement.feature2.label")}
          title={t("solutionsManagement.feature2.title")}
          paragraph={t("solutionsManagement.feature2.paragraph")}
          image="/images/management-feature-2_2.avif"
          buttonButtonVisibility={true}
          buttonButtonText={t("solutionsManagement.feature2.button")}
          buttonButtonLink={{ href: `${prefix}/demo` }}
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

        {/* 8. Mid-page CTA */}
        <SectionCta
          title={t("solutionsManagement.midCta.title")}
          paragraph={t("solutionsManagement.midCta.paragraph")}
          buttonText={t("solutionsManagement.midCta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        {/* 9. Testimonials carousel */}
        <SectionTestimonials
          locale={locale}
          title={t("solutionsManagement.testimonials.title")}
          text={t("solutionsManagement.testimonials.text")}
          buttonText={t("solutionsManagement.testimonials.button")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 10. Final CTA */}
        <SectionCta
          title={t("solutionsManagement.cta.title")}
          paragraph={t("solutionsManagement.cta.paragraph")}
          buttonText={t("solutionsManagement.cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        <Footer />
      </main>
    </div>
  );
}
