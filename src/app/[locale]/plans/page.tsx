import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { PricingPlans } from "../../../components/PricingPlans";
import { SectionCustomerLogos } from "../../../components/CustomerLogosServer";
import { ElementSocialproofTrustpilot } from "../../../../devlink/elements/ElementSocialproofTrustpilot";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../devlink/devlinkScope";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("pricing.title"),
    description: t("pricing.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/plans`,
      languages: {
        "x-default": "https://www.trustditto.com/en/plans",
        en: "https://www.trustditto.com/en/plans",
        fr: "https://www.trustditto.com/fr/plans",
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

// Pricing page intentionally lives at /plans (not /pricing), matching Vanta's naming — don't "fix" the slug.
export default async function PlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          {/* 2. Hero + plan cards + comparison table + FAQ */}
          <PricingPlans locale={locale} />

          {/* 3. Logo strip */}
          <SectionCustomerLogos locale={locale} afterContent={<ElementSocialproofTrustpilot />} />

          {/* 4. CTA */}
          <SectionCta
            title={t("cta.title")}
            paragraph={t("cta.subtitle")}
            buttonText={t("cta.button")}
            buttonLink={{ href: `${prefix}/demo` }}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
