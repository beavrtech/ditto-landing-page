import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../components/NavbarServer";
import { SectionHero } from "../../../devlink/sections/SectionHero";
import { SectionLogostrip } from "../../components/LogostripServer";
import { SectionCompliantCarousel } from "../../components/SectionCompliantCarouselInit";
import { SectionPillIllus } from "../../../devlink/sections/SectionPillIllus";
import { SectionFeaturesHeader } from "../../../devlink/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../devlink/sections/SectionFeature";
import { SectionTestimonials } from "../../components/TestimonialsServer";
import { SectionResources } from "../../components/ResourcesServer";
import { SectionCta } from "../../../devlink/sections/SectionCta";
import { Footer } from "../../components/FooterServer";
import { DEVLINK_SCOPE_CLASS } from "../../../devlink/devlinkScope";
import { NewsletterForm } from "../../components/NewsletterFormI18n";
import { ExpertiseCarousel } from "../../components/ExpertiseCarousel";
import { JsonLd, WEBSITE_JSONLD } from "../../components/JsonLd";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("home.title"),
    description: t("home.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}`,
      languages: {
        "x-default": "https://www.trustditto.com/en",
        en: "https://www.trustditto.com/en",
        fr: "https://www.trustditto.com/fr",
      },
    },
    openGraph: {
      title: t("home.title"),
      description: t("home.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <JsonLd data={WEBSITE_JSONLD} />
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Hero */}
        <SectionHero
          variant="Heading 4rem"
          title={t("hero.title")}
          paragraph={t("hero.subtitle")}
          image="/images/ditto-frameworks-hero.jpg"
          paddingBottom="None"
          buttonsVisibility={true}
          buttonLeft={<NewsletterForm />}
        />

        {/* 2. Logo strip */}
        <SectionLogostrip locale={locale} />

        {/* 3. Frameworks carousel */}
        <SectionCompliantCarousel
          title={t("frameworks.title")}
          spaceTop="Medium (6rem)"
          spaceBottom="None"
        />

        {/* 4. "Better businesses" illustration */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="home-illus_section">
            <div className="padding-global">
              <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
              <div className="container-84rem">
                <div className="home-illus_wrapper">
                  <Image
                    src="/images/ditto_better_businesses_illustration_1_narrow_1.avif"
                    alt="Ditto helps businesses build better sustainability practices"
                    width={800}
                    height={450}
                    className="home-illus_image"
                  />
                </div>
              </div>
              <div className="spacer-component w-variant-c5e33d14-e297-6cd7-2fd0-a5ca94b32941" />
            </div>
            <div className="layer-4">
              <div className="background" data-wf--background--color="primary" />
            </div>
          </section>
        </div>

        {/* 5. Solutions header */}
        <SectionFeaturesHeader
          title={<>{t("solutions.title")}</>}
          text={t("solutions.subtitle")}
        />

        {/* 6. Feature: Management system */}
        <SectionFeature
          variant="Image • Overflow"
          labelLabelText={t("solutions.management.label")}
          title={t("solutions.management.title")}
          paragraph={t("solutions.management.description")}
          buttonButtonText={t("solutions.management.cta")}
          buttonButtonLink={{ href: `${prefix}/solutions/management-system` }}
          image="/images/management-system-illus_1.avif"
        />

        {/* 7. Feature: Questionnaire automation */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutions.questionnaire.label")}
          title={t("solutions.questionnaire.title")}
          paragraph={t("solutions.questionnaire.description")}
          buttonButtonText={t("solutions.questionnaire.cta")}
          buttonButtonLink={{ href: `${prefix}/solutions/compliance-questionnaires` }}
          image="/images/questionnaire-automation-illus_1.avif"
        />

        {/* 8. Feature: AI and embedded intelligence */}
        <SectionFeature
          variant="Layout • Base"
          labelLabelText={t("solutions.ai.label")}
          title={t("solutions.ai.title")}
          paragraph={t("solutions.ai.description")}
          buttonButtonText={t("solutions.ai.cta")}
          buttonButtonLink={{ href: `${prefix}/solutions/ai-solutions` }}
          image="/images/ai-and-embedded-intelligence-illus_1.avif"
        />

        {/* 9. Feature: Supplier engagement */}
        <SectionFeature
          variant="Layout • Reversed"
          labelLabelText={t("solutions.supplier.label")}
          title={t("solutions.supplier.title")}
          paragraph={t("solutions.supplier.description")}
          buttonButtonText={t("solutions.supplier.cta")}
          buttonButtonLink={{ href: `${prefix}/solutions/supplier-engagement` }}
          image="/images/supplier-questionnaire-illus_1.avif"
        />

        {/* 10. Team photo with pill shapes */}
        <SectionPillIllus
          image="/images/happy-business-meeting-team-laughing_1.avif"
        />

        {/* 11. Expertise carousel */}
        <ExpertiseCarousel />

        {/* 12. Testimonials */}
        <SectionTestimonials
          locale={locale}
          title={t("testimonials.title")}
          text={t("testimonials.subtitle")}
          buttonText={t("testimonials.readMore")}
          buttonLink={{ href: `${prefix}/customer-stories` }}
        />

        {/* 12. Resources / Blog preview */}
        <SectionResources
          locale={locale}
          title={t("blog.title")}
        />

        {/* 13. CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
