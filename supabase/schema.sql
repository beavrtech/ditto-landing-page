-- Ditto Landing Page CMS Schema
-- Matches the exact field schemas of the original CMS collections
-- Run this in the Supabase SQL Editor to create all tables

-- ============================================================
-- REFERENCE / LOOKUP TABLES
-- ============================================================

CREATE TABLE authors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  picture_url TEXT,                -- Image: author photo
  description_en TEXT,             -- RichText
  description_fr TEXT,
  linkedin_url TEXT,               -- Link
  job_title TEXT,                  -- PlainText
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE industries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE frameworks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,                -- PlainText
  frameworks_type TEXT,            -- Option
  is_filter BOOLEAN DEFAULT FALSE, -- Switch
  collection_url TEXT,             -- Link
  page_url TEXT,                   -- Link
  sort_order INTEGER DEFAULT 0,   -- Number: "order"
  -- featured_guide_id (UUID REFERENCES guides(id)) added below, after the
  -- guides table, via ALTER TABLE — guides is defined later in this file and
  -- Postgres requires the referenced table to exist first (see migration 0002).
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TESTIMONIALS (slug: testimonials)
-- ============================================================

CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,              -- PlainText: author's name
  slug TEXT UNIQUE NOT NULL,
  customer_name TEXT,              -- PlainText: company name
  logo_url TEXT,                   -- Image: company logo
  profile_picture_url TEXT,        -- Image: author photo
  quote_en TEXT,                   -- PlainText (bilingual)
  quote_fr TEXT,
  job_title TEXT,                  -- PlainText
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPANY LOGOS (not an original CMS collection, manually populated)
-- ============================================================

-- "company_logos" is the customers table (kept the original table name to avoid
-- breaking changes; surfaced as "Customers" in the admin UI).
CREATE TABLE company_logos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  industry TEXT,
  case_study_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  -- When set, the customer appears in the homepage logo strip, ordered by this
  -- value (ascending). NULL = not shown on the homepage. Lets us pick/order the
  -- homepage customers without removing the others from the table.
  homepage_order INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CUSTOMER STORIES (slug: customer-stories)
-- ============================================================

