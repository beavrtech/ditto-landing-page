// Northstar authors — file-based, independent from the Supabase `authors` table.
// Every article frontmatter `author` field must reference a slug in this list.

export interface MediaAuthor {
  slug: string;
  name: string;
  title: { en: string; fr: string };
  bio: { en: string; fr: string };
  /** Path under /public, e.g. "/media/authors/marie-lefevre.svg" */
  avatar: string;
  linkedin?: string;
  /** Optional bridge to the Ditto site author page at /en/authors/[slug]. */
  dittoAuthorSlug?: string;
}

export const MEDIA_AUTHORS: MediaAuthor[] = [
  {
    slug: "marie-lefevre",
    name: "Marie Lefèvre",
    title: {
      en: "QHSE & Compliance Editor",
      fr: "Rédactrice QHSE & Conformité",
    },
    bio: {
      en: "Marie spent ten years running QHSE programs in industrial mid-caps before turning to writing. She covers quality systems, workplace safety and the regulations that keep plant managers up at night.",
      fr: "Marie a piloté pendant dix ans des programmes QHSE dans des ETI industrielles avant de passer à l'écriture. Elle couvre les systèmes qualité, la sécurité au travail et les réglementations qui empêchent les directeurs de site de dormir.",
    },
    avatar: "/media/authors/marie-lefevre.svg",
    linkedin: "https://www.linkedin.com/company/trustditto",
  },
  {
    slug: "thomas-berger",
    name: "Thomas Berger",
    title: {
      en: "Sustainability & Supply Chain Editor",
      fr: "Rédacteur RSE & Supply Chain",
    },
    bio: {
      en: "Thomas writes about CSR reporting, carbon accounting and supply-chain regulation. Former sustainability consultant, he has filed more EcoVadis questionnaires than he cares to count.",
      fr: "Thomas écrit sur le reporting RSE, la comptabilité carbone et la réglementation des chaînes d'approvisionnement. Ancien consultant en développement durable, il a rempli plus de questionnaires EcoVadis qu'il ne veut bien l'admettre.",
    },
    avatar: "/media/authors/thomas-berger.svg",
    linkedin: "https://www.linkedin.com/company/trustditto",
  },
];

export function getAuthor(slug: string): MediaAuthor | null {
  return MEDIA_AUTHORS.find((a) => a.slug === slug) ?? null;
}
