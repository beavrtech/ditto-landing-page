"use client";

import { useEffect } from "react";

const AXEPTIO_CLIENT_ID = "6762d00c63ed24aafd12ea23";

/**
 * Loads the Axeptio consent widget. The cookies version is per-locale
 * ("ditto-fr-EU" / "ditto-en-EU") — both versions must exist and be
 * published in the Axeptio project.
 */
export function AxeptioConsent({ locale }: { locale: string }) {
  useEffect(() => {
    if (document.getElementById("axeptio-sdk")) return;

    (window as unknown as Record<string, unknown>).axeptioSettings = {
      clientId: AXEPTIO_CLIENT_ID,
      cookiesVersion: `ditto-${locale}-EU`,
      googleConsentMode: {
        default: {
          analytics_storage: "denied",
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          wait_for_update: 500,
        },
      },
    };

    const script = document.createElement("script");
    script.id = "axeptio-sdk";
    script.async = true;
    script.src = "//static.axept.io/sdk.js";
    document.head.appendChild(script);
  }, [locale]);

  return null;
}

/**
 * Registers a callback fired with the user's vendor choices whenever
 * Axeptio consent is known (on load with saved choices, and on change).
 */
export function onAxeptioConsent(
  callback: (choices: Record<string, boolean>) => void
) {
  const w = window as unknown as { _axcb?: unknown[] };
  w._axcb = w._axcb || [];
  w._axcb.push((axeptio: { on: (event: string, cb: (c: Record<string, boolean>) => void) => void }) => {
    axeptio.on("cookies:complete", callback);
  });
}
