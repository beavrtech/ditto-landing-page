import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs, type Crumb } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, filterByTheme, toCards } from "../lib/articles";
import { mediaAlternates, mediaPath, mediaUrl } from "../lib/urls";
import { articleCollectionJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import {
  findTaxonomyPath,
  allTaxonomyPaths,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

type Params = { params: Promise<{ path: string[] }> };

export function createThemeRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateStaticParams() {
    return allTaxonomyPaths().map((path) => ({ path }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { path } = await params;
    const chain = findTaxonomyPath(path);
    if (!chain) return {};
    const label = taxonomyLabel(chain[chain.length - 1], locale);
    return {
      title: label,
      description: copy.articlesIn(label),
      alternates: mediaAlternates(locale, `/theme/${path.join("/")}`),
    };
  }

  async function Page({ params }: Params) {
    const { path } = await params;
    const chain = findTaxonomyPath(path);
    if (!chain) notFound();

    const node = chain[chain.length - 1];
    const label = taxonomyLabel(node, locale);
    const articles = filterByTheme(await getAllArticles(locale), path);

    const crumbs: Crumb[] = chain.map((crumbNode, index) => ({
      name: taxonomyLabel(crumbNode, locale),
      path: index === chain.length - 1 ? undefined : `/theme/${path.slice(0, index + 1).join("/")}`,
    }));

    return (
      <MediaShell locale={locale} mirrorPath={`/theme/${path.join("/")}`}>
        <MediaBreadcrumbs locale={locale} crumbs={crumbs} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.themeKicker}</p>
            <h1>{label}</h1>
            {node.blurb ? <p className="ns-dek">{node.blurb[locale]}</p> : null}
          </div>

          {node.children?.length ? (
            <div className="ns-subnav">
              {node.children.map((child) => (
                <Link
                  key={child.slug}
                  href={mediaPath(locale, `/theme/${[...path, child.slug].join("/")}`)}
                  className="ns-chip"
                >
                  {taxonomyLabel(child, locale)}
                </Link>
              ))}
            </div>
          ) : null}

          {/* Every taxonomy node has a page from day one, so most start empty;
              the grid says so itself. `?industry=` narrows it in place. */}
          <ArticleGrid articles={toCards(articles)} locale={locale} filterable />
        </div>
        <JsonLd
          data={articleCollectionJsonLd({
            url: mediaUrl(locale, `/theme/${path.join("/")}`),
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
