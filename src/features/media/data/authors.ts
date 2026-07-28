// Northstar authors — file-based, independent from the Supabase `authors` table,
// but kept in sync with it by hand: same slugs, titles and photos as the Ditto
// site, so a byline followed from either place lands on the same person.
// Every article frontmatter `author` field must reference a slug in this list.

export interface MediaAuthor {
  slug: string;
  name: string;
  title: { en: string; fr: string };
  bio: { en: string; fr: string };
  /** Path under /public, or an absolute URL on a host allowed in next.config.ts. */
  avatar: string;
  linkedin?: string;
  /** Bridge to the Ditto site author page at /[locale]/authors/[slug]. */
  dittoAuthorSlug?: string;
}

export const MEDIA_AUTHORS: MediaAuthor[] = [
  {
    slug: "pierre-poirmeur",
    name: "Pierre Poirmeur",
    title: {
      en: "Co-founder and CEO of Ditto",
      fr: "Cofondateur et PDG de Ditto",
    },
    bio: {
      en: "A graduate of HEC Paris, Pierre started his career in strategy consulting at BCG, where he spent five years. As co-founder and CEO of Ditto, he leads the teams building CSR and compliance solutions. He likes complex subjects, and likes making them accessible even more.",
      fr: "Diplômé d'HEC Paris, Pierre a débuté sa carrière dans le conseil en stratégie au BCG, où il a passé cinq ans. Cofondateur et PDG de Ditto, il dirige les équipes qui construisent les solutions RSE et conformité. Il aime les sujets complexes, et plus encore les rendre accessibles.",
    },
    avatar:
      "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/authors/pierre-poirmeur/picture_url.avif",
    linkedin: "https://www.linkedin.com/in/pierre-poirmeur-21036382/",
    dittoAuthorSlug: "pierre-poirmeur",
  },
  {
    slug: "alexis-de-taillac",
    name: "Alexis de Taillac",
    title: {
      en: "Head of Compliance",
      fr: "Head of Compliance",
    },
    bio: {
      en: "A graduate of CentraleSupélec, Alexis spent the first years of his career building products and services in an innovation studio, then set up the CSRD practice at the R3 firm. At Ditto he runs the expertise team, and in particular the work of bringing frameworks into the platform.",
      fr: "Diplômé de CentraleSupélec, Alexis a passé les premières années de sa carrière à créer des produits et services au sein d'un studio d'innovation, puis a monté la practice CSRD du cabinet R3. Chez Ditto, il dirige l'équipe expertise, et en particulier l'intégration des référentiels dans la plateforme.",
    },
    avatar:
      "https://xrbgrzbifkchbjimewvu.supabase.co/storage/v1/object/public/cms-images/authors/alexis-de-taillac/picture_url.jpeg",
    linkedin: "https://www.linkedin.com/in/alexis-bartouilh-de-taillac/",
    dittoAuthorSlug: "alexis-de-taillac",
  },
];

export function getAuthor(slug: string): MediaAuthor | null {
  return MEDIA_AUTHORS.find((a) => a.slug === slug) ?? null;
}
