import type { Metadata } from "next";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { VideoCard } from "../components/VideoCard";
import { getVideos } from "../lib/videos";
import { getAuthor } from "../lib/authors";
import { mediaAlternates } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export function createVideosRoute(locale: MediaLocale) {
  const copy = t(locale);

  async function generateMetadata(): Promise<Metadata> {
    return {
      title: copy.videos,
      description: copy.videosDek,
      alternates: mediaAlternates(locale, "/videos"),
    };
  }

  async function Page() {
    const videos = getVideos();
    const authors = await Promise.all(
      videos.map((video) => (video.author ? getAuthor(video.author) : null))
    );

    return (
      <MediaShell locale={locale} mirrorPath="/videos">
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: copy.videos }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.videos}</p>
            <h1>{copy.videosTitle}</h1>
            <p className="ns-dek" style={{ marginTop: "0.5rem" }}>
              {copy.videosDek}
            </p>
          </div>
          {videos.length ? (
            <div className="ns-grid is-two">
              {videos.map((video, index) => (
                <VideoCard
                  key={`${video.youtubeId}-${index}`}
                  video={video}
                  author={authors[index]}
                  locale={locale}
                />
              ))}
            </div>
          ) : (
            <p className="ns-meta">{copy.emptyVideos}</p>
          )}
        </div>
      </MediaShell>
    );
  }

  return { generateMetadata, Page };
}
