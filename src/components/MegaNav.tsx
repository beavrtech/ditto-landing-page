"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import {
  Cpu,
  Plane,
  Factory,
  HardHat,
  Truck,
  ShoppingBag,
  Monitor,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import Link from "../../devlink/modules/Basic/components/Link";
import { articleHref } from "../lib/localized-paths";

export type MegaLink = {
  label: string;
  href: string;
  target?: "_blank" | "_self";
  icon?: string;
  /**
   * Optional per-link override for the right-hand featured block: when set,
   * hovering this link shows this featured content instead of the menu's
   * default `featured` (if any). Used by the "By industry" group to show a
   * real customer quote for the industries that have one.
   */
  featured?: MegaFeatured;
};
export type MegaGroup = { id: string; heading: string; links: MegaLink[]; columns?: number; variant?: "icon" };
/** Yellow "deadline watch" promo card (Product), rendered inside the featured block. */
export type MegaPromo = { eyebrow: string; title: string; ctaLabel: string; ctaHref: string };
/** Customer-quote card (Product) — face + quote + attribution, links to the story. */
export type MegaQuote = { quote: string; name: string; role: string; imageUrl: string; href: string };
/**
 * The right-hand featured block. `title` is the optional uppercase heading above
 * the content; `kind` selects what fills it — a yellow promo card, a customer
 * quote card (Product), or the latest blog post as an article card (Resources).
 */
export type MegaFeatured =
  | { kind: "promo"; title?: string; promo: MegaPromo }
  | { kind: "quote"; title?: string; quote: MegaQuote }
  | { kind: "article"; title?: string };
export type MegaMenu = {
  id: string;
  label: string;
  groups: MegaGroup[];
  featured?: MegaFeatured;
  /** When set, the item is a plain top-level link (no dropdown panel). */
  href?: string;
};

/** Lucide icon per industry, keyed by the `icon` string set on the link. */
const ICONS: Record<string, LucideIcon> = {
  cpu: Cpu,
  plane: Plane,
  factory: Factory,
  "hard-hat": HardHat,
  truck: Truck,
  "shopping-bag": ShoppingBag,
  monitor: Monitor,
  sparkles: Sparkles,
};

const CHEVRON =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.5312 5.52729C3.79155 5.26694 4.21366 5.26694 4.47401 5.52729L8.0026 9.05589L11.5312 5.52729C11.7915 5.26694 12.2137 5.26694 12.474 5.52729C12.7344 5.78764 12.7344 6.20975 12.474 6.4701L8.47401 10.4701C8.21366 10.7305 7.79155 10.7305 7.5312 10.4701L3.5312 6.4701C3.27085 6.20975 3.27085 5.78764 3.5312 5.52729Z" fill="#130E30"/></svg>';

/** A single column: an uppercase heading above a vertical stack of links. */
function NavColumn({
  group,
  onLinkHover,
}: {
  group: MegaGroup;
  /** Called with a link's `featured` override on hover, or `undefined` on hover-out. */
  onLinkHover?: (featured: MegaFeatured | undefined) => void;
}) {
  const isIcon = group.variant === "icon";
  const cols = group.columns ?? 1;
  const items = group.links.map((link, i) => {
    const Icon = link.icon ? ICONS[link.icon] : null;
    const linkEl = (
      <Link
        key={`${group.id}-${i}`}
        block={""}
        button={false}
        className={`nav-mega_link link-hover-parent${isIcon ? " nav-mega_link--icon" : ""}`}
        options={{ href: link.href, ...(link.target ? { target: link.target } : {}) }}
      >
        {Icon ? (
          <span className={"nav-mega_icon"} aria-hidden={"true"}>
            <Icon width={20} height={20} strokeWidth={2} />
          </span>
        ) : null}
        <span className={"nav-mega_link-label"}>{link.label}</span>
      </Link>
    );
    if (!onLinkHover) return linkEl;
    return (
      <div
        key={`${group.id}-${i}-hover`}
        style={{ display: "contents" }}
        onMouseEnter={() => onLinkHover(link.featured)}
        onMouseLeave={() => onLinkHover(undefined)}
      >
        {linkEl}
      </div>
    );
  });
  return (
    <div className={"nav-mega_col"}>
      <div className={"nav-mega_heading"}>{group.heading}</div>
      {cols > 1 ? (
        <div
          className={"nav-mega_links nav-mega_links--grid"}
          style={{ gridTemplateRows: `repeat(${Math.ceil(group.links.length / cols)}, auto)` }}
        >
          {items}
        </div>
      ) : (
        <div className={"nav-mega_links"}>{items}</div>
      )}
    </div>
  );
}

