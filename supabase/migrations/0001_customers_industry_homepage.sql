-- Customers (table kept as company_logos to avoid breaking changes).
-- 1. industry: free-text industry of the customer.
-- 2. homepage_order: when set, the customer shows in the homepage logo strip,
--    ordered ascending; NULL = not shown on the homepage.
-- Idempotent — safe to run more than once.

ALTER TABLE company_logos ADD COLUMN IF NOT EXISTS industry TEXT;
ALTER TABLE company_logos ADD COLUMN IF NOT EXISTS homepage_order INTEGER;

CREATE INDEX IF NOT EXISTS idx_company_logos_homepage
  ON company_logos (homepage_order)
  WHERE homepage_order IS NOT NULL;
