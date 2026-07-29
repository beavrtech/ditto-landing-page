import Link from "next/link";
import Image from "next/image";
import type { MediaAuthor } from "../lib/authors";
import { mediaPath } from "../lib/urls";
import { t, formatDate } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export function Byline({
  author,
  locale,
  date,
  readTimeMinutes,
}: {
  author: MediaAuthor;
  locale: MediaLocale;
  date: string;
  readTimeMinutes: number;
}) {
  const copy = t(locale);
  return (
    <div className="ns-byline">
      <span className="ns-avatar is-small">
        <Image src={author.avatar} alt="" width={40} height={40} />
      </span>
      <span>
        <Link href={mediaPath(locale, `/authors/${author.slug}`)}>{author.name}</Link>
        {author.invited ? <span className="ns-invited">{copy.byInvitation}</span> : null}
        <span className="ns-byline-meta">
          <span className="ns-dot" />
          {formatDate(date, locale)}
          <span className="ns-dot" />
          {copy.readTime(readTimeMinutes)}
        </span>
      </span>
    </div>
  );
}
