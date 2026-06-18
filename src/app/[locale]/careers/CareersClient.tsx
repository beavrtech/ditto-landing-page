"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import "@splidejs/splide/css/core";
import { Breadcrumbs } from "../../../components/BreadcrumbsWithSchema";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../devlink/devlinkScope";

export function CareersClient() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const instances: any[] = [];
    async function initSplides() {
      const { default: Splide } = await import("@splidejs/splide");
      if (pageRef.current) {
        const els = pageRef.current.querySelectorAll(".splide");
        els.forEach((el) => {
          if (!(el as any).__splide) {
            const isHeroCarousel = el.closest(".hero-carousel_section");
            const instance = new Splide(el as HTMLElement, {
              type: "loop",
              autoWidth: true,
              gap: isHeroCarousel ? "1.5rem" : "3rem",
              arrows: false,
              pagination: !isHeroCarousel,
              drag: true,
              breakpoints: {
                991: { gap: "1.5rem" },
                479: { gap: "1rem" },
              },
            });
            instance.mount();
            (el as any).__splide = true;
            instances.push(instance);
          }
        });
      }
    }
    initSplides();
    return () => { instances.forEach((s) => { try { s.destroy(); } catch {} }); };
  }, []);

  return (
    <div ref={pageRef} style={{ display: "contents" }}>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        backgroundBackground="Yellow"
        item1Item1Text={t("careers.breadcrumb")}
        item1Item1Link={{ href: `${prefix}/careers` }}
        item2Item2Visibility={false}
        item3Item3Visibility={false}
      />

      {/* 2. Hero carousel section */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="hero-carousel_section">
          <div className="padding-global">
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
            <div className="container-55rem">
              <div className="header">
                <h1 className="heading-size-4rem">{t("careers.hero.title")}</h1>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem text-wrap-balance">{t("careers.hero.subtitle")}</p>
                <div className="spacer-1x5rem" />
                <div className="button-group">
                  <a data-wf--button--variant="primary" href="https://jobs.ashbyhq.com/beavr" className="button w-inline-block">
                    <div>{t("careers.hero.cta")}</div>
                  </a>
                </div>
              </div>
            </div>
            <div className="spacer-3rem" />
            <div className="container-80rem">
              <div className="hero-carousel_splide_wrapper">
                <div className="hero-carousel_splide splide">
                  <div className="hero-carousel_track splide__track">
                    <div className="hero-carousel_list splide__list">
                      <div className="hero-carousel_slide splide__slide"><Image src="/images/careers-pic-1_1.avif" width={532} height={355} alt="Ditto team at work" /></div>
                      <div className="hero-carousel_slide splide__slide"><Image src="/images/careers-pic-2_1.avif" width={532} height={355} alt="Ditto office culture" /></div>
                      <div className="hero-carousel_slide splide__slide"><Image src="/images/careers-pic-3_1.avif" width={532} height={355} alt="Ditto team collaboration" /></div>
                      <div className="hero-carousel_slide splide__slide"><Image src="/images/careers-pic-4_1.avif" width={532} height={355} alt="Life at Ditto" /></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="yellow" className="background w-variant-a7dfcbb5-832b-e2f7-5007-3979e521cf50" />
          </div>
        </section>
      </div>

      {/* 3. Teams carousel section */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="carousel_section">
          <div className="padding-global">
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
            <div className="container-48rem">
              <div className="header">
                <h2 className="heading-size-3rem">{t("careers.teams.title")}</h2>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem text-wrap-balance">{t("careers.teams.subtitle")}</p>
              </div>
            </div>
            <div className="spacer-3rem" />
            <div className="container-80rem">
              <div className="carousel_component">
                <div className="carousel_splide_wrapper">
                  <div className="carousel_splide splide width-26rem">
                    <div className="carousel_track splide__track">
                      <div className="carousel_list splide__list">
                        {[
                          { icon: "/images/product-and-engineering.svg", key: "engineering" },
                          { icon: "/images/customer-success.svg", key: "customerSuccess" },
                          { icon: "/images/growth.svg", key: "growth" },
                          { icon: "/images/partnerships.svg", key: "partnerships" },
                          { icon: "/images/sales.svg", key: "sales" },
                          { icon: "/images/expertise.svg", key: "expertise" },
                        ].map((team) => (
                          <div key={team.key} className="carousel_slide splide__slide width-26rem">
                            <div data-wf--card---icon--variant="primary" className="card-icon">
                              <Image src={team.icon} alt={team.key} width={40} height={40} className="card-icon_image" style={{ width: "auto", height: "auto" }} />
                              <div className="spacer-3rem spacer-mob-2rem" />
                              <h3 className="heading-size-2rem">{t(`careers.teams.${team.key}.title`)}</h3>
                              <div className="spacer-0x75rem" />
                              <p className="text-size-1x375rem">{t(`careers.teams.${team.key}.description`)}</p>
                              <div className="spacer-auto" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="spacer-1x5rem" />
                <div className="carousel_pagination_list">
                  <div className="carousel_pagination_button" />
                  <div className="carousel_pagination_button is-active" />
                </div>
              </div>
              <div className="spacer-3rem" />
              <div className="button-group x-center">
                <a data-wf--button--variant="primary" href="https://jobs.ashbyhq.com/beavr" className="button w-inline-block">
                  <div>{t("careers.teams.cta")}</div>
                </a>
              </div>
            </div>
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="primary" className="background" />
          </div>
        </section>
      </div>

      {/* 4. Video/image section */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="video_section">
          <div className="padding-global">
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
            <div className="container-80rem">
              <div className="video_component">
                <Image src="/images/IMG_3632-1_1.avif" alt="Ditto team gathering" width={1200} height={630} className="media-full-size" />
              </div>
            </div>
            <div data-wf--padding--space="none" className="spacer-component w-variant-c5e33d14-e297-6cd7-2fd0-a5ca94b32941" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
          </div>
        </section>
      </div>

      {/* 5. Values section */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="careers-values_section">
          <div className="padding-global">
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            <div className="container-80rem">
              <div className="header">
                <h2 className="heading-size-3rem">{t("careers.values.title")}</h2>
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
              <div className="careers-values_component">
                <div className="careers-values_card is--magenta">
                  <h3 className="heading-size-2rem">{t("careers.values.noEgo.title")}</h3>
                  <div className="max-width-15rem">
                    <p className="text-size-1x375rem">{t("careers.values.noEgo.description")}</p>
                  </div>
                </div>
                <div className="careers-values_card is--yellow">
                  <h3 className="heading-size-2rem">{t("careers.values.ownIt.title")}</h3>
                  <div className="max-width-15rem">
                    <p className="text-size-1x375rem">{t("careers.values.ownIt.description")}</p>
                  </div>
                </div>
                <div className="careers-values_card is--green">
                  <h3 className="heading-size-2rem">{t("careers.values.impact.title")}</h3>
                  <div className="max-width-15rem">
                    <p className="text-size-1x375rem">{t("careers.values.impact.description")}</p>
                  </div>
                </div>
                <div className="careers-values_card is--blue">
                  <h3 className="heading-size-2rem">{t("careers.values.relentless.title")}</h3>
                  <div className="max-width-15rem">
                    <p className="text-size-1x375rem">{t("careers.values.relentless.description")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div data-wf--padding--space="large-9rem" className="spacer-component w-variant-83eec681-a82d-6e26-f749-52e4ca458c13" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
          </div>
        </section>
      </div>

      {/* 6. Interviewing section */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="interviewing_section">
          <div className="padding-global">
            <div data-wf--padding--space="large-9rem" className="spacer-component w-variant-83eec681-a82d-6e26-f749-52e4ca458c13" />
            <div className="container-48rem">
              <div className="header aligne-mobile-left">
                <h2 className="heading-size-3rem">{t("careers.interviewing.title")}</h2>
                <div className="spacer-1x5rem" />
                <p className="text-size-1x375rem">{t("careers.interviewing.subtitle")}</p>
              </div>
            </div>
            <div className="spacer-3rem" />
            <div className="container-80rem">
              <div className="interviewing_list">
                {[
                  { color: "is--yellow", key: "step1" },
                  { color: "is--green", key: "step2" },
                  { color: "is--blue", key: "step3" },
                  { color: "is--magenta", key: "step4" },
                  { color: "is--yellow", key: "step5" },
                  { color: "is--green", key: "step6" },
                ].map((step) => (
                  <div key={step.key} className="interviewing_item">
                    <div className={`interviewing_item_bar ${step.color}`} />
                    <p className="text-size-1rem">{t(`careers.interviewing.${step.key}`)}</p>
                  </div>
                ))}
              </div>
            </div>
            <div data-wf--padding--space="large-9rem" className="spacer-component w-variant-83eec681-a82d-6e26-f749-52e4ca458c13" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="primary" className="background" />
          </div>
        </section>
      </div>

      {/* 7. Careers list placeholder */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="careers-list_section">
          <div className="layer-4">
            <div data-wf--background--color="tertiary" className="background w-variant-11920b65-344f-1da9-05e0-96a7f0f1de3a" />
          </div>
        </section>
      </div>

      {/* 8. CTA */}
      <SectionCta
        title={t("cta.title")}
        paragraph={t("cta.subtitle")}
        buttonText={t("cta.button")}
        buttonLink={{ href: `${prefix}/demo` }}
      />
    </div>
  );
}
