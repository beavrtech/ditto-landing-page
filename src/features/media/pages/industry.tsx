import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MediaShell } from "../components/MediaShell";
import { IndustrySelector } from "../components/IndustrySelector";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, filterByIndustry } from "../lib/articles";
import { mediaAlternates } from "../lib/urls";
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
        <IndustrySelector locale={locale} current={slug} />
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: label }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.industryKicker}</p>
            <h1>{label}</h1>
          </div>
          <ArticleGrid articles={articles} locale={locale} />
        </div>
      </MediaShell>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
