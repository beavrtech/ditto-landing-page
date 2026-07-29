// Kept free of any Node import on purpose: client components (HomeFeed, the
// reveal grid) read this constant, and pulling lib/articles.ts (node:fs) into
// a client bundle is a build error.

/** How many cards a listing shows before "More articles" (and the home feed cap). */
export const ARTICLES_PER_PAGE = 6;
