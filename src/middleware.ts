import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // media + fr/media are the self-contained Northstar section outside next-intl (like admin)
  matcher: ["/((?!api|_next|_vercel|admin|media|fr/media|.*\\..*).*)"],
};
