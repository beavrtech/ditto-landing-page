"use client";

import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useRef } from "react";
import "@splidejs/splide/css/core";
import { Breadcrumbs } from "../../../components/BreadcrumbsWithSchema";
import { SectionHero2 } from "../../../../devlink/sections/SectionHero2";
import { SectionFeaturesHeader } from "../../../../devlink/sections/SectionFeaturesHeader";
import { SectionFeature } from "../../../../devlink/sections/SectionFeature";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../devlink/devlinkScope";

export function ManifestoClient() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let splideInstance: any = null;
    async function initSplide() {
      const { default: Splide } = await import("@splidejs/splide");
      if (carouselRef.current) {
        const el = carouselRef.current.querySelector(".splide");
        if (el && !(el as any).__splide) {
          splideInstance = new Splide(el as HTMLElement, {
            type: "loop",
            autoWidth: true,
            gap: "3rem",
            arrows: false,
            pagination: true,
            drag: true,
            breakpoints: {
              991: { gap: "1.5rem" },
              479: { gap: "1rem" },
            },
          });
          splideInstance.mount();
          (el as any).__splide = true;

          // Wire the custom navigation arrows to the Splide instance
          const goPrev = () => splideInstance?.go("<");
          const goNext = () => splideInstance?.go(">");
          carouselRef.current
            .querySelector(".carousel_navigation_button_left")
            ?.addEventListener("click", goPrev);
          carouselRef.current
            .querySelector(".carousel_navigation_button_right")
            ?.addEventListener("click", goNext);
        }
      }
    }
    initSplide();
    return () => { if (splideInstance) try { splideInstance.destroy(); } catch {} };
  }, []);

  return (
    <>
      {/* 1. Breadcrumbs */}
      <Breadcrumbs
        backgroundBackground="Primary"
        item1Item1Text={t("manifesto.breadcrumb")}
        item1Item1Link={{ href: `${prefix}/manifesto` }}
        item2Item2Visibility={false}
        item3Item3Visibility={false}
      />

      {/* 2. Hero2 */}
      <SectionHero2
        title={t("manifesto.hero.title")}
        loremIpsum={t("manifesto.hero.subtitle")}
      />

      {/* 3. Generic section - "Our core beliefs" header */}
      <SectionFeaturesHeader
        title={<>{t("manifesto.beliefs.title")}</>}
        textVisibility={false}
      />

      {/* 4. Feature: Great partners (reversed + title bigger) */}
      <SectionFeature
        variant="Layout • Reversed + Title • Bigger"
        labelLabelVisibility={false}
        title={t("manifesto.belief1.title")}
        paragraph={t("manifesto.belief1.description")}
        image="/images/manifesto-illus-1_1.avif"
      />

      {/* 5. Feature: Compliance as opportunity (title bigger) */}
      <SectionFeature
        variant="Title • Bigger"
        labelLabelVisibility={false}
        title={t("manifesto.belief2.title")}
        paragraph={t("manifesto.belief2.description")}
        image="/images/manifesto-illus-2_1.avif"
      />

      {/* 6. Feature: Sustainable businesses win (reversed + title bigger) */}
      <SectionFeature
        variant="Layout • Reversed + Title • Bigger"
        labelLabelVisibility={false}
        title={t("manifesto.belief3.title")}
        paragraph={t("manifesto.belief3.description")}
        image="/images/manifesto-illus-3_1.avif"
      />

      {/* 7. Careers intro */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="careers-intro_section">
          <div className="padding-global">
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            <div className="show-tablet">
              <div data-wf--padding--space="large-9rem" className="spacer-component" />
            </div>
            <div className="container-64rem">
              <div className="careers-intro_component">
                <div className="careers-intro_image_wrapper">
                  <Image alt="Ditto team collaborating" className="media-full-size" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b2bf2bcf770c96ef396c_manifesto.avif" width={1200} height={630} />
                </div>
                <div className="careers-intro_content_wrapper">
                  <div className="label">{t("manifesto.careersIntro.label")}</div>
                  <div className="spacer-1x5rem" />
                  <h2 className="heading-size-3rem">{t("manifesto.careersIntro.title")}</h2>
                  <div className="spacer-1x5rem" />
                  <p className="text-size-1x375rem">{t("manifesto.careersIntro.description")}</p>
                  <div className="spacer-1x5rem" />
                  <div className="button-group">
                    <a href={`${prefix}/careers`} className="button w-inline-block">
                      <div>{t("manifesto.careersIntro.cta")}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="show-tablet">
              <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            </div>
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="primary" className="background" />
          </div>
        </section>
      </div>

      {/* 8. Carousel */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }} ref={carouselRef}>
        <section className="carousel_section">
          <div className="padding-global">
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            <div className="container-84rem">
              <div className="max-width-50rem">
                <h2 className="heading-size-3rem text-wrap-balance">{t("manifesto.commitments.title")}</h2>
              </div>
              <div className="spacer-3rem" />
              <div className="carousel_component">
                <div className="carousel_splide_wrapper">
                  <div className="carousel_splide splide width-26rem">
                    <div className="carousel_track splide__track">
                      <div className="carousel_list splide__list">
                        <div className="carousel_slide splide__slide width-26rem">
                          <div data-wf--card---icon--variant="secondary" className="card-icon w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7">
                            <Image src="/images/ecovadis-partner-2026.svg" alt="EcoVadis Training Partner" width={96} height={96} style={{ height: "6rem", width: "auto" }} className="card-icon_image w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7" />
                            <div className="spacer-3rem spacer-mob-2rem" />
                            <h3 className="heading-size-2rem">{t("manifesto.commitments.ecovadisPartner.title")}</h3>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1x375rem">{t("manifesto.commitments.ecovadisPartner.description")}</p>
                            <div className="spacer-auto" />
                          </div>
                        </div>
                        <div className="carousel_slide splide__slide width-26rem">
                          <div data-wf--card---icon--variant="secondary-blend-logo" className="card-icon w-variant-09d5c0ae-36c1-e974-3edd-0ee349a57bda">
                            <Image src="/images/Efrag.avif" alt="EFRAG" width={96} height={96} style={{ height: "6rem", width: "auto" }} className="card-icon_image w-variant-09d5c0ae-36c1-e974-3edd-0ee349a57bda" />
                            <div className="spacer-3rem spacer-mob-2rem" />
                            <h3 className="heading-size-2rem">{t("manifesto.commitments.efrag.title")}</h3>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1x375rem">{t("manifesto.commitments.efrag.description")}</p>
                            <div className="spacer-auto" />
                          </div>
                        </div>
                        <div className="carousel_slide splide__slide width-26rem">
                          <div data-wf--card---icon--variant="secondary" className="card-icon w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7">
                            <Image src="/images/ecovadis-medal-2026.svg" alt="EcoVadis Platinum Medal" width={96} height={96} style={{ height: "6rem", width: "auto" }} className="card-icon_image w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7" />
                            <div className="spacer-3rem spacer-mob-2rem" />
                            <h3 className="heading-size-2rem">{t("manifesto.commitments.platinum.title")}</h3>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1x375rem">{t("manifesto.commitments.platinum.description")}</p>
                            <div className="spacer-auto" />
                          </div>
                        </div>
                        <div className="carousel_slide splide__slide width-26rem">
                          <div data-wf--card---icon--variant="secondary" className="card-icon w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7">
                            <Image src="/images/un-global-compact.avif" alt="UN Global Compact" width={96} height={96} style={{ height: "6rem", width: "auto" }} className="card-icon_image w-variant-ba013e42-81a1-5445-06dc-1cad1363eec7" />
                            <div className="spacer-3rem spacer-mob-2rem" />
                            <h3 className="heading-size-2rem">{t("manifesto.commitments.ungc.title")}</h3>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1x375rem">{t("manifesto.commitments.ungc.description")}</p>
                            <div className="spacer-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="carousel_navigation_wrapper">
                    <button className="carousel_navigation_button_left">
                      <div className="icon-wrapper">
                        <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="transform: rotate(180deg)"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="currentColor"/></svg>' }} />
                      </div>
                    </button>
                    <button className="carousel_navigation_button_right">
                      <div className="icon-wrapper">
                        <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 5.29289C8.68342 4.90237 9.31658 4.90237 9.70711 5.29289L15.7071 11.2929C16.0976 11.6834 16.0976 12.3166 15.7071 12.7071L9.70711 18.7071C9.31658 19.0976 8.68342 19.0976 8.29289 18.7071C7.90237 18.3166 7.90237 17.6834 8.29289 17.2929L13.5858 12L8.29289 6.70711C7.90237 6.31658 7.90237 5.68342 8.29289 5.29289Z" fill="currentColor"/></svg>' }} />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="spacer-1x5rem" />
                <div className="carousel_pagination_list">
                  <div className="carousel_pagination_button" />
                  <div className="carousel_pagination_button is-active" />
                </div>
              </div>
            </div>
            <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
          </div>
        </section>
      </div>

      {/* 9. Investors */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="generic_section">
          <div className="padding-global">
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
            <div className="container-84rem">
              <div className="header">
                <h2 className="heading-size-3rem">{t("manifesto.investors.title")}</h2>
                <div className="spacer-0x75rem" />
                <p className="text-size-1rem">{t("manifesto.investors.subtitle")}</p>
                <div className="spacer-2rem" />
                <div className="investors_list">
                  <Image alt="Nine Capital" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b96085a32e7106c24bfb_nine.avif" width={59} height={59} />
                  <Image alt="Purple" className="mix-blend-mode-multiply" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b9606ef3fedec0757bf1_purple.avif" width={70} height={70} />
                  <Image alt="Better Angle" className="mix-blend-mode-multiply" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b960ce58e09d2418ad5e_better-angle.avif" width={78} height={78} />
                  <Image alt="Aonia" className="mix-blend-mode-multiply" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b96042c32bcf5e05cab4_aonia.avif" width={80} height={80} />
                  <Image alt="Kima Ventures" className="mix-blend-mode-multiply" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b960f81118f10549ee7a_kima-ventures.avif" width={80} height={80} />
                  <Image alt="Motier Ventures" className="mix-blend-mode-multiply" src="https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/6835b960ce3117638f74790e_motier-ventures.avif" width={120} height={40} />
                </div>
              </div>
            </div>
            <div data-wf--padding--space="small-3rem" className="spacer-component" />
          </div>
          <div className="layer-4">
            <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
          </div>
        </section>
      </div>

      {/* 10. Blog preview placeholder */}
      <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
        <section className="blog-preview_section">
          <div className="layer-4">
            <div data-wf--background--color="primary" className="background" />
          </div>
        </section>
      </div>

      {/* 11. CTA */}
      <SectionCta
        title={t("cta.title")}
        paragraph={t("cta.subtitle")}
        buttonText={t("cta.button")}
        buttonLink={{ href: `${prefix}/demo` }}
      />
    </>
  );
}
