import Link from "next/link";
import { getVideos } from "../lib/videos";
import { getAuthor } from "../lib/authors";
import { VideoCard } from "./VideoCard";
import { mediaPath } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

/** How many of the videos the home page carries; the rest live on /media/videos. */
const ON_HOME = 2;

export async function VideoSection({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  const videos = getVideos();
  if (!videos.length) return null;

  const shown = videos.slice(0, ON_HOME);
  const authors = await Promise.all(
    shown.map((video) => (video.author ? getAuthor(video.author) : null))
  );

  return (
    <section className="ns-section">
      <div className="ns-wrap">
        <div className="ns-section-head">
          <h2 className="ns-section-title">{copy.videos}</h2>
          {videos.length > ON_HOME ? (
            <Link className="ns-section-link" href={mediaPath(locale, "/videos")}>
              {copy.allVideos}
            </Link>
          ) : null}
        </div>
        <div className="ns-grid is-two">
          {shown.map((video, index) => (
            <VideoCard
              key={`${video.youtubeId}-${index}`}
              video={video}
              author={authors[index]}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
