"use client";

import { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";
import { usePostHog } from "posthog-js/react";

const ARROW_SVG =
  '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/></svg>';

/**
 * "Get personalized pricing" hero CTA — opens the Cal.com booking popup
 * instead of navigating to the demo page.
 */
export function PricingHeroCta({ label }: { label: string }) {
  const posthog = usePostHog();
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "30min" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "30min" });
      cal("on", {
        action: "bookingSuccessfulV2",
        callback: (e) => {
          const data = e.detail.data;
          const attendee = data?.booking?.attendees?.[0] ?? data?.attendees?.[0];
          if (attendee?.email) {
            posthog.identify(attendee.email, { email: attendee.email, name: attendee.name });
            posthog.capture("meeting_booked", { booking_uid: data?.uid, event_type: data?.eventType?.slug });
          }
        },
      });
    })();
  }, [posthog]);

  return (
    <button
      type="button"
      className="pricing-hero_cta"
      data-cal-namespace="30min"
      data-cal-link="pierrepoirmeur/30min"
      data-cal-origin="https://www.cal.eu"
      data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
    >
      <span>{label}</span>
      <span
        className="pricing-hero_cta-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: ARROW_SVG }}
      />
    </button>
  );
}
