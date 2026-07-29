"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleGrid } from "./ArticleCard";
import type { CardArticle } from "../lib/articles";
import type { MediaLocale } from "../data/taxonomy";

/**
 * The home page article list.
 *
 * Unfiltered it skips the newest article, which is already the hero above.
 * With `?industry=` active it considers every article, hero included:
 * otherwise filtering to an industry could report "nothing here" while an
 * article from that industry sat in the hero.
 */
function Feed({ cards, locale }: { cards: CardArticle[]; locale: MediaLocale }) {
  const filtered = Boolean(useSearchParams().get("industry"));
  return <ArticleGrid articles={filtered ? cards : cards.slice(1)} locale={locale} filterable />;
}

export function HomeFeed({ cards, locale }: { cards: CardArticle[]; locale: MediaLocale }) {
  return (
    <Suspense fallback={<ArticleGrid articles={cards.slice(1)} locale={locale} />}>
      <Feed cards={cards} locale={locale} />
    </Suspense>
  );
}
