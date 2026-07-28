# Northstar — how to add an article

Northstar is the media at `trustditto.com/media` (English) and `trustditto.com/fr/media` (French). It is file-based: articles are MDX files in this folder, not CMS entries. Publishing means merging to `main` and deploying.

Read [TONE-OF-VOICE.md](./TONE-OF-VOICE.md) before writing. It is the editorial contract.

## Where things live

| What | Where |
|---|---|
| Articles | `content/media/articles/<slug>/en.mdx` and `fr.mdx` |
| Illustrations | `public/media/illustrations/<slug>.svg` |
| Authors | `src/features/media/data/authors.ts` |
| Videos (home page) | `src/features/media/data/videos.ts` |
| Taxonomy and industries | `src/features/media/data/taxonomy.ts` |
| Design system | `src/features/media/styles/` |
| Everything else (components, routes) | `src/features/media/` |

## Adding an article

1. **Pick a slug.** Lowercase, hyphenated, English, stable. It becomes the URL in both languages: `/media/<slug>` and `/fr/media/<slug>`. Changing it later breaks links.

2. **Create the folder** `content/media/articles/<slug>/` with two files, `en.mdx` and `fr.mdx`.

3. **Write the frontmatter.** Both files carry identical values except `title` and `description`.

   ```yaml
   ---
   title: "REACH in 2026: the checklist electronics manufacturers actually need"
   description: "One to three sentences stating the core answer. Doubles as the meta description and the card dek."
   author: "alexis-de-taillac"        # slug from data/authors.ts
   illustration: "/media/illustrations/reach-2026-checklist.svg"
   illustrationAlt: "Describe the image, not the article"
   date: "2026-07-15"                 # YYYY-MM-DD, true publication date
   updated: "2026-08-02"              # optional, only when the substance changed
   level1: "supply-chain"             # required, slug from data/taxonomy.ts
   level2: "normes-et-regulations"    # required
   level3: "reach"                    # optional, only under a "normes" branch
   industries: ["electronique"]       # one or more slugs from INDUSTRIES
   draft: true                        # optional, hides the article in production
   ---
   ```

   Everything is validated at build time. A wrong author, taxonomy path, industry, or date format fails the build with the file path and the reason, on purpose: bad frontmatter should not reach production.

4. **Add the illustration** to `public/media/illustrations/`. Flat, geometric, sharp-cornered, in the Northstar palette (navy `#130e30`, yellow `#ffe228`, blue `#3a93ff` on white).

5. **Write the body** in MDX. Markdown plus these components:

   ```mdx
   <KeyTakeaways title="À retenir">   {/* title is optional; default "Key takeaways" */}
   - Three to five actionable bullets
   </KeyTakeaways>

   <PullQuote attribution="Name, Title, Company">
   A quote that earns its space.
   </PullQuote>

   <ArticleImage src="/media/illustrations/x.svg" alt="…" caption="Optional caption" />

   <YouTube id="dQw4w9WgXcQ" title="What the video shows" />

   <FAQ items={[
     { question: "A question practitioners actually ask?", answer: "A self-contained answer." }
   ]} />
   ```

   GitHub-flavored markdown tables work. Headings get anchor IDs automatically. Read time is computed from the word count, so do not put it in the frontmatter.

   `<FAQ>` emits FAQPage structured data. Only use it for real questions, and keep answers self-contained: they get read out of context.

6. **Check both pages** with `npm run dev` (port 3456): `http://localhost:3456/media/<slug>` and `http://localhost:3456/fr/media/<slug>`.

## Adding an author

Add an entry to `MEDIA_AUTHORS` in `src/features/media/data/authors.ts`. Real people only: each author becomes a `Person` entity in structured data with a profile page at `/media/authors/<slug>`.

Authors are mirrored by hand from the Supabase `authors` table the main site uses, so keep the slug, title and photo identical to the CMS record. `avatar` accepts either a path under `/public` or an absolute URL on the Supabase storage host, which `next.config.ts` already allows, so pointing at the existing CMS photo is the simplest option. Set `dittoAuthorSlug` to their slug on the main site to link the two profiles.

## Adding a video

Add an entry to `MEDIA_VIDEOS` in `src/features/media/data/videos.ts` with the YouTube ID and a bilingual title. They render on the home page in order.

## Changing the taxonomy

Edit `TAXONOMY` in `src/features/media/data/taxonomy.ts`. Each node needs a `slug` (ASCII, no accents) and `en`/`fr` labels. Adding a node creates its listing page at `/media/theme/<path>` automatically. Removing a node breaks any article that references it, and the build will say so.

Nodes marked `suggested: true` were proposed rather than specified. Delete the line once a node is confirmed, or delete the node.

## Notes

- Northstar is **not indexed yet**. `src/app/robots.ts` disallows `/media` and `/fr/media`, and both media layouts set `robots: { index: false, follow: false }`. To launch: remove those two disallow entries, remove the `robots` block from `src/app/media/layout.tsx` and `src/app/fr/media/layout.tsx`, and add the media URLs to `src/app/sitemap.ts`.
- Media pages are fully static and never touch Supabase, so they render without any environment variables.
- Filter URLs are path-based (`/media/theme/…`, `/media/industry/…`) because `robots.ts` disallows every query-string URL.
