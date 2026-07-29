import videos from "../../../../content/media/videos.json";
import type { MediaLocale } from "../data/taxonomy";

export interface MediaVideo {
  youtubeId: string;
  title: Record<MediaLocale, string>;
  description?: Record<MediaLocale, string>;
  publishedAt?: string;
  /** Slug from content/media/authors/, resolved by the caller. */
  author?: string;
}

interface RawVideo {
  youtubeId: string;
  publishedAt?: string;
  author?: string;
  en: { title: string; description?: string };
  fr: { title: string; description?: string };
}

/**
 * The list is a JSON file so it stays editable alongside the articles. It is
 * imported rather than read from disk, which keeps it usable from a client
 * component if the home page ever needs one.
 */
export function getVideos(): MediaVideo[] {
  return (videos as RawVideo[]).map((video, index) => {
    if (!video.youtubeId || !video.en?.title || !video.fr?.title) {
      throw new Error(
        `Invalid content/media/videos.json entry ${index}: youtubeId, en.title and fr.title are required.`
      );
    }
    return {
      youtubeId: video.youtubeId,
      publishedAt: video.publishedAt,
      author: video.author,
      title: { en: video.en.title, fr: video.fr.title },
      description:
        video.en.description && video.fr.description
          ? { en: video.en.description, fr: video.fr.description }
          : undefined,
    };
  });
}
