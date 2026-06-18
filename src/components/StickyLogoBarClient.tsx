"use client";

import { useEffect, useState } from "react";

type Logo = { id: string; name: string | null; logo_url: string };

export function StickyLogoBarClient({ logos }: { logos: Logo[] }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);

    const stripObs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );

    const strip = document.getElementById("logostrip-anchor");
    if (strip) stripObs.observe(strip);

    return () => stripObs.disconnect();
  }, []);

  if (!logos.length) return null;

  return (
    <div className={`sticky-logo-bar${visible ? " is-visible" : ""}`} aria-hidden="true">
      {logos.map((logo) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={logo.id}
          src={logo.logo_url}
          alt={logo.name ?? ""}
          className="sticky-logo-bar_logo"
          loading="lazy"
        />
      ))}
    </div>
  );
}
