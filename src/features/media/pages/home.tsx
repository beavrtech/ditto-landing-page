import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { MediaShell } from "../components/MediaShell";
import { HomeFeed } from "../components/HomeFeed";
import { NewsletterBox } from "../components/NewsletterBox";
import { VideoSection } from "../components/VideoSection";
import { AuthorsSection } from "../components/AuthorsSection";
import { Byline } from "../components/Byline";
import { getAllArticles, toCards } from "../lib/articles";
import { ARTICLES_PER_PAGE } from "../lib/pagination";
import { getAuthor } from "../lib/authors";
import { mediaPath, mediaAlternates, mediaUrl } from "../lib/urls";
import { articleCollectionJsonLd } from "../lib/jsonld";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

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
    const [latest] = articles;
    const latestAuthor = latest ? await getAuthor(latest.author) : null;

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

        {articles.length ? (
          <section className="ns-section">
            <div className="ns-wrap">
              <div className="ns-section-head">
                <h2 className="ns-section-title">{copy.latestArticles}</h2>
                {articles.length > ARTICLES_PER_PAGE + 1 ? (
                  <Link className="ns-section-link" href={mediaPath(locale, "/articles")}>
                    {copy.allArticles}
                  </Link>
                ) : null}
              </div>
              <HomeFeed cards={toCards(articles)} locale={locale} />
            </div>
          </section>
        ) : null}

        <VideoSection locale={locale} />
        <AuthorsSection locale={locale} />
        <JsonLd
          data={articleCollectionJsonLd({
            url: mediaUrl(locale),
            name: "Northstar",
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
