/**
 * @file ExpertiseCarousel - "Advanced technology meets human expertise" section
 * Built from the original exported HTML (index.html lines 1408-1505)
 * Uses the same carousel pattern as SectionCompliantCarousel with Splide init.
 */
"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import "@splidejs/splide/css/core";
import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";

const ITEMS = [
  { key: "methodology" as const, icon: "/images/proprietary-methodology.svg" },
  { key: "coach" as const, icon: "/images/dedicated-coach.svg" },
  { key: "ecovadisPartner" as const, icon: "/images/ecovadis-training-partner.svg" },
  { key: "efrag" as const, icon: "/images/friend-of-efrag.svg" },
  { key: "compliance" as const, icon: "/images/compliance-watch.svg" },
];

export function ExpertiseCarousel() {
  const t = useTranslations("expertise");
  const locale = useLocale();
  const prefix = `/${locale}`;
  const splideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let splideInstance: any = null;

    async function initSplide() {
      const { default: Splide } = await import("@splidejs/splide");

      if (splideRef.current) {
        const el = splideRef.current.querySelector(".splide");
        if (el && !(el as any).__splide) {
          splideInstance = new Splide(el as HTMLElement, {
            type: "loop",
            autoWidth: true,
            gap: "3rem",
            arrows: false,
            pagination: false,
            drag: true,
            breakpoints: {
              991: { gap: "1.5rem" },
              479: { gap: "1rem" },
            },
          });
          splideInstance.mount();
          (el as any).__splide = true;
        }
      }
    }

    initSplide();

    return () => {
      if (splideInstance) {
        try { splideInstance.destroy(); } catch {}
      }
    };
  }, []);

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }} ref={splideRef}>
      <section className="carousel_section">
        <div className="padding-global">
          <div className="spacer-component" data-wf--padding--space="small-3rem" />
          <div className="container-48rem">
            <div className="header">
              <h2 className="heading-size-3rem">{t("title")}</h2>
              <div className="spacer-1x5rem" />
              <p className="text-size-1x375rem text-wrap-balance">{t("subtitle")}</p>
            </div>
          </div>
          <div className="spacer-3rem" />
          <div className="container-84rem">
            <div
              className="carousel_component"
              splide-gap-mobile="1rem"
              // @ts-ignore
              splide="carousel"
              splide-direction="ltr"
              splide-gap="3rem"
              splide-interval="5000"
            >
              <div className="carousel_splide_wrapper">
                <div className="carousel_splide splide width-26rem">
                  <div className="carousel_track splide__track">
                    <div className="carousel_list splide__list">
                      {ITEMS.map((item) => (
                        <div key={item.key} className="carousel_slide splide__slide width-26rem">
                          <div className="card-icon" data-wf--card---icon--variant="primary">
                            <Image src={item.icon} alt="" width={40} height={40} className="card-icon_image" />
                            <div className="spacer-3rem spacer-mob-2rem" />
                            <h3 className="heading-size-2rem">{t(`${item.key}.title`)}</h3>
                            <div className="spacer-0x75rem" />
                            <p className="text-size-1x375rem">{t(`${item.key}.description`)}</p>
                            <div className="spacer-auto" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="carousel_navigation_wrapper" />
              </div>
              <div className="spacer-1x5rem" />
              <div className="carousel_pagination_list">
                <div className="carousel_pagination_button" splide-button="pagination" />
                <div className="carousel_pagination_button is-active" />
              </div>
            </div>
            <div className="spacer-3rem" />
            <div className="button-group x-center">
              <a href={`${prefix}/get-started`} className="button w-inline-block" data-wf--button--variant="primary">
                <div>{t("cta")}</div>
              </a>
            </div>
          </div>
          <div className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" data-wf--padding--space="medium-6rem" />
        </div>
        <div className="layer-4">
          <div className="background" data-wf--background--color="primary" />
        </div>
      </section>
    </div>
  );
}