/**
 * The right-hand featured block, reused by Product and Resources. Renders an
 * optional uppercase title above whatever content is passed in, and is pinned
 * to the desktop panel only (hidden in the mobile accordion).
 */
function FeaturedBlock({
  title,
  variant,
  children,
}: {
  title?: string;
  variant: "fill" | "fixed";
  children: ReactNode;
}) {
  return (
    <div className={`nav-mega_featured nav-mega_featured--${variant} hide-tablet`}>
      {title ? <div className={"nav-mega_heading"}>{title}</div> : null}
      {children}
    </div>
  );
}

/** Yellow "deadline watch" promo card (Product). */
function PromoCard({ promo }: { promo: MegaPromo }) {
  return (
    <Link block={""} button={false} className={"nav-mega_promo"} options={{ href: promo.ctaHref }}>
      <span className={"nav-mega_promo-eyebrow"}>{promo.eyebrow}</span>
      <span className={"nav-mega_promo-title"}>{promo.title}</span>
      <span className={"nav-mega_promo-cta"}>
        {promo.ctaLabel}
        <ArrowRight width={15} height={15} strokeWidth={2.5} />
      </span>
    </Link>
  );
}

/** Customer-quote card (Product) — replaces the promo: face + quote + attribution. */
function QuoteCard({ quote }: { quote: MegaQuote }) {
  return (
    <Link block={""} button={false} className={"nav-mega_quote"} options={{ href: quote.href }}>
      <span className={"nav-mega_quote-text"}>{`“${quote.quote}”`}</span>
      <span className={"nav-mega_quote-author"}>
        <span
          className={"nav-mega_quote-avatar"}
          style={{ backgroundImage: `url('${quote.imageUrl}')` }}
          aria-hidden={"true"}
        />
        <span className={"nav-mega_quote-meta"}>
          <span className={"nav-mega_quote-name"}>{quote.name}</span>
          <span className={"nav-mega_quote-role"}>{quote.role}</span>
        </span>
      </span>
    </Link>
  );
}

/** Featured article card built from the latest blog post (Resources). */
function FeaturedArticle({ post, locale }: { post: any; locale: string }) {
  return (
    <Link
      block={""}
      button={false}
      className={"nav-mega_article link-hover-parent"}
      options={{ href: articleHref(post, post.collectionTwin, locale) }}
    >
      <span
        className={"nav-mega_article-image"}
        style={post.banner_url ? { backgroundImage: `url('${post.banner_url}')` } : undefined}
      />
      <span className={"nav-mega_article-tag"}>
        <span className={"nav-mega_article-dot"} />
        {"Blog"}
      </span>
      <span className={"nav-mega_article-title text-style-2lines"}>{post.name}</span>
      <span className={"nav-mega_article-desc text-style-2lines"}>{post.description}</span>
    </Link>
  );
}

/** The Level-2 columns (+ optional featured block) for a single megamenu. */
function MegaContent({
  menu,
  previewPosts,
  locale,
}: {
  menu: MegaMenu;
  previewPosts: any[];
  locale: string;
}) {
  // A hovered link's `featured` override takes priority over the menu's own
  // default `featured` (if any); hovering away falls back to the default.
  const [hoveredFeatured, setHoveredFeatured] = useState<MegaFeatured | undefined>(undefined);
  const featured = hoveredFeatured ?? menu.featured;
  const post = featured?.kind === "article" ? previewPosts[0] : null;
  const hasPerLinkFeatured = menu.groups.some((g) => g.links.some((l) => l.featured));

  return (
    <div className={"nav-mega"}>
      <div className={"nav-mega_cols"}>
        {menu.groups.map((group) => (
          <NavColumn
            key={group.id}
            group={group}
            onLinkHover={hasPerLinkFeatured ? setHoveredFeatured : undefined}
          />
        ))}
      </div>

      {featured ? (
        <FeaturedBlock title={featured.title} variant={featured.kind === "article" ? "fixed" : "fill"}>
          {featured.kind === "promo" ? (
            <PromoCard promo={featured.promo} />
          ) : featured.kind === "quote" ? (
            <QuoteCard quote={featured.quote} />
          ) : post ? (
            <FeaturedArticle post={post} locale={locale} />
          ) : null}
        </FeaturedBlock>
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
        // Link-type item: a plain top-level link with no dropdown panel.
        if (menu.href) {
          return (
            <div key={menu.id} className={"meganav_item"}>
              <Link
                block={""}
                button={false}
                className={"navbar1_link meganav_trigger"}
                options={{ href: menu.href }}
              >
                <div>{menu.label}</div>
              </Link>
            </div>
          );
        }
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
            // Link-type items have no panel content.
            if (menu.href) return null;
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
