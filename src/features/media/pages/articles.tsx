import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, toCards } from "../lib/articles";
import { ARTICLES_PER_PAGE } from "../lib/pagination";
import { mediaAlternates, mediaUrl } from "../lib/urls";
import { articleCollectionJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/**
 * The full article archive at /media/articles. The home page shows only the
 * newest few and links here, the way the videos section links to /media/videos.
 * One URL: every card is in the HTML and a "More articles" button reveals them
 * batch by batch, so there are no /page/n URLs to crawl or to type.
 */
export function createArticlesRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateMetadata(): Promise<Metadata> {
    return {
      title: copy.allArticles,
      description: copy.tagline,
      alternates: mediaAlternates(locale, "/articles"),
    };
  }

  async function Page() {
    const articles = await getAllArticles(locale);

    return (
      <MediaShell locale={locale} mirrorPath="/articles">
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: copy.allArticles }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.allArticles}</p>
            <h1>{copy.allArticles}</h1>
          </div>
          <ArticleGrid
            articles={toCards(articles)}
            locale={locale}
            filterable
            pageSize={ARTICLES_PER_PAGE}
          />
        </div>
        <JsonLd
          data={articleCollectionJsonLd({
            url: mediaUrl(locale, "/articles"),
            name: copy.allArticles,
            description: copy.tagline,
            articles,
            locale,
          })}
        />
      </MediaShell>
    );
  }

  return { generateMetadata, Page };
}
