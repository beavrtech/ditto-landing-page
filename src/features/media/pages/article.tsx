import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs, type Crumb } from "../components/MediaBreadcrumbs";
import { Byline } from "../components/Byline";
import { ArticleActions } from "../components/ArticleActions";
import { ArticleGrid } from "../components/ArticleCard";
import { ArticleToc, ArticleTocCollapsible } from "../components/ArticleToc";
import { RailNewsletter } from "../components/RailNewsletter";
import { AuthorBio } from "../components/AuthorBio";
import { ReadingProgress } from "../components/ReadingProgress";
import { extractToc } from "../lib/toc";
import {
  getArticle,
  getArticleSlugs,
  getAllArticles,
  relatedArticles,
  toCards,
} from "../lib/articles";
import { renderArticleBody } from "../lib/mdx";
import { getAuthor } from "../lib/authors";
import { mediaAlternates, mediaUrl, SITE_URL } from "../lib/urls";
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
    const author = await getAuthor(article.author);
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

    const author = await getAuthor(article.author);
    if (!author) notFound();

    const themeSlugs = article.section;
    const chain = findTaxonomyPath(themeSlugs) ?? [];
    const crumbs: Crumb[] = chain.map((node, index) => ({
      name: taxonomyLabel(node, locale),
      path: `/theme/${themeSlugs.slice(0, index + 1).join("/")}`,
    }));
    crumbs.push({ name: article.title });

    const body = await renderArticleBody(article.body, locale);
    const toc = extractToc(article.body, locale);
    const all = await getAllArticles(locale);
    const related = relatedArticles(all, article);
    const level1Node = chain[0];

    return (
      <MediaShell locale={locale} mirrorPath={`/${slug}`}>
        <ReadingProgress />
        <MediaBreadcrumbs locale={locale} crumbs={crumbs} />

        <article>
          <header className="ns-wrap ns-article-head">
            {/* The theme trail is already the breadcrumb above, so the head
                only states the target industries. */}
            <p className="ns-article-industries">
              <span className="ns-kicker">{copy.industries}</span>{" "}
              {article.industries.length
                ? article.industries
                    .map((slug) => findIndustry(slug))
                    .filter(Boolean)
                    .map((industry) => taxonomyLabel(industry!, locale))
                    .join(", ")
                : copy.allIndustries}
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
            <ArticleActions
              locale={locale}
              url={mediaUrl(locale, `/${slug}`)}
              title={article.title}
            />
            <div className="ns-article-illustration">
              <Image
                src={article.illustration}
                alt={article.alt}
                width={1200}
                height={600}
                priority
              />
            </div>
          </header>

          <div className="ns-wrap ns-article-layout">
            <div className="ns-article-main">
              <ArticleTocCollapsible entries={toc} locale={locale} />
              <div className="ns-prose">{body}</div>

              {article.updated ? (
                <footer className="ns-article-foot">
                  <p className="ns-meta">
                    {copy.updatedOn} {article.updated}
                  </p>
                </footer>
              ) : null}

              <AuthorBio author={author} locale={locale} />
            </div>

            {/* The reading column is narrower than the page, so the rail fills
                space that was empty rather than taking any from the text. */}
            <aside className="ns-rail">
              <div className="ns-rail-sticky">
                <ArticleToc entries={toc} locale={locale} />
                <RailNewsletter locale={locale} />
              </div>
            </aside>
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
              <ArticleGrid articles={toCards(related)} locale={locale} />
            </div>
          </section>
        ) : null}

        <JsonLd data={mediaArticleJsonLd(article, author, locale)} />
      </MediaShell>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
