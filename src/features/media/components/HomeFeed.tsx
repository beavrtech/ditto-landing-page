"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleGrid } from "./ArticleCard";
import { ARTICLES_PER_PAGE } from "../lib/pagination";
import type { CardArticle } from "../lib/articles";
import type { MediaLocale } from "../data/taxonomy";

/**
 * The home page article list: a taste, not the archive (that is /articles).
 *
 * Unfiltered it skips the newest article, which is already the hero above,
 * and stops after one page's worth of cards. With `?industry=` active it
 * considers every article, hero included and no cap: otherwise filtering to
 * an industry could report "nothing here" while a matching article sat in
 * the hero or beyond the cut.
 */
function Feed({ cards, locale }: { cards: CardArticle[]; locale: MediaLocale }) {
  const filtered = Boolean(useSearchParams().get("industry"));
  return (
    <ArticleGrid
      articles={filtered ? cards : cards.slice(1, ARTICLES_PER_PAGE + 1)}
      locale={locale}
      filterable
    />
  );
}

export function HomeFeed({ cards, locale }: { cards: CardArticle[]; locale: MediaLocale }) {
  return (
    <Suspense
      fallback={<ArticleGrid articles={cards.slice(1, ARTICLES_PER_PAGE + 1)} locale={locale} />}
    >
      <Feed cards={cards} locale={locale} />
    </Suspense>
  );
}
