/**
 * Seed the customers table (company_logos) from public/customer-logos.
 *
 *   1. Uploads each logo to the `cms-images` storage bucket.
 *   2. Upserts a customer row by name (creates if missing, updates the logo if
 *      it exists) and sets `homepage_order` for the ones we want on the homepage.
 *
 * Run the migration first (supabase/migrations/0001_customers_industry_homepage.sql),
 * then:
 *
 *   node --env-file=.env.local scripts/seed-homepage-customers.mjs
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the env.
 * Pass --dry to preview without writing.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LOGO_DIR = path.join(ROOT, "public", "customer-logos");
const BUCKET = "cms-images";
const DRY = process.argv.includes("--dry");

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

// Hard-written homepage list + order. `homepage_order` is null for customers
// that should exist but NOT appear on the homepage (e.g. binder-magnetic).
// `name` matches the existing DB row name where one exists, so we update rather
// than duplicate. caseStudyUrl is the EN customer-story path (localized at render).
const CUSTOMERS = [
  { file: "waat.png",             name: "WAAT",                homepageOrder: 1 },
  { file: "mobsuccess.png",       name: "Mobsuccess",          homepageOrder: 2 },
  { file: "stanco.png",           name: "Stanco",              homepageOrder: 3 },
  { file: "adenes.png",           name: "Adenes",              homepageOrder: 4,  caseStudyUrl: "/customer-stories/first-cdp-assessment-one-month-adenes" },
  { file: "aico.png",             name: "Aico Ltd",            homepageOrder: 5,  caseStudyUrl: "/customer-stories/aico-building-a-strong-csr-framework-to-aim-for-excellence" },
  { file: "maurin.png",           name: "Émile Maurin",        homepageOrder: 6,  caseStudyUrl: "/customer-stories/emile-maurin-a-family-business-strengthening-its-csr-strategy-with-ditto" },
  { file: "niedax.png",           name: "Niedax",              homepageOrder: 7,  caseStudyUrl: "/customer-stories/niedax-client-pressure-gold-ecovadis-medal" },
  { file: "superga-beauty.png",   name: "Superga Beauty",      homepageOrder: 8,  caseStudyUrl: "/customer-stories/superga-beauty-structuring-and-promoting-its-csr-approach-for-sustainable-leadership" },
  { file: "ecs-group.png",        name: "ECS Group",           homepageOrder: 9 },
  { file: "yesss-electrique.png", name: "Yesss Electrique",    homepageOrder: 10, caseStudyUrl: "/customer-stories/yesss-electrique-structuring-its-csr-approach-and-standing-out-in-tenders" },
  { file: "france-tv.png",        name: "France TV Publicité", homepageOrder: 11 },
  { file: "malt.png",             name: "Malt",                homepageOrder: 12 },
  { file: "binder-magnetic.png",  name: "Binder Magnetic",     homepageOrder: null },
];

const slug = (s) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

async function uploadLogo(c) {
  const ext = path.extname(c.file).slice(1) || "png";
  const storagePath = `company_logos/${slug(c.name)}/logo.${ext}`;
  const publicUrl = `${URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
  if (DRY) return publicUrl;
  const body = await readFile(path.join(LOGO_DIR, c.file));
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, body, { contentType: "image/png", upsert: true });
  if (error) throw new Error(`upload ${c.file}: ${error.message}`);
  return publicUrl;
}

async function upsertCustomer(c, logoUrl) {
  const row = {
    name: c.name,
    logo_url: logoUrl,
    case_study_url: c.caseStudyUrl ?? null,
    homepage_order: c.homepageOrder,
    published: true,
  };
  const { data: existing, error: selErr } = await supabase
    .from("company_logos")
    .select("id")
    .eq("name", c.name)
    .maybeSingle();
  if (selErr) throw new Error(`select ${c.name}: ${selErr.message}`);

  if (DRY) return existing ? "would UPDATE" : "would CREATE";
  if (existing) {
    const { error } = await supabase.from("company_logos").update(row).eq("id", existing.id);
    if (error) throw new Error(`update ${c.name}: ${error.message}`);
    return "updated";
  }
  const { error } = await supabase.from("company_logos").insert(row);
  if (error) throw new Error(`insert ${c.name}: ${error.message}`);
  return "created";
}

console.log(`${DRY ? "[DRY RUN] " : ""}Seeding ${CUSTOMERS.length} customers → ${URL}\n`);
for (const c of CUSTOMERS) {
  try {
    const logoUrl = await uploadLogo(c);
    const action = await upsertCustomer(c, logoUrl);
    console.log(`  ✓ ${c.name.padEnd(22)} ${action}  (homepage_order=${c.homepageOrder ?? "—"})`);
  } catch (e) {
    console.error(`  ✗ ${c.name.padEnd(22)} ${e.message}`);
  }
}
console.log(`\nDone.${DRY ? " (no writes performed)" : ""}`);
