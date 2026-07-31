import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, filterByTag, toCards } from "../lib/articles";
import { mediaAlternates, mediaUrl } from "../lib/urls";
import { articleCollectionJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import { TAGS, findTag, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

type Params = { params: Promise<{ tag: string }> };

/**
 * A tag page gathers every article on a named framework, regulation or
 * practice, across all three pillars. Tags are flat by design, so this is the
 * only place a reader sees REACH pieces from supply chain and QHSE together.
 */
export function createTagRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateStaticParams() {
    return TAGS.map((tag) => ({ tag: tag.slug }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { tag: slug } = await params;
    const tag = findTag(slug);
    if (!tag) return {};
    const label = taxonomyLabel(tag, locale);
    return {
      title: label,
      description: copy.articlesIn(label),
      alternates: mediaAlternates(locale, `/tag/${slug}`),
    };
  }

  async function Page({ params }: Params) {
    const { tag: slug } = await params;
    const tag = findTag(slug);
    if (!tag) notFound();

    const label = taxonomyLabel(tag, locale);
    const articles = filterByTag(await getAllArticles(locale), slug);

    return (
      <MediaShell locale={locale} mirrorPath={`/tag/${slug}`}>
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: label }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.tagKicker}</p>
            <h1>{label}</h1>
          </div>
          <ArticleGrid articles={toCards(articles)} locale={locale} />
        </div>
        <JsonLd
          data={articleCollectionJsonLd({
            url: mediaUrl(locale, `/tag/${slug}`),
            name: label,
            description: copy.articlesIn(label),
            articles,
            locale,
          })}
        />
      </MediaShell>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
