-- Sidebar "guide card" mapping.
--
-- 1. frameworks.featured_guide_id: the single guide shown in the sidebar
--    guide-promo card for articles tagged with that theme/framework. This is
--    a NEW, dedicated field — distinct from guide_display_frameworks (the
--    many-to-many junction that powers the multi-guide resource listing on
--    collection pages). guide_display_frameworks is NOT touched by this
--    migration and must keep working exactly as before.
-- 2. guides.is_default: marks the single guide used as the global fallback
--    (blog articles with no category, all news articles, customer stories)
--    when no theme-specific featured guide applies. Replaces the previous
--    hardcoded DEFAULT_GUIDE_SLUG constant in application code.
--
-- Idempotent — safe to run more than once.

ALTER TABLE frameworks ADD COLUMN IF NOT EXISTS featured_guide_id UUID REFERENCES guides(id);
ALTER TABLE guides ADD COLUMN IF NOT EXISTS is_default BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_frameworks_featured_guide ON frameworks(featured_guide_id);

-- ------------------------------------------------------------------
-- Data seeding: theme -> featured guide mapping (keyed by slug, data-safe).
-- ------------------------------------------------------------------

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'ecovadis-guide-3-weeks-to-succeed-in-your-csr-assessment')
WHERE slug = 'ecovadis';

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'guide-cdp-2026-method-preparation')
WHERE slug = 'cdp';

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'from-carbon-footprint-to-ecovadis-gold-niedax-case-study')
WHERE slug = 'carbon';

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'csrd-introduction-practical-guide')
WHERE slug = 'csrd';

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'environmental-reporting-guide')
WHERE slug = 'vsme';

UPDATE frameworks
SET featured_guide_id = (SELECT id FROM guides WHERE slug = 'complete-action-plan-to-succeed-csr-assessments')
WHERE slug = 'iso-14001';

-- ------------------------------------------------------------------
-- Data seeding: global default guide (used when no theme-specific guide
-- applies: uncategorized blog posts, news articles, customer stories).
-- ------------------------------------------------------------------

UPDATE guides SET is_default = FALSE WHERE is_default = TRUE;

UPDATE guides
SET is_default = TRUE
WHERE slug = '17-documents-csr-program-formalization';
