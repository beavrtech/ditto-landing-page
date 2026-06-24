"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";
import { sha256 } from "../lib/hash";


/**
 * Inline Cal.com booking embed for the pricing page.
 * Lets visitors book a 30-minute slot directly without leaving the page.
 */
export function CalBookingEmbed() {
  const posthog = usePostHog();

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { theme: "light", hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: async (e) => {
          // bookingSuccessfulV2's runtime payload (booking/attendees/eventType)
          // is richer than the SDK's static type for e.detail.data.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const data = e.detail.data as any;
          const attendee = data?.booking?.attendees?.[0] ?? data?.attendees?.[0];
          if (attendee?.email) {
            const id = await sha256(attendee.email.trim().toLowerCase());
            posthog.identify(id, { email: attendee.email, name: attendee.name });
            posthog.capture("meeting_booked", { booking_uid: data?.uid, event_type: data?.eventType?.slug });
          }
        },
      });
    })();
  }, [posthog]);

  return (
    <Cal
      namespace="30min"
      calLink="pierrepoirmeur/30min"
      calOrigin="https://www.cal.eu"
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
      config={{ layout: "month_view", theme: "light", useSlotsViewOnSmallScreen: "true" } as Record<string, string>}
    />
  );
}
