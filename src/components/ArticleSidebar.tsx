import Image from "next/image";
import { localizedHref, localizedCmsHref } from "../lib/localized-paths";
import { CollapsibleToc } from "./CollapsibleToc";
import { SidebarNewsletter } from "./SidebarNewsletter";

type TocItem = { id: string; text: string; level: 2 | 3 };

/**
 * Parse <h2> and <h3> tags from HTML body to build a table of contents.
 */
export function extractToc(html: string): TocItem[] {
  const items: TocItem[] = [];
  const regex = /<h([23])[^>]*(?:id="([^"]*)")?[^>]*>(.*?)<\/h[23]>/gi;
  let match;
  let idx = 0;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]) as 2 | 3;
    const existingId = match[2];
    const text = match[3].replace(/<[^>]+>/g, "").trim();
    if (text) {
      const id = existingId || `heading-${idx}`;
      items.push({ id, text, level });
      idx++;
    }
  }
  return items;
}

/**
 * Inject id attributes into h2/h3 tags in the body HTML so TOC links work.
 */
export function injectHeadingIds(html: string): string {
  let idx = 0;
  return html.replace(/<h([23])([^>]*)>(.*?)<\/h[23]>/gi, (full, level, attrs, content) => {
    if (attrs.includes('id="')) return full;
    const text = content.replace(/<[^>]+>/g, "").trim();
    if (!text) return full;
    const id = `heading-${idx}`;
    idx++;
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}

export type GuideData = {
  name: string;
  slug: string;
  slug_fr?: string | null;
  description?: string;
  banner_url?: string;
  tag?: { name?: string } | null;
} | null;

/**
 * The sidebar guide-promo card (banner/tag/title/description/download link).
 * Shared by every article-type page (blog, news, collection items,
 * customer stories) so the guide card always looks and behaves the same
 * regardless of where the guide came from (theme-specific or default).
 */
export function GuideCard({ guide, locale }: { guide: GuideData; locale: string }) {
  const isFr = locale === "fr";
  if (!guide) return null;

  return (
    <>
      <div className="post_sidebar_guide">
        <div className="post_sidebar_guide_content">
          {guide.banner_url && (
            <div className="post_sidebar_guide_thumbnail">
              <Image alt="" className="media-full-size" src={guide.banner_url} width={800} height={450} />
            </div>
          )}
          <div className="spacer-1x5rem hide-tablet" />
          <div>
            {guide.tag?.name && <div className="label">{guide.tag.name}</div>}
            <div className="spacer-0x75rem" />
            <p className="heading-size-2rem">{guide.name}</p>
            {guide.description && (
              <>
                <div className="spacer-0x75rem" />
                <p className="text-size-1rem text-style-3lines">{guide.description}</p>
              </>
            )}
          </div>
        </div>
        <div className="spacer-1x5rem" />
        <a
          href={localizedCmsHref("/resources/guides", guide.slug, guide.slug_fr, locale)}
          className="button w-inline-block"
        >
          <div>{isFr ? "Télécharger le guide" : "Download guide"}</div>
        </a>
      </div>
      <div className="spacer-1x5rem spacer-mob-1rem" />
    </>
  );
}

export function ArticleSidebar({
  body,
  guide,
  locale,
}: {
  body: string;
  guide: GuideData;
  locale: string;
}) {
  const toc = extractToc(body);

  return (
    <div className="post_sidebar">
      {/* TOC — collapsible, desktop only */}
      <CollapsibleToc items={toc} locale={locale} />

      {/* Guide promo card */}
      <GuideCard guide={guide} locale={locale} />

      {/* Newsletter CTA */}
      <SidebarNewsletter locale={locale} />
    </div>
  );
}
