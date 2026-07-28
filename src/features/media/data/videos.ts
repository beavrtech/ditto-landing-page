// Videos shown on the Northstar home page — YouTube embeds declared here.
// Replace the placeholder IDs with real Ditto YouTube video IDs.

export interface MediaVideo {
  youtubeId: string;
  title: { en: string; fr: string };
  description?: { en: string; fr: string };
  publishedAt?: string;
}

export const MEDIA_VIDEOS: MediaVideo[] = [
  {
    youtubeId: "dQw4w9WgXcQ",
    title: {
      en: "CSRD in 12 minutes: what changes for mid-caps",
      fr: "La CSRD en 12 minutes : ce qui change pour les ETI",
    },
    description: {
      en: "A walkthrough of the double-materiality assessment and the first reporting deadlines.",
      fr: "Un tour d'horizon de l'analyse de double matérialité et des premières échéances de reporting.",
    },
    publishedAt: "2026-05-12",
  },
  {
    youtubeId: "dQw4w9WgXcQ",
    title: {
      en: "Inside an EcoVadis assessment",
      fr: "Dans les coulisses d'une évaluation EcoVadis",
    },
    description: {
      en: "How the scoring works, and where most companies lose points.",
      fr: "Comment fonctionne la notation, et où la plupart des entreprises perdent des points.",
    },
    publishedAt: "2026-06-03",
  },
];
