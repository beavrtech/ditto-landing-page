<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know


This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

This is a Next.js 16 (Turbopack) marketing site for "Ditto" (trustditto.com) with `next-intl` i18n (`en`, `fr`) and a Supabase CMS backend. Package manager is npm (`package-lock.json`). The update script runs `npm install`.

### On task completion
- Always send the preview URL back to Slack when a task is done.

### When someone corrects an article
Whenever the user makes a manual correction to an article draft (blog or The Scope), or gives a suggestion about how an article should read, treat it as a candidate **general rule**, not just a one-off edit. Apply the fix, then **ask the user whether to generalize it** by writing it into the relevant standing instruction so it holds for every future article — the `scope-article` or `ditto-blog-optimisation` skill, the editorial docs under `content/media/`, or this file. Do not fold it in silently and do not skip the ask.

### Required env to run anything
`src/lib/supabase.ts` calls `createClient()` at module load, so **every page that imports `lib/cms` crashes with a 500 ("supabaseUrl is required") unless `NEXT_PUBLIC_SUPABASE_URL` is set**. Create a gitignored `.env.local` (not committed, not in fresh VMs) with at minimum:
- `NEXT_PUBLIC_SUPABASE_URL` — the project URL is public: `https://xrbgrzbifkchbjimewvu.supabase.co` (also hardcoded in `next.config.ts`).
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — needed for live CMS data. With a placeholder value, `createClient()` no longer throws and pages render with CMS sections empty (every `lib/cms` caller wraps fetches in `.catch(() => [])`). Use the real anon key (a Secret) to load live blog posts, customer stories, logos, etc.

### Optional env (feature-specific, not needed to render the site)
- `SUPABASE_SERVICE_ROLE_KEY` + `ADMIN_PASSWORD` — the `/admin` CMS editor (`src/app/admin`).
- `SLACK_WEBHOOK_URL` — lead notifications; `POST /api/lead` returns `{ok:true}` even without it (Slack step skipped silently).
- `SLACKBOT_OAUTH_TOKEN` (+ optional `SLACK_SUBSCRIBE_CHANNEL_ID`, default `C0B96EGAV3R`) — The Scope letter sign-ups. `POST /api/subscribe` posts the email, categories and industry to that channel with `chat.postMessage`, and the bot must be a member of it. Set on Preview and Production only, so a local dev server has no token. Slack is the only place a sign-up is recorded, so without one the route answers 503 and both Scope forms tell the reader to try again — it does not pretend to have subscribed them.
- `NEXT_PUBLIC_POSTHOG_*`, `NEXT_PUBLIC_HUBSPOT_*` — analytics and the HubSpot contact/newsletter forms.
- `REVALIDATE_SECRET` — shared secret required by `POST /api/revalidate` (Supabase database webhook on `collection_items`, on-demand ISR invalidation of article + framework listing pages so a direct DB edit goes live without waiting on the hour-long ISR window or a redeploy). Without it the route always returns 500; page rendering is unaffected — `/admin` saves already self-revalidate without this via `src/lib/admin-revalidate.ts`.

### Running / checks
- Dev server: `npm run dev` (port 3000). Root `/` 307-redirects to `/en`; locales live under `/[locale]`.
- Lint: `npm run lint`. Note: the repo currently has many pre-existing lint errors/warnings (e.g. `no-explicit-any` in `src/lib/cms.ts`); they are not caused by setup.
- No automated test suite exists.
- Build (`npm run build`): `next.config.ts` `redirects()` fetches Supabase at build/start time, but it is wrapped in try/catch and skipped when Supabase env vars are absent.
