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
    title: t("solutionsSupplier.title"),
    description: t("solutionsSupplier.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/solutions/supplier-engagement`,
      languages: {
        "x-default": "https://www.trustditto.com/en/solutions/supplier-engagement",
        en: "https://www.trustditto.com/en/solutions/supplier-engagement",
        fr: "https://www.trustditto.com/fr/solutions/supplier-engagement",
      },
    },
    openGraph: {
      title: t("solutionsSupplier.title"),
      description: t("solutionsSupplier.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function SupplierEngagementPage({ params }: { params: Promise<{ locale: string }> }) {
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
          item1Item1Text={t("solutionsSupplier.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/solutions/supplier-engagement` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Hero */}
        <SectionHero
          variant="Base"
          title={t("solutionsSupplier.hero.title")}
          paragraph={t("solutionsSupplier.hero.paragraph")}
          image="/images/ecovadis-hero_2.avif"
          paddingBottom="Small (3rem)"
          buttonsVisibility={true}
          buttonLeft={
            <Button
              text={t("solutionsSupplier.hero.button")}
              link={{ href: `${prefix}/get-started` }}
              variant="Primary"
            />
          }
        />

        {/* 3. Generic section header */}
        <SectionFeaturesHeader
          title={t("solutionsSupplier.header.title")}
          text={t("solutionsSupplier.header.text")}
          textVisibility={true}
        />

        {/* 4. Feature 1: Strategic alignment */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsSupplier.feature1.label")}
          title={t("solutionsSupplier.feature1.title")}
          paragraph={t("solutionsSupplier.feature1.paragraph")}
          image="/images/ecovadis-step-4_3.svg"
          buttonButtonVisibility={false}
        />

        {/* 5. Feature 2: Supplier questionnaires */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutionsSupplier.feature2.label")}
          title={t("solutionsSupplier.feature2.title")}
          paragraph={t("solutionsSupplier.feature2.paragraph")}
          image="/images/management-feature-2_4.avif"
          buttonButtonVisibility={false}
        />

        {/* 6. Feature 3: Engagement tracking */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutionsSupplier.feature3.label")}
          title={t("solutionsSupplier.feature3.title")}
          paragraph={t("solutionsSupplier.feature3.paragraph")}
          image="/images/management-feature-1_4.svg"
          buttonButtonVisibility={false}
        />

        {/* 7. Testimonials carousel */}
        <SectionTestimonials
          locale={locale}
          title={t("solutionsSupplier.testimonials.title")}
          text={t("solutionsSupplier.testimonials.text")}
          buttonText={t("solutionsSupplier.testimonials.button")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 8. CTA */}
        <SectionCta
          title={t("solutionsSupplier.cta.title")}
          paragraph={t("solutionsSupplier.cta.paragraph")}
          buttonText={t("solutionsSupplier.cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
