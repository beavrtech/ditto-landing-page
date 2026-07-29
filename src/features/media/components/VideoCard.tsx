import Link from "next/link";
import type { MediaVideo } from "../lib/videos";
import type { MediaAuthor } from "../lib/authors";
import { mediaPath } from "../lib/urls";
import { formatDate } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/**
 * One embed, its title and dek, and who presents it. Shared by the home page
 * section and the videos index so the two never drift apart.
 */
export function VideoCard({
  video,
  author,
  locale,
}: {
  video: MediaVideo;
  author: MediaAuthor | null;
  locale: MediaLocale;
}) {
  return (
    <div className="ns-video">
      <div className="ns-video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title[locale]}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <h3 className="ns-card-title">{video.title[locale]}</h3>
      {video.description ? <p className="ns-card-dek">{video.description[locale]}</p> : null}
      {author ? (
        <p className="ns-meta">
          <Link href={mediaPath(locale, `/authors/${author.slug}`)}>{author.name}</Link>
          {video.publishedAt ? <> · {formatDate(video.publishedAt, locale)}</> : null}
        </p>
      ) : null}
    </div>
  );
}
