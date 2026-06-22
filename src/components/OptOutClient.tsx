"use client";

import { useEffect } from "react";
import posthog from "posthog-js";

export function OptOutClient() {
  useEffect(() => {
    localStorage.setItem("ditto_no_track", "1");
    // Also stop the current session if PostHog is already running.
    if (posthog.__loaded) {
      posthog.opt_out_capturing();
    }
  }, []);

  return (
    <div style={{ padding: "4rem 2rem", maxWidth: "40rem", margin: "0 auto", fontFamily: "inherit" }}>
      <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Analytics disabled</h1>
      <p style={{ color: "#555" }}>
        PostHog tracking is now permanently disabled on this browser. You won&apos;t
        be counted in product analytics going forward.
      </p>
      <p style={{ marginTop: "1rem", fontSize: "0.875rem", color: "#888" }}>
        To re-enable tracking, clear your browser&apos;s localStorage and revisit the site.
      </p>
    </div>
  );
}
