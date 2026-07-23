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

/** Server wrapper: fetches published mentions, emits JSON-LD, and renders the press mentions grid. */
export async function PressMentions({ locale }: { locale: string }) {
  const mentions = ((await getPressMentions().catch(() => [])) ?? []) as PressMention[];

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
