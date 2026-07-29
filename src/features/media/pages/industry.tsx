import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, filterByIndustry, toCards } from "../lib/articles";
import { mediaAlternates, mediaUrl } from "../lib/urls";
import { articleCollectionJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import {
  INDUSTRIES,
  findIndustry,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

type Params = { params: Promise<{ industry: string }> };

export function createIndustryRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateStaticParams() {
    return INDUSTRIES.map((industry) => ({ industry: industry.slug }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { industry: slug } = await params;
    const industry = findIndustry(slug);
    if (!industry) return {};
    const label = taxonomyLabel(industry, locale);
    return {
      title: label,
      description: copy.articlesIn(label),
      alternates: mediaAlternates(locale, `/industry/${slug}`),
    };
  }

  async function Page({ params }: Params) {
    const { industry: slug } = await params;
    const industry = findIndustry(slug);
    if (!industry) notFound();

    const label = taxonomyLabel(industry, locale);
    const articles = filterByIndustry(await getAllArticles(locale), slug);

    return (
      <MediaShell locale={locale} mirrorPath={`/industry/${slug}`}>
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: label }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.industryKicker}</p>
            <h1>{label}</h1>
          </div>
          <ArticleGrid articles={toCards(articles)} locale={locale} />
        </div>
        <JsonLd
          data={articleCollectionJsonLd({
            url: mediaUrl(locale, `/industry/${slug}`),
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
