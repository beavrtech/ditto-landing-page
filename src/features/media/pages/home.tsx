import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { MediaShell } from "../components/MediaShell";
import { ThemeSelector } from "../components/ThemeSelector";
import { ArticleGrid } from "../components/ArticleCard";
import { NewsletterBox } from "../components/NewsletterBox";
import { VideoSection } from "../components/VideoSection";
import { AuthorsSection } from "../components/AuthorsSection";
import { Byline } from "../components/Byline";
import { getAllArticles, filterByTheme } from "../lib/articles";
import { getAuthor } from "../data/authors";
import { mediaPath } from "../lib/urls";
import { mediaAlternates } from "../lib/urls";
import { t } from "../dictionary";
import { TAXONOMY, taxonomyLabel, type MediaLocale } from "../data/taxonomy";

export function createHomeRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateMetadata(): Promise<Metadata> {
    return {
      title:
        locale === "fr"
          ? "Northstar — le média QHSE, RSE & Supply Chain par Ditto"
          : "Northstar — the QHSE, CSR & Supply Chain magazine by Ditto",
      description: copy.tagline,
      alternates: mediaAlternates(locale, ""),
    };
  }

  async function Page() {
    const articles = await getAllArticles(locale);
    const [latest, ...rest] = articles;
    const latestAuthor = latest ? getAuthor(latest.author) : null;

    const tabs = TAXONOMY.map((node) => ({
      slug: node.slug,
      label: taxonomyLabel(node, locale),
      panel: (
        <>
          <ArticleGrid articles={filterByTheme(articles, [node.slug]).slice(0, 6)} locale={locale} />
          <p className="ns-tab-footer">
            <Link href={mediaPath(locale, `/theme/${node.slug}`)}>
              {copy.allArticles} · {taxonomyLabel(node, locale)}
            </Link>
          </p>
        </>
      ),
    }));

    return (
      <MediaShell locale={locale} mirrorPath="">
        <section className="ns-wrap">
          <div className="ns-hero">
            {latest ? (
              <div className="ns-hero-lede">
                <p className="ns-kicker">{copy.latest}</p>
                <Link
                  href={mediaPath(locale, `/${latest.slug}`)}
                  className="ns-hero-illustration"
                  aria-hidden
                  tabIndex={-1}
                >
                  <Image src={latest.illustration} alt="" width={900} height={600} priority />
                </Link>
                <h1 className="ns-hero-title">
                  <Link href={mediaPath(locale, `/${latest.slug}`)}>{latest.title}</Link>
                </h1>
                <p className="ns-dek">{latest.description}</p>
                {latestAuthor ? (
                  <div style={{ marginTop: "1.5rem" }}>
                    <Byline
                      author={latestAuthor}
                      locale={locale}
                      date={latest.date}
                      readTimeMinutes={latest.readTimeMinutes}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div />
            )}
            <NewsletterBox locale={locale} />
          </div>
        </section>

        {rest.length ? (
          <section className="ns-section">
            <div className="ns-wrap">
              <div className="ns-section-head">
                <h2 className="ns-section-title">{copy.allArticles}</h2>
              </div>
              <ArticleGrid articles={rest.slice(0, 6)} locale={locale} />
            </div>
          </section>
        ) : null}

        <section className="ns-section">
          <div className="ns-wrap">
            <div className="ns-section-head">
              <h2 className="ns-section-title">{copy.themes}</h2>
            </div>
            <ThemeSelector tabs={tabs} />
          </div>
        </section>

        <VideoSection locale={locale} />
        <AuthorsSection locale={locale} />
      </MediaShell>
    );
  }

  return { generateMetadata, Page };
}
