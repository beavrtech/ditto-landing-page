import { useLocale } from "next-intl";
import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";
import { Background } from "../../devlink/Background";
import type { SectionBreadcrumbsProps } from "../../devlink/sections/SectionBreadcrumbs";
import { JsonLd } from "./JsonLd";

const BASE_URL = "https://www.trustditto.com";

const CHEVRON_SVG =
  '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">\n<path fill-rule="evenodd" clip-rule="evenodd" d="M5.5312 3.52729C5.79155 3.26694 6.21366 3.26694 6.47401 3.52729L10.474 7.52729C10.7344 7.78764 10.7344 8.20975 10.474 8.4701L6.47401 12.4701C6.21366 12.7305 5.79155 12.7305 5.5312 12.4701C5.27085 12.2098 5.27085 11.7876 5.5312 11.5273L9.0598 7.9987L5.5312 4.4701C5.27085 4.20975 5.27085 3.78764 5.5312 3.52729Z" fill="#5F5C6E"/>\n</svg>';

function Chevron() {
  return (
    <div className="icon-wrapper">
      <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: CHEVRON_SVG }} />
    </div>
  );
}

/**
 * Visual breadcrumbs + matching schema.org BreadcrumbList.
 *
 * Always starts with a Home link to the locale root (link equity to the
 * brand), and renders the last (current-page) item as plain text rather
 * than a self-referencing link. Accepts the same props as the DevLink
 * SectionBreadcrumbs so existing call sites are unchanged.
 */
export function Breadcrumbs(props: SectionBreadcrumbsProps) {
  const locale = useLocale();
  const homeHref = `/${locale}`;
  const homeLabel = locale === "fr" ? "Accueil" : "Home";

  const items = [
    { text: props.item1Item1Text, href: props.item1Item1Link?.href, visible: true },
    { text: props.item2Item2Text, href: props.item2Item2Link?.href, visible: props.item2Item2Visibility ?? true },
    { text: props.item3Item3Text, href: props.item3Item3Link?.href, visible: props.item3Item3Visibility ?? false },
  ].filter((i) => i.visible && i.text != null);

  const lastIndex = items.length - 1;

  const jsonLdItems = [
    { "@type": "ListItem", position: 1, name: homeLabel, item: `${BASE_URL}${homeHref}` },
    ...items.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 2,
      ...(typeof i.text === "string" ? { name: i.text } : {}),
      // Google: the `item` URL is optional (and best omitted) for the last element
      ...(idx < lastIndex && typeof i.href === "string"
        ? { item: i.href.startsWith("http") ? i.href : `${BASE_URL}${i.href}` }
        : {}),
    })),
  ];

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: jsonLdItems,
        }}
      />
      <section className="breadcrumbs_section">
        <div className="padding-global">
          <div className="spacer-1x5rem" />
          <div className="container-84rem">
            <div className="breadcrumbs_list">
              <a href={homeHref} className="link-size-1rem">
                {homeLabel}
              </a>
              {items.map((item, idx) => (
                <span key={idx} style={{ display: "contents" }}>
                  <Chevron />
                  {idx < lastIndex && typeof item.href === "string" ? (
                    <a href={item.href} className="link-size-1rem">
                      {item.text}
                    </a>
                  ) : (
                    <span className="link-size-1rem" aria-current={idx === lastIndex ? "page" : undefined} style={{ textDecoration: "none", cursor: "default" }}>
                      {item.text}
                    </span>
                  )}
                </span>
              ))}
            </div>
          </div>
          <div className="spacer-1x5rem" />
        </div>
        <div className="layer-4">
          <Background color={props.backgroundBackground} />
        </div>
      </section>
    </div>
  );
}
