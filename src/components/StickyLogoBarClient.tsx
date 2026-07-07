"use client";

import { useEffect, useRef, useState } from "react";
import type { CustomerLogo } from "../lib/customer-logos";

export function StickyLogoBarClient({ logos }: { logos: CustomerLogo[] }) {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisible(true);

    const row = document.getElementById("customer-logos-primary-row");
    if (!row) return;

    let obs: IntersectionObserver | null = null;

    // Show the bar only while the first logo row is still BELOW the viewport.
    // The bar sits at the bottom, so we shrink the viewport's bottom edge up by
    // the bar's own height — the observer then fires the instant the row's top
    // crosses the bar's top edge. Once the row has scrolled above the viewport
    // (boundingClientRect.top <= 0) it is also non-intersecting, so we must
    // additionally require the row to be below us — otherwise the bar wrongly
    // reappears after you scroll past the logos.
    const attach = () => {
      obs?.disconnect();
      const barHeight = barRef.current?.offsetHeight ?? 0;
      obs = new IntersectionObserver(
        ([entry]) => setVisible(!entry.isIntersecting && entry.boundingClientRect.top > 0),
        { threshold: 0, rootMargin: `0px 0px -${barHeight}px 0px` }
      );
      obs.observe(row);
    };

    attach();
    window.addEventListener("resize", attach);

    return () => {
      obs?.disconnect();
      window.removeEventListener("resize", attach);
    };
  }, []);

  if (!logos.length) return null;

  return (
    <div ref={barRef} className={`sticky-logo-bar${visible ? " is-visible" : ""}`} aria-hidden="true">
      <div className="sticky-logo-bar_inner">
        {logos.map((logo) => (
          <div key={logo.name} className="sticky-logo-bar_wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.logo_url}
              alt={logo.name}
              className={`sticky-logo-bar_logo${logo.smaller ? " is-smaller" : ""}`}
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