CREATE TABLE customer_stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  business_logo_url TEXT,          -- Image: company logo
  seo_title_en TEXT,               -- PlainText: seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: seo-meta-desc
  seo_meta_desc_fr TEXT,
  banner_url TEXT,                 -- Image
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  about_en TEXT,                   -- PlainText
  about_fr TEXT,
  entreprise TEXT,                 -- PlainText: company name
  localisation TEXT,               -- Option: location
  industry_id UUID REFERENCES industries(id), -- Reference -> Industries
  medaille_en TEXT,                -- PlainText: medal/achievement
  medaille_fr TEXT,
  score TEXT,                      -- PlainText: labeled "Revenus"
  team_size TEXT,                  -- Option
  solutions TEXT,                  -- Option
  challenge_summary_en TEXT,       -- RichText
  challenge_summary_fr TEXT,
  impact_summary_en TEXT,          -- RichText
  impact_summary_fr TEXT,
  presentation_en TEXT,            -- RichText: presentation-de-l-entreprise
  presentation_fr TEXT,
  challenges_en TEXT,              -- RichText
  challenges_fr TEXT,
  contexte_rse_en TEXT,            -- RichText
  contexte_rse_fr TEXT,
  solution_en TEXT,                -- RichText
  solution_fr TEXT,
  impact_en TEXT,                  -- RichText
  impact_fr TEXT,
  ending_en TEXT,                  -- RichText: conclusion
  ending_fr TEXT,
  quote_en TEXT,                   -- PlainText
  quote_fr TEXT,
  quote_2_en TEXT,                 -- PlainText
  quote_2_fr TEXT,
  quote_3_en TEXT,                 -- PlainText
  quote_3_fr TEXT,
  quote_author TEXT,               -- PlainText: author name
  quote_author_role TEXT,          -- PlainText
  quote_author_picture_url TEXT,   -- Image
  featured BOOLEAN DEFAULT FALSE,  -- Switch
  publish_date TIMESTAMPTZ,        -- DateTime
  display_on_showcase BOOLEAN DEFAULT FALSE, -- Switch
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: customer stories <-> frameworks (filter-referentiels)
CREATE TABLE customer_story_frameworks (
  customer_story_id UUID REFERENCES customer_stories(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
  PRIMARY KEY (customer_story_id, framework_id)
);

-- ============================================================
-- BLOG POSTS (slug: blog)
-- ============================================================

CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  seo_title_en TEXT,               -- PlainText: new-field-seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: new-field-seo-meta-desc
  seo_meta_desc_fr TEXT,
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText: new-field-banner-alt-desc
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  category_id UUID REFERENCES frameworks(id), -- Reference -> Frameworks (category-2)
  date_de_publication TIMESTAMPTZ, -- DateTime
  author_id UUID REFERENCES authors(id), -- Reference -> Authors
  en_avant BOOLEAN DEFAULT FALSE,  -- Switch: featured
  url_to_redirect TEXT,            -- Link
  embed_included BOOLEAN DEFAULT FALSE,    -- Switch
  embed_included_fr BOOLEAN DEFAULT FALSE, -- Switch
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- NEWS (slug: news)
-- ============================================================

CREATE TABLE news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  published_date TIMESTAMPTZ,      -- DateTime
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText: new-field-banner-alt-desc
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  author_id UUID REFERENCES authors(id), -- Reference -> Authors
  en_avant BOOLEAN DEFAULT FALSE,  -- Switch: featured
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GUIDES (slug: guides)
-- ============================================================

CREATE TABLE guides (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  seo_title_en TEXT,               -- PlainText: seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: seo-meta-desc
  seo_meta_desc_fr TEXT,
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  tag_id UUID REFERENCES frameworks(id), -- Reference -> Frameworks
  date TIMESTAMPTZ,                -- DateTime
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  author_id UUID REFERENCES authors(id), -- Reference -> Authors (auteur)
  document_url TEXT,               -- File: downloadable file URL
  form_en TEXT,                    -- RichText: sidebar form content
  form_fr TEXT,
  display_on_collection_page_category TEXT, -- Option
  -- Marks the single guide used as the global sidebar fallback (uncategorized
  -- blog posts, all news articles, customer stories). Added by migration 0002.
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many: guides <-> frameworks (display-on-collection-page)
CREATE TABLE guide_display_frameworks (
  guide_id UUID REFERENCES guides(id) ON DELETE CASCADE,
  framework_id UUID REFERENCES frameworks(id) ON DELETE CASCADE,
  PRIMARY KEY (guide_id, framework_id)
);

-- The guide shown in the sidebar guide-promo card for articles tagged with a
-- given theme/framework. Distinct from guide_display_frameworks above
-- (many-to-many, powers the multi-guide resource listing on collection
-- pages) — this is a single, directly-settable guide per framework. Added
-- (with the guides.is_default column above) by migration 0002.
ALTER TABLE frameworks ADD COLUMN featured_guide_id UUID REFERENCES guides(id);

-- ============================================================
-- EVENTS (slug: events)
-- ============================================================

CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  link_to_livestorm_event TEXT,    -- Link
  seo_title_en TEXT,               -- PlainText: seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: seo-meta-desc
  seo_meta_desc_fr TEXT,
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  tag_id UUID REFERENCES frameworks(id), -- Reference -> Frameworks
  date TIMESTAMPTZ,                -- DateTime
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  author_id UUID REFERENCES authors(id), -- Reference -> Authors (auteur)
  document_url TEXT,               -- File
  form_en TEXT,                    -- RichText: sidebar
  form_fr TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- COMPANY UPDATES (slug: company-updates)
-- ============================================================

CREATE TABLE company_updates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT UNIQUE NOT NULL,
  seo_title_en TEXT,               -- PlainText: seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: seo-meta-desc
  seo_meta_desc_fr TEXT,
  published_date TIMESTAMPTZ,      -- DateTime
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText: new-field-banner-alt-desc
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  author_id UUID REFERENCES authors(id), -- Reference -> Authors
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FRAMEWORK COLLECTION ITEMS
-- Unified table for: EcoVadis, CDP, ISO 14001, VSMEs, CSRDs, SBTis, Positive Companies
-- All share the same field structure
-- ============================================================

CREATE TABLE collection_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  framework_id UUID NOT NULL REFERENCES frameworks(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,           -- PlainText: "name"
  name_fr TEXT,
  slug TEXT NOT NULL,
  seo_title_en TEXT,               -- PlainText: new-field-seo-title-tag
  seo_title_fr TEXT,
  seo_meta_desc_en TEXT,           -- PlainText: new-field-seo-meta-desc
  seo_meta_desc_fr TEXT,
  banner_url TEXT,                 -- Image
  banner_alt_desc TEXT,            -- PlainText: new-field-banner-alt-desc
  description_en TEXT,             -- PlainText
  description_fr TEXT,
  body_en TEXT,                    -- RichText
  body_fr TEXT,
  date_de_publication TIMESTAMPTZ, -- DateTime
  author_id UUID REFERENCES authors(id), -- Reference -> Authors
  categorie TEXT,                  -- Option
  ordre INTEGER DEFAULT 0,        -- Number: sort order
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(framework_id, slug)
);

-- ============================================================
-- INDEXES
-- ============================================================

-- Authors
CREATE INDEX idx_authors_slug ON authors(slug);

-- Frameworks
CREATE INDEX idx_frameworks_slug ON frameworks(slug);
CREATE INDEX idx_frameworks_is_filter ON frameworks(is_filter);
CREATE INDEX idx_frameworks_order ON frameworks(sort_order);
CREATE INDEX idx_frameworks_featured_guide ON frameworks(featured_guide_id);

-- Enforces "at most one guide is the global default" at the DB level.
CREATE UNIQUE INDEX idx_guides_is_default_unique ON guides (is_default) WHERE is_default;

-- Industries
CREATE INDEX idx_industries_slug ON industries(slug);

-- Testimonials
CREATE INDEX idx_testimonials_slug ON testimonials(slug);
CREATE INDEX idx_testimonials_sort ON testimonials(sort_order);

-- Company logos
CREATE INDEX idx_company_logos_published ON company_logos(published, sort_order);

-- Customer stories
CREATE INDEX idx_customer_stories_slug ON customer_stories(slug);
CREATE INDEX idx_customer_stories_featured ON customer_stories(featured);
CREATE INDEX idx_customer_stories_publish_date ON customer_stories(publish_date DESC);
CREATE INDEX idx_customer_stories_industry ON customer_stories(industry_id);
CREATE INDEX idx_customer_stories_team_size ON customer_stories(team_size);
CREATE INDEX idx_customer_stories_display ON customer_stories(display_on_showcase);

-- Blog posts
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_date ON blog_posts(date_de_publication DESC);
CREATE INDEX idx_blog_posts_author ON blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON blog_posts(category_id);
CREATE INDEX idx_blog_posts_featured ON blog_posts(en_avant);

-- News
CREATE INDEX idx_news_slug ON news(slug);
CREATE INDEX idx_news_date ON news(published_date DESC);
CREATE INDEX idx_news_author ON news(author_id);
CREATE INDEX idx_news_featured ON news(en_avant);

-- Guides
CREATE INDEX idx_guides_slug ON guides(slug);
CREATE INDEX idx_guides_date ON guides(date DESC);
CREATE INDEX idx_guides_author ON guides(author_id);
CREATE INDEX idx_guides_tag ON guides(tag_id);

-- Events
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_events_date ON events(date DESC);
CREATE INDEX idx_events_author ON events(author_id);
CREATE INDEX idx_events_tag ON events(tag_id);

-- Company updates
CREATE INDEX idx_company_updates_slug ON company_updates(slug);
CREATE INDEX idx_company_updates_date ON company_updates(published_date DESC);
CREATE INDEX idx_company_updates_author ON company_updates(author_id);

-- Collection items
CREATE INDEX idx_collection_items_framework ON collection_items(framework_id);
CREATE INDEX idx_collection_items_framework_slug ON collection_items(framework_id, slug);
CREATE INDEX idx_collection_items_date ON collection_items(date_de_publication DESC);
CREATE INDEX idx_collection_items_ordre ON collection_items(framework_id, ordre);
CREATE INDEX idx_collection_items_author ON collection_items(author_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_authors_updated BEFORE UPDATE ON authors FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_frameworks_updated BEFORE UPDATE ON frameworks FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_testimonials_updated BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_customer_stories_updated BEFORE UPDATE ON customer_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_news_updated BEFORE UPDATE ON news FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_guides_updated BEFORE UPDATE ON guides FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_events_updated BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_company_updates_updated BEFORE UPDATE ON company_updates FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_collection_items_updated BEFORE UPDATE ON collection_items FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (public read, service role for writes)
-- ============================================================

ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE industries ENABLE ROW LEVEL SECURITY;
ALTER TABLE frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_story_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE guide_display_frameworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_items ENABLE ROW LEVEL SECURITY;

-- Public read access (anon key can read all tables)
CREATE POLICY "Public read" ON authors FOR SELECT USING (true);
CREATE POLICY "Public read" ON industries FOR SELECT USING (true);
CREATE POLICY "Public read" ON frameworks FOR SELECT USING (true);
CREATE POLICY "Public read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "Public read" ON company_logos FOR SELECT USING (true);
CREATE POLICY "Public read" ON customer_stories FOR SELECT USING (true);
CREATE POLICY "Public read" ON customer_story_frameworks FOR SELECT USING (true);
CREATE POLICY "Public read" ON blog_posts FOR SELECT USING (true);
CREATE POLICY "Public read" ON news FOR SELECT USING (true);
CREATE POLICY "Public read" ON guides FOR SELECT USING (true);
CREATE POLICY "Public read" ON guide_display_frameworks FOR SELECT USING (true);
CREATE POLICY "Public read" ON events FOR SELECT USING (true);
CREATE POLICY "Public read" ON company_updates FOR SELECT USING (true);
CREATE POLICY "Public read" ON collection_items FOR SELECT USING (true);

-- Service role key (used server-side) bypasses RLS automatically
