-- Press mentions ("In the media" page: /press).
--
-- NOT YET APPLIED to the live database -- this migration is pending
-- explicit approval from Etienne Dejoie before it is run. Until it's
-- applied, the /press page falls back to a small hardcoded list of the
-- 2 known seed articles (see src/components/PressServer.tsx) so the page
-- can ship ahead of the schema change.
--
-- Modeled on testimonials / company_logos (see supabase/schema.sql): a
-- simple published + sort_order CMS table, public-read via RLS, service
-- role bypasses RLS for writes (used by /admin).
--
-- Idempotent -- safe to run more than once.

CREATE TABLE IF NOT EXISTS press_mentions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outlet_name TEXT NOT NULL,                   -- PlainText: publication name, e.g. "Mediavenir"
  outlet_logo_url TEXT,                        -- Image: publication logo (optional; render outlet_name as text when absent)
  article_title TEXT NOT NULL,                 -- PlainText: headline of the article mentioning Ditto
  article_url TEXT NOT NULL,                   -- External URL to the article (opens in a new tab, rel=noopener)
  article_language TEXT NOT NULL DEFAULT 'en', -- Language the article is written in ('en' | 'fr')
  published_date DATE NOT NULL,                -- Date the article was published; drives newest-first sort order
  excerpt TEXT,                                -- Optional short quote/snippet from the article
  published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_press_mentions_published_date
  ON press_mentions (published_date DESC);

DROP TRIGGER IF EXISTS trg_press_mentions_updated ON press_mentions;
CREATE TRIGGER trg_press_mentions_updated
  BEFORE UPDATE ON press_mentions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE press_mentions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read" ON press_mentions;
CREATE POLICY "Public read" ON press_mentions FOR SELECT USING (true);
