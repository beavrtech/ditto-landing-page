# Northstar — how to add an article

Northstar is the media at `trustditto.com/media` (English) and `trustditto.com/fr/media` (French). It is file-based: articles are MDX files in this folder, not CMS entries. Publishing means merging to `main` and deploying.

Read [TONE-OF-VOICE.md](./TONE-OF-VOICE.md) before writing. It is the editorial contract.

## Where things live

| What | Where |
|---|---|
| Articles | `content/media/articles/<url>.mdx` (one file, both languages) |
| Illustrations | `public/media/illustrations/<slug>.svg` |
| Authors | `src/features/media/data/authors.ts` |
| Videos (home page) | `src/features/media/data/videos.ts` |
| Taxonomy and industries | `src/features/media/data/taxonomy.ts` |
| Design system | `src/features/media/styles/` |
| Everything else (components, routes) | `src/features/media/` |

## Adding an article

1. **Pick a url.** Lowercase, hyphenated, English, stable. It is the article's address in both languages: `/media/<url>` and `/fr/media/<url>`. Changing it later breaks links.

2. **Create one file**, `content/media/articles/<url>.mdx`. It holds both languages. The filename must match the `url` field.

3. **Write the frontmatter.** Facts that hold in both languages sit at the top level; anything that differs by language goes in the `en:` and `fr:` blocks.

   ```yaml
   ---
   url: reach-2026-checklist        # must match the filename
   author: alexis-de-taillac        # slug from data/authors.ts
   illustration: /media/illustrations/reach-2026-checklist.svg
   date: "2026-07-15"               # YYYY-MM-DD, true publication date
   updated: "2026-08-02"            # optional, only when the substance changed
   section: [supply-chain, normes-et-regulations, reach]
   alsoIn:                          # optional, up to 3 secondary placements
     - [rse, normes-et-regulations]
     - [qhse, environnement]
   industries: [electronique]       # omit or leave empty to mean all industries
   draft: true                      # optional, hides the article in production

   en:
     title: "REACH in 2026: the checklist electronics manufacturers actually need"
     description: "One to three sentences stating the core answer. Doubles as the meta description and the card dek."
     alt: "Describe the illustration, not the article"   # optional; empty means decorative
   fr:
     title: "REACH en 2026 : la checklist dont les fabricants d'électronique ont vraiment besoin"
     description: "Une à trois phrases qui donnent la réponse tout de suite."
     alt: "Décrire l'illustration, pas l'article"
   ---
   ```

   `section` is the taxonomy path: two entries (`[level1, level2]`) or three when the
   piece is about one named framework (`[level1, level2, level3]`). Valid slugs come
   from `src/features/media/data/taxonomy.ts`.

   `alsoIn` is for an article that lives in one section but is genuinely useful to
   readers of another. Each entry is a path of one to three slugs, so `- [rse]` (the
   whole CSR pillar) and `- [rse, carbone]` are both valid. The article then appears
   on those theme pages and their parents, but **not** on their sibling or child
   pages: `- [rse]` reaches `/media/theme/rse`, not `/media/theme/rse/carbone`.

   Cross-filing changes where an article is listed, nothing else. Its URL, breadcrumb,
   card kicker and primary topic all stay those of `section`, so a cross-filed piece
   shows its home section on the card and reads as a cross-reference wherever else it
   appears. The build rejects more than three entries, duplicates, and any entry on
   the primary's own branch, which would be redundant.

   Everything is validated at build time. A url that does not match the filename, an unknown author, section, or industry, a malformed date, or a missing language block fails the build with the file path and the reason, on purpose: bad frontmatter should not reach production.

4. **Add the illustration** to `public/media/illustrations/`. Flat, geometric, sharp-cornered, in the Northstar palette (navy `#130e30`, yellow `#ffe228`, blue `#3a93ff` on white).

5. **Write both bodies** in the same file, each introduced by a locale marker:

   ```mdx
   <!-- locale:en -->

   English body...

   <!-- locale:fr -->

   Corps en français...
   ```

   The markers are HTML comments, which MDX itself rejects, so they can never be
   confused with article content. Both are required.

6. **Use the components** where they earn their place. Both bodies are MDX, so markdown plus:

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

7. **Check both pages** with `npm run dev` (port 3456): `http://localhost:3456/media/<url>` and `http://localhost:3456/fr/media/<url>`.

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
