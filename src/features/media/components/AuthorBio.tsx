import Link from "next/link";
import Image from "next/image";
import type { MediaAuthor } from "../lib/authors";
import { mediaPath, SITE_URL } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/**
 * End of the article: who wrote this, and why they would know. The highest
 * intent moment on the page, so it names the person rather than tapering off.
 */
export function AuthorBio({
  author,
  locale,
}: {
  author: MediaAuthor;
  locale: MediaLocale;
}) {
  const copy = t(locale);
  return (
    <aside className="ns-author-bio">
      <p className="ns-kicker">{copy.writtenBy}</p>
      <div className="ns-author-bio-body">
        <span className="ns-avatar">
          <Image src={author.avatar} alt="" width={64} height={64} />
        </span>
        <div>
          <p className="ns-author-name">
            <Link href={mediaPath(locale, `/authors/${author.slug}`)}>{author.name}</Link>
            {author.invited ? <span className="ns-invited">{copy.byInvitation}</span> : null}
          </p>
          <p className="ns-meta">{author.title[locale]}</p>
          <p className="ns-card-dek" style={{ marginTop: "0.75rem" }}>
            {author.bio[locale]}
          </p>
          <p className="ns-meta ns-author-links">
            <Link href={mediaPath(locale, `/authors/${author.slug}`)}>{copy.allArticlesBy}</Link>
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
    </aside>
  );
}
