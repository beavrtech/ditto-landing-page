import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { Breadcrumbs } from "../../../components/BreadcrumbsWithSchema";
import { SectionContactSidebar } from "../../../components/SectionContactSidebarI18n";
import { SectionLogostrip } from "../../../components/LogostripServer";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { PricingCalEmbed } from "../../../components/PricingCalEmbed";
import { ElementSocialproofTrustpilot } from "../../../../devlink/elements/ElementSocialproofTrustpilot";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("pricing.title"),
    description: t("pricing.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/pricing`,
      languages: {
        "x-default": "https://www.trustditto.com/en/pricing",
        en: "https://www.trustditto.com/en/pricing",
        fr: "https://www.trustditto.com/fr/pricing",
      },
    },
    openGraph: {
      title: t("pricing.title"),
      description: t("pricing.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper pricing-page">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <Breadcrumbs
          backgroundBackground="Primary"
          item1Item1Text={t("pricing.breadcrumb")}
          item1Item1Link={{ href: `${prefix}/pricing` }}
          item2Item2Visibility={false}
          item3Item3Visibility={false}
        />

        {/* 2. Value prop + benefits + Trustpilot (left), Cal.com booking (right) */}
        <SectionContactSidebar
          title={t("pricing.hero.title")}
          subtitle={t("pricing.hero.subtitle")}
          contentFooter={
            <div className="pricing-cal_trustpilot">
              <ElementSocialproofTrustpilot />
            </div>
          }
          formSlot={
            <div className="pricing-cal_embed">
              <PricingCalEmbed />
            </div>
          }
        />

        {/* 3. Logo strip */}
        <SectionLogostrip variant="Base" locale={locale} />

        {/* 4. CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/pricing` }}
        />

        <Footer />
      </main>
    </div>
  );
}
