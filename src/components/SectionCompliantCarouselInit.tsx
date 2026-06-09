/**
 * @file SectionCompliantCarousel (copy with Splide initialization)
 * Based on DevLink export — only change is replacing static splide divs with actual Splide React components.
 */
"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import "@splidejs/splide/css/core";
import { DEVLINK_SCOPE_CLASS } from "../../webflow/devlinkScope";
import Block from "../../webflow/webflow_modules/Basic/components/Block";
import Heading from "../../webflow/webflow_modules/Basic/components/Heading";
import Section from "../../webflow/webflow_modules/Layout/components/Section";
import Strong from "../../webflow/webflow_modules/Basic/components/Strong";
import { Background } from "../../webflow/Background";
import { CardIcon } from "../../webflow/elements/CardIcon";
import { Padding } from "../../webflow/Padding";

export type SectionCompliantCarouselProps = {
  spaceBottom?: "Small (3rem)" | "Medium (6rem)" | "Large (9rem)" | "None";
  spaceTop?: "Small (3rem)" | "Medium (6rem)" | "Large (9rem)" | "None";
  title?: React.ReactNode;
  variant?: "Base" | "Title larger";
};

export function SectionCompliantCarousel({
  spaceBottom = "None",
  spaceTop = "Medium (6rem)",
  title = "Lorem ipsum",
  variant = "Base",
}: SectionCompliantCarouselProps) {
  const t = useTranslations("frameworks");
  const _styleVariantMap = {
    Base: "",
    "Title larger": "w-variant-206a19d0-2893-3fb0-f589-5ad4d034675d",
  };

  const _activeStyleVariant = _styleVariantMap[variant];
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
    <div
      className={DEVLINK_SCOPE_CLASS}
      style={{
        display: "contents",
      }}
      ref={splideRef}
    >
      <Section
        className={`carousel_section ${_activeStyleVariant}`}
        grid={{
          type: "section",
        }}
        id={"w-node-dbe1ed5b-a393-8703-f7a4-d71109b8c788-09b8c788"}
        tag={"section"}
      >
        <Block className={`padding-global ${_activeStyleVariant}`} tag={"div"}>
          <Padding space={spaceTop} />
          <Block
            className={`container-84rem ${_activeStyleVariant}`}
            tag={"div"}
          >
            <Block
              className={`max-width-32rem ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Heading
              className={`heading-size-3rem text-wrap-balance ${_activeStyleVariant}`}
              tag={"h2"}
            >
              {title}
            </Heading>
            <Block
              className={`spacer-3rem ${_activeStyleVariant}`}
              tag={"div"}
            />
            <Block
              className={`carousel_component ${_activeStyleVariant}`}
              // @ts-ignore - User-defined custom attribute(s)
              splide={"carousel"}
              splide-direction={"ltr"}
              splide-gap={"3rem"}
              splide-gap-mobile={"1rem"}
              splide-interval={"5000"}
              tag={"div"}
            >
              <Block
                className={`carousel_splide_wrapper ${_activeStyleVariant}`}
                tag={"div"}
              >
                <Block
                  className={`carousel_splide splide width-26rem ${_activeStyleVariant}`}
                  tag={"div"}
                >
                  <Block
                    className={`carousel_track splide__track ${_activeStyleVariant}`}
                    tag={"div"}
                  >
                    <Block
                      className={`carousel_list splide__list ${_activeStyleVariant}`}
                      tag={"div"}
                    >
                      <Block
                        className={`carousel_slide splide__slide width-26rem ${_activeStyleVariant}`}
                        tag={"div"}
                      >
                        <CardIcon
                          description={t("csrd.description")}
                          icon={
                            "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/682ed169cfc14d8e3135faa6_csrd.avif"
                          }
                          title={<Strong>{"CSRD"}</Strong>}
                        />
                      </Block>
                      <Block
                        className={`carousel_slide splide__slide width-26rem ${_activeStyleVariant}`}
                        tag={"div"}
                      >
                        <CardIcon
                          description={t("ecovadis.description")}
                          icon={
                            "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/682ed1c26a35724770ef7a90_ecovadis.avif"
                          }
                          title={"EcoVadis"}
                        />
                      </Block>
                      <Block
                        className={`carousel_slide splide__slide width-26rem ${_activeStyleVariant}`}
                        tag={"div"}
                      >
                        <CardIcon
                          description={t("iso.description")}
                          icon={
                            "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/682ed1c27d430a77816d3240_iso.avif"
                          }
                          title={"ISO"}
                        />
                      </Block>
                      <Block
                        className={`carousel_slide splide__slide width-26rem ${_activeStyleVariant}`}
                        tag={"div"}
                      >
                        <CardIcon
                          description={t("cdp.description")}
                          icon={
                            "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/static/682ed1c2ab419262c58ece95_cdp.avif"
                          }
                          title={"CDP"}
                        />
                      </Block>
                    </Block>
                  </Block>
                </Block>
                <Block
                  className={`carousel_navigation_wrapper ${_activeStyleVariant}`}
                  tag={"div"}
                />
              </Block>
              <Block
                className={`spacer-1x5rem ${_activeStyleVariant}`}
                tag={"div"}
              />
              <Block
                className={`carousel_pagination_list ${_activeStyleVariant}`}
                tag={"div"}
              >
                <Block
                  className={`carousel_pagination_button ${_activeStyleVariant}`}
                  splide-button={"pagination"}
                  tag={"div"}
                />
                <Block
                  className={`carousel_pagination_button is-active ${_activeStyleVariant}`}
                  tag={"div"}
                />
              </Block>
            </Block>
          </Block>
          <Padding space={spaceBottom} />
        </Block>
        <Block className={`layer-4 ${_activeStyleVariant}`} tag={"div"}>
          <Background color={"Primary"} />
        </Block>
      </Section>
    </div>
  );
}
