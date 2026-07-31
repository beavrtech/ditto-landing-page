import type { ReactNode } from "react";
import Image from "next/image";
import { JsonLd } from "@/components/JsonLd";
import { faqJsonLd } from "../../lib/jsonld";
import type { MediaLocale } from "../../data/taxonomy";

export function KeyTakeaways({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="ns-takeaways">
      <p className="ns-takeaways-title">{title ?? "Key takeaways"}</p>
      {children}
    </aside>
  );
}

export function PullQuote({
  children,
  attribution,
}: {
  children: ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="ns-pullquote">
      <blockquote style={{ border: "none", padding: 0, margin: 0 }}>{children}</blockquote>
      {attribution ? (
        <figcaption className="ns-pullquote-attribution">{attribution}</figcaption>
      ) : null}
    </figure>
  );
}

export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Visible Q&A plus FAQPage structured data. Answers are plain strings on
 * purpose: schema.org answers must be self-contained text, and keeping them as
 * strings means what is marked up is exactly what is rendered.
 */
export function FAQ({ title, items }: { title?: string; items: FaqEntry[] }) {
  if (!items?.length) return null;
  return (
    <section className="ns-faq">
      {/* Fixed id: this heading never passes through rehype-slug. */}
      <h2 id="faq">{title ?? "FAQ"}</h2>
      {items.map((item) => (
        <div className="ns-faq-item" key={item.question}>
          <p className="ns-faq-q">{item.question}</p>
          <p className="ns-faq-a">{item.answer}</p>
        </div>
      ))}
      <JsonLd data={faqJsonLd(items)} />
    </section>
  );
}

export function ArticleImage({
  src,
  alt,
  caption,
  width = 1200,
  height = 800,
  chart = false,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  /**
   * A data chart rather than a photograph or diagram: sits in a narrower
   * centered column, the way a newspaper sets one beside its text.
   */
  chart?: boolean;
}) {
  return (
    <figure className={chart ? "ns-figure ns-figure-chart" : "ns-figure"}>
      {/* SVG figures are static assets; the optimizer rejects them without dangerouslyAllowSVG. */}
      <Image src={src} alt={alt} width={width} height={height} unoptimized={src.endsWith(".svg")} />
      {caption ? <figcaption className="ns-figcaption">{caption}</figcaption> : null}
    </figure>
  );
}

export function YouTube({ id, title }: { id: string; title: string }) {
  return (
    <figure className="ns-figure">
      <div className="ns-video-frame">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}`}
          title={title}
          loading="lazy"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <figcaption className="ns-figcaption">{title}</figcaption>
    </figure>
  );
}

function Table({ children }: { children?: ReactNode }) {
  return (
    <div className="ns-table-wrap">
      <table>{children}</table>
    </div>
  );
}

// locale is threaded through for components that will need it (dates, labels).
export function mdxComponents(locale: MediaLocale) {
  void locale;
  return {
    KeyTakeaways,
    PullQuote,
    FAQ,
    ArticleImage,
    YouTube,
    table: Table,
  };
}
