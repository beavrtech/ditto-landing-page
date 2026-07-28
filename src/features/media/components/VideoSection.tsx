import { MEDIA_VIDEOS } from "../data/videos";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

export function VideoSection({ locale }: { locale: MediaLocale }) {
  const copy = t(locale);
  if (!MEDIA_VIDEOS.length) return null;

  return (
    <section className="ns-section">
      <div className="ns-wrap">
        <div className="ns-section-head">
          <h2 className="ns-section-title">{copy.videos}</h2>
        </div>
        <div className="ns-grid is-two">
          {MEDIA_VIDEOS.map((video, index) => (
            <div className="ns-video" key={`${video.youtubeId}-${index}`}>
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
              {video.description ? (
                <p className="ns-card-dek">{video.description[locale]}</p>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
