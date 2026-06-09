import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { SectionBreadcrumbs } from "../../../../../webflow/sections/SectionBreadcrumbs";
import { SectionCta } from "../../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../../webflow/devlinkScope";
import { Label } from "../../../../../webflow/elements/Label";
import { localizedHref } from "../../../../lib/localized-paths";
import { ExploreArticlesSection, FRAMEWORK_CONFIG } from "../../../../components/ExploreArticlesSection";

const VALID_FRAMEWORKS = Object.keys(FRAMEWORK_CONFIG);

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ locale: string; framework: string }>;
}) {
  const { locale, framework } = await params;

  if (!VALID_FRAMEWORKS.includes(framework)) {
    notFound();
  }

  const t = await getTranslations();
  const prefix = `/${locale}`;
  const config = FRAMEWORK_CONFIG[framework];

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs: Resources > EcoVadis */}
        <SectionBreadcrumbs
          backgroundBackground="Secondary"
          item1Item1Text={locale === "fr" ? "Ressources" : "Resources"}
          item1Item1Link={{ href: localizedHref("/resources", locale) }}
          item2Item2Visibility={true}
          item2Item2Text={config.title}
          item2Item2Link={{ href: `${prefix}/collection/${framework}` }}
          item3Item3Visibility={false}
        />

        {/* Hero section — hero3_section from Webflow */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="hero3_section">
            <div className="padding-global">
              <div data-wf--padding--space="none" className="spacer-component w-variant-c5e33d14-e297-6cd7-2fd0-a5ca94b32941" />
              <div className="container-84rem">
                <div className="hero3_component">
                  <div className="hero_content">
                    <Label label="Collection" />
                    <div className="spacer-1x5rem" />
                    <h1 className="heading-size-3rem">
                      {locale === "fr" ? config.heroTitle.fr : config.heroTitle.en}
                    </h1>
                    <div className="spacer-1x5rem" />
                    <p className="text-size-1x375rem">
                      {locale === "fr" ? config.heroDesc.fr : config.heroDesc.en}
                    </p>
                  </div>
                  {config.heroImage && (
                    <div className="hero3_image_wrapper">
                      <Image
                        width={1920}
                        height={1080}
                        sizes="100vw"
                        alt=""
                        src={config.heroImage}
                        className="hero_image"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
            </div>
          </section>
        </div>

        {/* Collection articles section */}
        <ExploreArticlesSection framework={framework} locale={locale} />

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
