import type { Metadata } from "next";
import Link from "next/link";
import { MediaShell } from "../components/MediaShell";
import { MediaBreadcrumbs } from "../components/MediaBreadcrumbs";
import { AuthorsSection } from "../components/AuthorsSection";
import { mediaAlternates, mediaPath } from "../lib/urls";
import { t } from "../dictionary";
import type { MediaLocale } from "../data/taxonomy";

const about = {
  en: {
    title: "What Northstar is",
    intro:
      "Northstar is a magazine for the people who own QHSE, CSR and supply-chain compliance inside mid-sized companies. Often that is one person, juggling several frameworks at once, accountable to clients, buyers and auditors. We write for that person.",
    body: [
      "Articles are long-form, edited and verified. We name the version of every framework we describe and the date it was true, we never invent a statistic, and when something is contested we say so. If a piece only restates the official text, we do not publish it.",
      "Northstar is published by the team at Ditto, the compliance platform, and says so plainly. The articles themselves do not sell anything: the only thing we ever ask of a reader is a newsletter subscription. We cover what practitioners have to deal with, whether or not Ditto has a product for it.",
    ],
    newsletterLine: "The best way to follow along is the monthly letter, on the home page.",
    homeLink: "Back to the magazine",
  },
  fr: {
    title: "Qui sommes-nous",
    intro:
      "Northstar est un magazine pour celles et ceux qui portent la conformité QHSE, RSE et supply chain dans les entreprises de taille intermédiaire. Souvent une seule personne, qui jongle avec plusieurs référentiels à la fois, comptable devant ses clients, ses donneurs d'ordre et ses auditeurs. C'est pour cette personne que nous écrivons.",
    body: [
      "Les articles sont longs, édités et vérifiés. Nous nommons la version de chaque référentiel décrit et la date à laquelle c'était vrai, nous n'inventons jamais une statistique, et quand un sujet est contesté nous le disons. Un article qui ne fait que reformuler le texte officiel n'est pas publié.",
      "Northstar est édité par l'équipe de Ditto, la plateforme de conformité, et le dit simplement. Les articles eux-mêmes ne vendent rien : la seule chose que nous demandons à un lecteur est un abonnement à la newsletter. Nous couvrons ce que les praticiens doivent traiter, que Ditto ait un produit pour cela ou non.",
    ],
    newsletterLine: "La meilleure façon de nous suivre est la lettre mensuelle, sur la page d'accueil.",
    homeLink: "Retour au magazine",
  },
} as const;

export function createAboutRoute(locale: MediaLocale) {
  const copy = t(locale);
  const page = about[locale];

  async function generateMetadata(): Promise<Metadata> {
    return {
      title: copy.aboutUs,
      description: page.intro,
      alternates: mediaAlternates(locale, "/about"),
    };
  }

  async function Page() {
    return (
      <MediaShell locale={locale} mirrorPath="/about">
        <MediaBreadcrumbs locale={locale} crumbs={[{ name: copy.aboutUs }]} />
        <div className="ns-wrap">
          <div className="ns-page-head">
            <p className="ns-kicker">{copy.aboutUs}</p>
            <h1>{page.title}</h1>
            <p className="ns-dek">{page.intro}</p>
          </div>
          <div className="ns-about-body">
            {page.body.map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
            <p>
              {page.newsletterLine} <Link href={mediaPath(locale)}>{page.homeLink}</Link>
            </p>
          </div>
        </div>
        <AuthorsSection locale={locale} />
      </MediaShell>
    );
  }

  return { generateMetadata, Page };
}
