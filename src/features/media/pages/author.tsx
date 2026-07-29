import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { ArticleGrid } from "../components/ArticleCard";
import { getAllArticles, toCards } from "../lib/articles";
import { getAuthor, getAuthorSlugs } from "../lib/authors";
import { authorProfileJsonLd, articleItemListJsonLd } from "../lib/jsonld";
import { mediaAlternates, SITE_URL } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

type Params = { params: Promise<{ slug: string }> };

export function createAuthorRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateStaticParams() {
    return (await getAuthorSlugs()).map((slug) => ({ slug }));
  }

  async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { slug } = await params;
    const author = await getAuthor(slug);
    if (!author) return {};
    return {
      title: author.name,
      description: author.bio[locale],
      alternates: mediaAlternates(locale, `/authors/${slug}`),
    };
  }

  async function Page({ params }: Params) {
    const { slug } = await params;
    const author = await getAuthor(slug);
    if (!author) notFound();

    const articles = (await getAllArticles(locale)).filter((a) => a.author === slug);

    return (
      <MediaShell locale={locale} mirrorPath={`/authors/${slug}`}>
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: author.name }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
              <span className="ns-avatar">
                <Image src={author.avatar} alt="" width={64} height={64} />
              </span>
              <div>
                <p className="ns-kicker">{author.invited ? copy.byInvitation : copy.authors}</p>
                <h1>{author.name}</h1>
                <p className="ns-meta" style={{ marginTop: "0.5rem" }}>
                  {author.title[locale]}
                </p>
                <p className="ns-meta ns-author-links">
                  {author.website ? (
                    <a href={author.website} rel="noopener noreferrer" target="_blank">
                      {copy.website}
                    </a>
                  ) : null}
                  {author.linkedin ? (
                    <a href={author.linkedin} rel="noopener noreferrer" target="_blank">
                      LinkedIn
                    </a>
                  ) : null}
                  {author.dittoAuthorSlug ? (
                    <a
                      href={`${SITE_URL}/${locale}/authors/${author.dittoAuthorSlug}`}
                      rel="noopener noreferrer"
                    >
                      {copy.profileOnDitto}
                    </a>
                  ) : null}
                </p>
              </div>
            </div>
            <p className="ns-bio">{author.bio[locale]}</p>
          </div>
          <ArticleGrid articles={toCards(articles)} locale={locale} />
        </div>
        <JsonLd data={authorProfileJsonLd(author, locale)} />
        {articles.length ? (
          <JsonLd data={articleItemListJsonLd(articles, locale, author.name)} />
        ) : null}
      </MediaShell>
    );
  }

  return { generateStaticParams, generateMetadata, Page };
}
