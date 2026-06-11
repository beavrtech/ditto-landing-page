"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { onAxeptioConsent } from "./AxeptioConsent";

/**
 * Initializes PostHog in cookieless mode (memory persistence) so it can
 * run without consent; upgrades to cookie persistence only if the visitor
 * accepts the "posthog" vendor in the Axeptio banner.
 */
export function PostHogInit() {
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token || posthog.__loaded) return;

    posthog.init(token, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      defaults: "2026-01-30",
      persistence: "memory",
    });

    onAxeptioConsent((choices) => {
      if (choices.posthog) {
        posthog.set_config({ persistence: "localStorage+cookie" });
      }
    });
  }, []);

  return null;
}
