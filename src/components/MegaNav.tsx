"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Block from "../../devlink/modules/Basic/components/Block";
import Link from "../../devlink/modules/Basic/components/Link";
import Paragraph from "../../devlink/modules/Basic/components/Paragraph";
import { articleHref } from "../lib/localized-paths";

export type MegaLink = { label: string; href: string; desc?: string; target?: "_blank" | "_self" };
export type MegaGroup = { id: string; heading: string; links: MegaLink[]; columns?: number };
export type MegaMenu = { id: string; label: string; groups: MegaGroup[]; preview?: "blog" };

const CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5312 5.52729C3.79155 5.26694 4.21366 5.26694 4.47401 5.52729L8.0026 9.05589L11.5312 5.52729C11.7915 5.26694 12.2137 5.26694 12.474 5.52729C12.7344 5.78764 12.7344 6.20975 12.474 6.4701L8.47401 10.4701C8.21366 10.7305 7.79155 10.7305 7.5312 10.4701L3.5312 6.4701C3.27085 6.20975 3.27085 5.78764 3.5312 5.52729Z" fill="#130E30"/></svg>';

/** The Level-2 columns (+ optional blog preview) for a single megamenu. */
function MegaContent({
  menu,
  previewPosts,
  locale,
}: {
  menu: MegaMenu;
  previewPosts: any[];
  locale: string;
}) {
  return (
    <div className={"nav-mega"}>
      <div className={"nav-mega_cols"}>
        {menu.groups.map((group) => {
          const cols = group.columns ?? 1;
          const linkEls = group.links.map((link, i) => (
            <Link
              key={`${group.id}-${i}`}
              block={""}
              button={false}
              className={"nav-mega_link link-hover-parent"}
              options={{ href: link.href, ...(link.target ? { target: link.target } : {}) }}
            >
              <Block className={"nav-mega_link-label"} tag={"div"}>
                {link.label}
              </Block>
              {link.desc ? (
                <Paragraph className={"nav-mega_link-desc text-color-neutral hide-tablet"}>
                  {link.desc}
                </Paragraph>
              ) : null}
            </Link>
          ));
          return (
            <div key={group.id} className={`nav-mega_col${cols > 1 ? " nav-mega_col--wide" : ""}`}>
              <div className={"nav-mega_heading"}>{group.heading}</div>
              {cols > 1 ? (
                <div
                  className={"nav-mega_links-grid"}
                  style={{ gridTemplateRows: `repeat(${Math.ceil(group.links.length / cols)}, auto)` }}
                >
                  {linkEls}
                </div>
              ) : (
                linkEls
              )}
            </div>
          );
        })}
      </div>
      {menu.preview === "blog" && previewPosts.length > 0 ? (
        <div className={"nav-mega_preview"}>
          {previewPosts.map((post: any) => (
            <Block key={post.slug} className={"dropdown1_card2"} tag={"div"}>
              <Block className={"dropdown1_card2_content"} tag={"div"}>
                <Paragraph className={"label"}>{"Blog"}</Paragraph>
                <Block className={"spacer-0x5rem"} tag={"div"} />
                <Link
                  block={""}
                  button={false}
                  className={"heading-size-1x375rem link-hover-parent text-style-2lines"}
                  options={{ href: articleHref(post, post.collectionTwin, locale) }}
                >
                  {post.name}
                </Link>
                <Block className={"spacer-0x5rem"} tag={"div"} />
                <Paragraph className={"text-size-0x875rem text-style-3lines"}>
                  {post.description}
                </Paragraph>
              </Block>
            </Block>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Stripe-style megamenu controller. Top-level triggers sit flush (no gap) so
 * hover is continuous; a single shared panel stays open while moving between
 * menus and morphs its height while cross-fading content. On mobile (<=991px)
 * it degrades to a click-driven inline accordion inside the hamburger overlay.
 */
export function MegaNav({
  menus,
  previewPosts,
  locale,
}: {
  menus: MegaMenu[];
  previewPosts: any[];
  locale: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [heights, setHeights] = useState<Record<string, number>>({});
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Track viewport so hover (desktop) vs tap (mobile) behavior can diverge.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Measure each layer's natural height so the shared panel can morph to it.
  const measure = () => {
    setHeights((prev) => {
      const next: Record<string, number> = {};
      let changed = false;
      for (const id in layerRefs.current) {
        const el = layerRefs.current[id];
        if (el) next[id] = el.offsetHeight;
        if (next[id] !== prev[id]) changed = true;
      }
      return changed ? next : prev;
    });
  };

  useLayoutEffect(() => {
    measure();
  }, []);

  useEffect(() => {
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", measure);
      return () => window.removeEventListener("resize", measure);
    }
    const ro = new ResizeObserver(measure);
    for (const id in layerRefs.current) {
      const el = layerRefs.current[id];
      if (el) ro.observe(el);
    }
    return () => ro.disconnect();
  }, [menus.length]);

  const clearClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const openMenu = (id: string) => {
    clearClose();
    setActiveId(id);
    setOpen(true);
  };
  const scheduleClose = () => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 140);
  };
  const toggleMenu = (id: string) => {
    if (open && activeId === id) {
      setOpen(false);
    } else {
      setActiveId(id);
      setOpen(true);
    }
  };

  const panelHeight = activeId ? heights[activeId] : undefined;
  const activeIndex = activeId ? menus.findIndex((m) => m.id === activeId) : -1;
  // Horizontal slide distance (~one column), matching Stripe's nav. The content
  // is swapped in fast (opacity) then glides into place over a slower transform.
  const SLIDE_REM = 6;

  return (
    <>
      {menus.map((menu) => {
        const isActive = activeId === menu.id && open;
        return (
          <div
            key={menu.id}
            className={`meganav_item${isActive ? " is-open" : ""}`}
            onMouseEnter={() => {
              if (isDesktop) openMenu(menu.id);
            }}
            onMouseLeave={() => {
              if (isDesktop) scheduleClose();
            }}
          >
            <button
              type={"button"}
              className={`navbar1_link meganav_trigger${isActive ? " is-active" : ""}`}
              aria-expanded={isActive}
              onClick={() => toggleMenu(menu.id)}
              onFocus={() => {
                if (isDesktop) openMenu(menu.id);
              }}
            >
              <div>{menu.label}</div>
              <span
                className={"icon-wrapper is-16px meganav_chevron"}
                dangerouslySetInnerHTML={{ __html: CHEVRON }}
              />
            </button>
            {/* Mobile-only inline accordion panel */}
            <div className={"meganav_mobile"}>
              <MegaContent menu={menu} previewPosts={previewPosts} locale={locale} />
            </div>
          </div>
        );
      })}

      {/* Shared desktop panel: morphs height + cross-fades between menus. */}
      <div className={`meganav_dropdown${open ? " is-open" : ""}`}>
        <div
          className={"meganav_panel"}
          style={panelHeight ? { height: `${panelHeight}px` } : undefined}
          onMouseEnter={clearClose}
          onMouseLeave={() => {
            if (isDesktop) scheduleClose();
          }}
        >
          {menus.map((menu, i) => {
            const isActive = i === activeIndex;
            // Hidden layers rest offset to the side they sit on relative to the
            // active one (left layers -> left, right layers -> right), so the
            // active layer always slides in from the direction of travel.
            const offset = activeIndex < 0 || isActive ? 0 : i < activeIndex ? -SLIDE_REM : SLIDE_REM;
            return (
              <div
                key={menu.id}
                ref={(el) => {
                  layerRefs.current[menu.id] = el;
                }}
                className={`meganav_layer${isActive ? " is-active" : ""}`}
                aria-hidden={!isActive}
                style={{ transform: `translateX(${offset}rem)`, opacity: isActive ? 1 : 0 }}
              >
                <MegaContent menu={menu} previewPosts={previewPosts} locale={locale} />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
