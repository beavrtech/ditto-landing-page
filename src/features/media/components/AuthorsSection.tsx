import Link from "next/link";
import Image from "next/image";
import { MEDIA_AUTHORS } from "../data/authors";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export function AuthorsSection({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  return (
    <section className="ns-section" id="authors">
      <div className="ns-wrap">
        <div className="ns-section-head">
          <h2 className="ns-section-title">{copy.authors}</h2>
        </div>
        <div className="ns-grid is-two">
          {MEDIA_AUTHORS.map((author) => (
            <div className="ns-author-card" key={author.slug}>
              <span className="ns-avatar">
                <Image src={author.avatar} alt="" width={64} height={64} />
              </span>
              <div>
                <p className="ns-author-name">
                  <Link href={mediaPath(locale, `/authors/${author.slug}`)}>{author.name}</Link>
                </p>
                <p className="ns-meta">{author.title[locale]}</p>
                <p className="ns-card-dek" style={{ marginTop: "0.5rem" }}>
                  {author.bio[locale]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
