import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // The Scope section (/en/media, /fr/media, and the bare /media that
  // redirects into them) is self-contained and outside next-intl, like admin.
  matcher: ["/((?!api|_next|_vercel|admin|media|en/media|fr/media|.*\\..*).*)"],
};
