import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs, type Crumb } from "../components/MediaBreadcrumbs";
import { Byline } from "../components/Byline";
import { ArticleGrid } from "../components/ArticleCard";
import {
  getArticle,
  getArticleSlugs,
  getAllArticles,
  relatedArticles,
} from "../lib/articles";
import { renderArticleBody } from "../lib/mdx";
import { getAuthor } from "../data/authors";
import { mediaAlternates, mediaPath, SITE_URL } from "../lib/urls";
import { mediaArticleJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import {
  findTaxonomyPath,
  findIndustry,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function createArticleRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateStaticParams() {
    return (await getArticleSlugs()).map((slug) => ({ slug }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const article = await getArticle(slug, locale);
    if (!article) return {};
    const author = getAuthor(article.author);
    return {
      title: article.title,
      description: article.description,
      alternates: mediaAlternates(locale, `/${slug}`),
      openGraph: {
        type: "article",
        title: article.title,
        description: article.description,
        publishedTime: article.date,
        modifiedTime: article.updated ?? article.date,
        authors: author ? [author.name] : undefined,
        images: [{ url: `${SITE_URL}${article.illustration}` }],
      },
    };
  }

  async function Page({ params }: Params) {
    const { slug } = await params;
    const article = await getArticle(slug, locale);
    if (!article) notFound();

    const author = getAuthor(article.author);
    if (!author) notFound();

    const themeSlugs = [article.level1, article.level2, article.level3].filter(Boolean) as string[];
    const chain = findTaxonomyPath(themeSlugs) ?? [];
    const crumbs: Crumb[] = chain.map((node, index) => ({
      name: taxonomyLabel(node, locale),
      path: `/theme/${themeSlugs.slice(0, index + 1).join("/")}`,
    }));
    crumbs.push({ name: article.title });

    const body = await renderArticleBody(article.body, locale);
    const all = await getAllArticles(locale);
    const related = relatedArticles(all, article);
    const level1Node = chain[0];

    return (
      <MediaShell locale={locale} mirrorPath={`/${slug}`}>
        <MediaBreadcrumbs locale={locale} crumbs={crumbs} />

        <article>
          <header className="ns-wrap ns-article-head">
            <p className="ns-kicker">
              {chain.map((node) => taxonomyLabel(node, locale)).join(" · ")}
            </p>
            <h1 className="ns-article-title">{article.title}</h1>
            <p className="ns-dek">{article.description}</p>
            <div style={{ marginTop: "1.5rem" }}>
              <Byline
                author={author}
                locale={locale}
                date={article.date}
                readTimeMinutes={article.readTimeMinutes}
              />
            </div>
            <div className="ns-article-illustration">
              <Image
                src={article.illustration}
                alt={article.illustrationAlt}
                width={1200}
                height={600}
                priority
              />
            </div>
          </header>

          <div className="ns-wrap ns-article-body">
            <div className="ns-prose">{body}</div>

            <footer className="ns-article-foot">
              {article.updated ? (
                <p className="ns-meta" style={{ marginBottom: "1rem" }}>
                  {copy.updatedOn} {article.updated}
                </p>
              ) : null}
              <div className="ns-tags">
                <span className="ns-kicker">{copy.industries}</span>
                {article.industries.map((slug) => {
                  const industry = findIndustry(slug);
                  if (!industry) return null;
                  return (
                    <Link
                      key={slug}
                      href={mediaPath(locale, `/industry/${slug}`)}
                      className="ns-chip"
                    >
                      {taxonomyLabel(industry, locale)}
                    </Link>
                  );
                })}
              </div>
            </footer>
          </div>
        </article>

        {related.length ? (
          <section className="ns-section">
            <div className="ns-wrap">
              <div className="ns-section-head">
                <h2 className="ns-section-title">
                  {copy.moreIn(level1Node ? taxonomyLabel(level1Node, locale) : "Northstar")}
                </h2>
              </div>
              <ArticleGrid articles={related} locale={locale} />
            </div>
          </section>
        ) : null}

        <JsonLd data={mediaArticleJsonLd(article, author, locale)} />
      </MediaShell>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
