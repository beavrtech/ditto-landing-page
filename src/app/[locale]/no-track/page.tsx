import type { Metadata } from "next";
import { OptOutClient } from "../../../components/OptOutClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function NoTrackPage() {
  return <OptOutClient />;
}
