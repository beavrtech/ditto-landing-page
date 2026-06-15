"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

/**
 * Inline Cal.com booking embed for the pricing page.
 * Lets visitors book a 30-minute slot directly without leaving the page.
 */
export function PricingCalEmbed() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  return (
    <Cal
      namespace="30min"
      calLink="etienne-dejoie/30min"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{ layout: "month_view", theme: "light", useSlotsViewOnSmallScreen: "true" } as Record<string, string>}
    />
  );
}
