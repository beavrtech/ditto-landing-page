import { getAllAuthors } from "../lib/authors";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";
import { AuthorsCarousel } from "./AuthorsCarousel";
import type { MediaLocale } from "../data/taxonomy";

export async function AuthorsSection({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const authors = await getAllAuthors();
  return (
    <section className="ns-section" id="authors">
      <div className="ns-wrap">
        <div className="ns-section-head">
          <h2 className="ns-section-title">{copy.authors}</h2>
        </div>
        <AuthorsCarousel
          labels={{ previous: copy.previousAuthors, next: copy.nextAuthors }}
          authors={authors.map((author) => ({
            slug: author.slug,
            href: mediaPath(locale, `/authors/${author.slug}`),
            name: author.name,
            title: author.title[locale],
            bio: author.bio[locale],
            avatar: author.avatar,
          }))}
        />
      </div>
    </section>
  );
}
