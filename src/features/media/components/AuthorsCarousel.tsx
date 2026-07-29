"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface AuthorSlide {
  slug: string;
  href: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

/**
 * Two authors at a time, the next one half-visible and fading out at the edge so
 * the row reads as continuing rather than ending. Arrows appear only on the side
 * there is something to scroll to.
 *
 * Native scroll with snap points does the work: the arrows nudge scrollLeft and
 * the browser animates, which keeps the track usable by touch, trackpad and
 * keyboard even before this component hydrates.
 */
export function AuthorsCarousel({
  authors,
  labels,
}: {
  authors: AuthorSlide[];
  labels: { previous: string; next: string };
}) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    // A slack of one pixel: fractional scroll widths never land exactly on the end.
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  const step = (direction: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    // One card per press, so the half-visible one becomes the one you read next.
    const distance = card ? card.getBoundingClientRect().width : el.clientWidth / 2;
    // An explicit behavior wins over the CSS scroll-behavior property, so the
    // reduced-motion preference has to be read here rather than in a media query.
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * distance, behavior: still ? "auto" : "smooth" });
  };

  return (
    <div className="ns-carousel" data-at-start={atStart} data-at-end={atEnd}>
      <ul className="ns-carousel-track" ref={track} onScroll={sync}>
        {authors.map((author) => (
          <li className="ns-author-card" key={author.slug}>
            <span className="ns-avatar">
              <Image src={author.avatar} alt="" width={64} height={64} />
            </span>
            <div>
              <p className="ns-author-name">
                <Link href={author.href}>{author.name}</Link>
              </p>
              <p className="ns-meta">{author.title}</p>
              <p className="ns-card-dek" style={{ marginTop: "0.5rem" }}>
                {author.bio}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <div className="ns-carousel-nav">
        <button
          type="button"
          className="ns-carousel-arrow"
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label={labels.previous}
        >
          <Arrow direction="left" />
        </button>
        <button
          type="button"
          className="ns-carousel-arrow"
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label={labels.next}
        >
          <Arrow direction="right" />
        </button>
      </div>
    </div>
  );
}

function Arrow({ direction }: { direction: "left" | "right" }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        d={direction === "right" ? "M4 12h15M13 6l6 6-6 6" : "M20 12H5M11 6l-6 6 6 6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}
