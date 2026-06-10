import {
  SectionBreadcrumbs,
  type SectionBreadcrumbsProps,
} from "../../devlink/sections/SectionBreadcrumbs";
import { JsonLd } from "./JsonLd";

const BASE_URL = "https://www.trustditto.com";

/**
 * Renders the visual breadcrumbs section together with a matching
 * schema.org BreadcrumbList for rich results. Items whose text is not a
 * plain string (or that are hidden) are skipped in the structured data.
 */
export function Breadcrumbs(props: SectionBreadcrumbsProps) {
  const candidates = [
    {
      text: props.item1Item1Text,
      href: props.item1Item1Link?.href,
      visible: true,
    },
    {
      text: props.item2Item2Text,
      href: props.item2Item2Link?.href,
      visible: props.item2Item2Visibility ?? true,
    },
    {
      text: props.item3Item3Text,
      href: props.item3Item3Link?.href,
      visible: props.item3Item3Visibility ?? false,
    },
  ];

  const itemListElement = candidates
    .filter(
      (c): c is { text: string; href: string; visible: boolean } =>
        c.visible &&
        typeof c.text === "string" &&
        c.text.length > 0 &&
        typeof c.href === "string" &&
        c.href.length > 0
    )
    .map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: c.text,
      item: c.href.startsWith("http") ? c.href : `${BASE_URL}${c.href}`,
    }));

  return (
    <>
      {itemListElement.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement,
          }}
        />
      )}
      <SectionBreadcrumbs {...props} />
    </>
  );
}
