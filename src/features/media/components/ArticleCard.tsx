import Link from "next/link";
import Image from "next/image";
import type { Article } from "../lib/articles";
import { mediaPath } from "../lib/urls";
import { t, formatDate } from "../dictionary";
import { findTaxonomyPath, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

export function ArticleCard({
  article,
  locale,
  showThumb = true,
}: {
  article: Article;
  locale: MediaLocale;
  showThumb?: boolean;
}) {
  const copy = t(locale);
  const chain = findTaxonomyPath(article.section.slice(0, 2));
  const kicker = chain ? chain.map((n) => taxonomyLabel(n, locale)).join(" · ") : "";

  return (
    <article className="ns-card">
      {showThumb ? (
        <Link href={mediaPath(locale, `/${article.slug}`)} className="ns-card-thumb" tabIndex={-1} aria-hidden>
          <Image
            src={article.illustration}
            alt=""
            width={600}
            height={400}
          />
        </Link>
      ) : null}
      <p className="ns-kicker">{kicker}</p>
      <h3 className="ns-card-title">
        <Link href={mediaPath(locale, `/${article.slug}`)}>{article.title}</Link>
      </h3>
      <p className="ns-card-dek">{article.description}</p>
      <p className="ns-meta">
        {formatDate(article.date, locale)}
        <span className="ns-dot" />
        {copy.readTime(article.readTimeMinutes)}
      </p>
    </article>
  );
}

export function ArticleGrid({
  articles,
  locale,
  columns = 3,
}: {
  articles: Article[];
  locale: MediaLocale;
  columns?: 2 | 3;
}) {
  const copy = t(locale);
  if (!articles.length) {
    return <p className="ns-empty">{copy.emptyTheme}</p>;
  }
  return (
    <div className={columns === 2 ? "ns-grid is-two" : "ns-grid"}>
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} locale={locale} />
      ))}
    </div>
  );
}
