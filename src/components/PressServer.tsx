import Image from "next/image";
import { getPressMentions } from "../lib/cms";
import { JsonLd, pressMentionsJsonLd } from "./JsonLd";
import { DEVLINK_SCOPE_CLASS } from "../../devlink/devlinkScope";

export type PressMention = {
  id?: string;
  outlet_name: string;
  outlet_logo_url?: string | null;
  article_title: string;
  article_url: string;
  article_language: "en" | "fr" | string;
  published_date: string;
  excerpt?: string | null;
};

/**
 * Hardcoded fallback, in the exact shape getPressMentions() returns.
 *
 * The `press_mentions` table doesn't exist in the live database yet --
 * the migration that creates it (supabase/migrations/0003_press_mentions.sql)
 * is pending Etienne's approval. Until it's applied (or once applied but
 * still empty), these 2 known articles keep the page live; real CMS rows
 * take over automatically the moment the table exists and has published rows.
 */
const FALLBACK_PRESS_MENTIONS: PressMention[] = [
  {
    id: "fallback-mediavenir",
    outlet_name: "Mediavenir",
    outlet_logo_url: null,
    article_title:
      "La nouvelle pression des grands groupes oblige leurs fournisseurs à prouver qu'ils font bien",
    article_url:
      "https://www.mediavenir.fr/la-nouvelle-pression-des-grands-groupes-oblige-leurs-fournisseurs-a-prouver-quils-font-bien/",
    article_language: "fr",
    published_date: "2026-07-22",
    excerpt: null,
  },
  {
    id: "fallback-lememento",
    outlet_name: "Le Mémento",
    outlet_logo_url: null,
    article_title:
      "Entreprises : la preuve des engagements RSE devient un critère de sélection des fournisseurs",
    article_url:
      "https://www.memento.fr/memento-paris/article_22-07-2026-entreprises-la-preuve-des-engagements-rse-devient-un-critere-de-selection-des-fournisseurs",
    article_language: "fr",
    published_date: "2026-07-22",
    excerpt: null,
  },
];

function formatMentionDate(dateStr: string, locale: string): string {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function PressMentionCard({ mention, locale }: { mention: PressMention; locale: string }) {
  return (
    <div className="blog_list_item" role="listitem">
      <a
        href={mention.article_url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-image w-inline-block"
      >
        <div className="card-image_content">
          {mention.outlet_logo_url ? (
            <Image
              src={mention.outlet_logo_url}
              alt={mention.outlet_name}
              width={140}
              height={32}
              style={{ height: "1.5rem", width: "auto", objectFit: "contain" }}
            />
          ) : (
            <p className="label">{mention.outlet_name}</p>
          )}
          <div className="spacer-0x75rem" />
          <p className="text-size-1rem text-color-neutral">
            {formatMentionDate(mention.published_date, locale)}
            {" · "}
            {mention.article_language.toUpperCase()}
          </p>
          <div className="spacer-0x75rem" />
          <p className="heading-size-2rem text-style-3lines">{mention.article_title}</p>
          {mention.excerpt && (
            <>
              <div className="spacer-0x75rem" />
              <p className="text-size-1rem text-style-3lines">{mention.excerpt}</p>
            </>
          )}
        </div>
      </a>
    </div>
  );
}

/** Fetches published press mentions, falling back to the 2 seed articles when empty/errored. */
export async function getPressMentionsOrFallback(): Promise<PressMention[]> {
  const mentions = await getPressMentions().catch(() => []);
  return mentions && mentions.length > 0 ? (mentions as PressMention[]) : FALLBACK_PRESS_MENTIONS;
}

/** Server wrapper: fetches (with fallback), emits JSON-LD, and renders the press mentions grid. */
export async function PressMentions({ locale }: { locale: string }) {
  const mentions = await getPressMentionsOrFallback();

  return (
    <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
      <JsonLd data={pressMentionsJsonLd(mentions, locale)} />
      <section className="blog-preview_section">
        <div className="padding-global">
          <div className="container-80rem">
            <div className="blog_list_wrapper">
              <div className="blog_list" role="list">
                {mentions.map((mention) => (
                  <PressMentionCard key={mention.id || mention.article_url} mention={mention} locale={locale} />
                ))}
              </div>
            </div>
          </div>
          <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
        </div>
        <div className="layer-4">
          <div data-wf--background--color="primary" className="background" />
        </div>
      </section>
    </div>
  );
}
