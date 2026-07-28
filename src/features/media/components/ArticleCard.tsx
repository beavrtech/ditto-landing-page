"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { CardArticle } from "../lib/articles";
import { matchesIndustry } from "../lib/industry-filter";
import { mediaPath } from "../lib/urls";
import { t, formatDate } from "../dictionary";
import {
  findTaxonomyPath,
  findIndustry,
  taxonomyLabel,
  type MediaLocale,
} from "../data/taxonomy";

export function ArticleCard({
  article,
  locale,
  showThumb = true,
}: {
  article: CardArticle;
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
          <Image src={article.illustration} alt="" width={600} height={400} />
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

interface GridProps {
  articles: CardArticle[];
  locale: MediaLocale;
  columns?: 2 | 3;
  /**
   * Whether `?industry=` narrows this grid. On for the home page and theme
   * pages; off on an industry page, which is already one industry, and on an
   * author page, where the list is the person's own work.
   */
  filterable?: boolean;
}

function Grid({ articles, locale, columns }: Omit<GridProps, "filterable">) {
  if (!articles.length) return null;
  return (
    <div className={columns === 2 ? "ns-grid is-two" : "ns-grid"}>
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} locale={locale} />
      ))}
    </div>
  );
}

function FilterableGrid({ articles, locale, columns }: Omit<GridProps, "filterable">) {
  const copy = t(locale);
  const router = useRouter();
  const pathname = usePathname();
  const industry = useSearchParams().get("industry");
  const node = industry ? findIndustry(industry) : null;

  // An unknown slug filters nothing rather than emptying the page.
  const shown = node ? articles.filter((a) => matchesIndustry(a.industries, industry)) : articles;

  return (
    <>
      {node ? (
        <p className="ns-filter-note">
          <span className="ns-kicker">{copy.industries}</span> {taxonomyLabel(node, locale)}
          {/* A button rather than a link: it drops the query string through the
              same router call the picker uses, so the two cannot disagree. */}
          <button
            type="button"
            className="ns-filter-clear"
            onClick={() => router.replace(pathname, { scroll: false })}
          >
            {copy.clearFilter}
          </button>
        </p>
      ) : null}
      {shown.length ? (
        <Grid articles={shown} locale={locale} columns={columns} />
      ) : (
        <p className="ns-empty">{node ? copy.emptyFiltered : copy.emptyTheme}</p>
      )}
    </>
  );
}

export function ArticleGrid({ articles, locale, columns = 3, filterable = false }: GridProps) {
  if (!filterable) {
    return articles.length ? (
      <Grid articles={articles} locale={locale} columns={columns} />
    ) : (
      <p className="ns-empty">{t(locale).emptyTheme}</p>
    );
  }
  // useSearchParams needs a boundary or the whole route drops out of static
  // rendering. The fallback is the unfiltered grid, which is also what gets
  // prerendered into the HTML.
  return (
    <Suspense
      fallback={
        articles.length ? (
          <Grid articles={articles} locale={locale} columns={columns} />
        ) : (
          <p className="ns-empty">{t(locale).emptyTheme}</p>
        )
      }
    >
      <FilterableGrid articles={articles} locale={locale} columns={columns} />
    </Suspense>
  );
}
