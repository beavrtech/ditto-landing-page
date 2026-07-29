import { Inter, Hedvig_Letters_Serif } from "next/font/google";

// Same families as the Ditto site, exposed under The Scope-scoped CSS variables.
export const nsInter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--ns-font-inter",
});

export const nsHedvig = Hedvig_Letters_Serif({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--ns-font-hedvig",
});
