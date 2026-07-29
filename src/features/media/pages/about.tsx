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
    title: "What The Scope is",
    intro:
      "The Scope is a magazine for the people who own QHSE, CSR and supply-chain compliance in mid-sized companies. Usually that is one person, several frameworks, and no budget line. We write for that person.",
    body: [
      "Articles are long-form, edited and verified. Frameworks are named with their version and their date. Statistics are real or absent. Where a question is genuinely unsettled, we say so and present both sides; where the evidence supports a verdict, we give one. A piece that merely restates the official text does not run.",
      "The Scope is published by the team at Ditto, the compliance platform, and says so plainly. The articles sell nothing. The only thing we offer is a free newsletter subscription, one long read a month. We cover what practitioners have to deal with, whether or not Ditto sells anything for it, and that is what makes the coverage worth a busy person's lunch break.",
    ],
    newsletterLine: "The letter lives on the home page. That is the whole pitch.",
    homeLink: "Back to the magazine",
  },
  fr: {
    title: "Qui sommes-nous",
    intro:
      "The Scope est un magazine pour celles et ceux qui portent la conformité QHSE, RSE et supply chain dans les entreprises de taille intermédiaire. Le plus souvent, une personne, plusieurs référentiels, pas de ligne de budget. C'est pour cette personne que nous écrivons.",
    body: [
      "Les articles sont longs, édités et vérifiés. Chaque référentiel est nommé avec sa version et sa date. Les statistiques sont réelles ou absentes. Quand une question n'est pas tranchée, nous le disons et présentons les deux camps ; quand les faits permettent un verdict, nous le donnons. Un article qui se contente de reformuler le texte officiel ne paraît pas.",
      "The Scope est édité par l'équipe de Ditto, la plateforme de conformité, et le dit simplement. Les articles ne vendent rien. La seule chose que nous offrons est un abonnement gratuit à la newsletter, une lecture de fond par mois. Nous couvrons ce que les praticiens doivent traiter, que Ditto vende quelque chose pour cela ou non, et c'est ce qui rend la lecture digne de la pause déjeuner d'une personne occupée.",
    ],
    newsletterLine: "La lettre est sur la page d'accueil. C'est tout notre argumentaire.",
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
