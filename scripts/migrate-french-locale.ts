/**
 * Migration script: Pull French locale data from Webflow API and update Supabase
 *
 * Usage: npx tsx scripts/migrate-french-locale.ts
 */

import { createClient } from "@supabase/supabase-js";

const WEBFLOW_TOKEN = process.env.WEBFLOW_API_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const FR_LOCALE_ID = "6836beb83209e4cc55f832c8";

const COLLECTIONS = {
  customerStories: "6835cfc538240dce48169939",
  blogs: "68371e5064d6cf3d197ba4b6",
  authors: "68371e5c986d58f4be58db3e",
  news: "68371f104474c3bfd57e0bd8",
  guides: "68404311c509431bc159a9c4",
  events: "68492a24f79fbc809400e6f1",
  companyUpdates: "68492c5fd6bf38f8e0db7813",
  testimonials: "684951a44deb11e534497543",
  collectionEcovadis: "691d633f087b03cd866e5250",
  collectionCdp: "6920441902fb071ad2b1b899",
  collectionIso14001: "69204455f1e45627754698e4",
  collectionVsme: "69204496b171fc1060187287",
  collectionCsrd: "692044ad10d2e9c0cd6ae93a",
  collectionSbti: "692044d102fb071ad2b2038d",
  collectionPositiveCompany: "692044ea521005e1cbbafebb",
  industries: "68370bc4adbdc99cd20dd9bc",
};

async function fetchFrenchItems(collectionId: string): Promise<any[]> {
  const items: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}&cmsLocaleId=${FR_LOCALE_ID}`,
      {
        headers: {
          Authorization: `Bearer ${WEBFLOW_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      console.error(`Failed to fetch: ${res.status}`);
      break;
    }

    const data = await res.json();
    items.push(...(data.items || []));
    if (!data.items || data.items.length < limit) break;
    offset += limit;
  }

  return items;
}

// We need to match French items to English items by Webflow item ID
// But the IDs might differ per locale. Let's match by position or by English slug lookup.
// Actually, Webflow locale items share the same item ID — the cmsLocaleId just changes the content.

async function updateAuthors() {
  console.log("Updating authors (FR)...");
  const items = await fetchFrenchItems(COLLECTIONS.authors);
  for (const item of items) {
    const fd = item.fieldData || {};
    // Match by English slug (authors slugs are typically the same)
    const { error } = await supabase
      .from("authors")
      .update({
        description_fr: fd.description || null,
        job_title_fr: fd["job-title"] || null,
      })
      .eq("slug", fd.slug);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name}`);
  }
}

async function updateIndustries() {
  console.log("Updating industries (FR)...");
  const items = await fetchFrenchItems(COLLECTIONS.industries);
  for (const item of items) {
    const fd = item.fieldData || {};
    const { error } = await supabase
      .from("industries")
      .update({ name_fr: fd.name || null })
      .eq("slug", fd.slug);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name}`);
  }
}

async function updateTestimonials() {
  console.log("Updating testimonials (FR)...");
  const items = await fetchFrenchItems(COLLECTIONS.testimonials);
  for (const item of items) {
    const fd = item.fieldData || {};
    // Testimonials: match by English slug (usually same)
    // But slug might differ — try matching by customer-name which is stable
    const { error } = await supabase
      .from("testimonials")
      .update({
        quote_fr: fd.quote || null,
        job_title_fr: fd["job-title"] || null,
      })
      .eq("slug", fd.slug);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name} — quote_fr: ${(fd.quote || "").substring(0, 50)}...`);
  }
}

async function updateCustomerStories() {
  console.log("Updating customer stories (FR)...");
  // First get all English stories to match by entreprise name
  const { data: enStories } = await supabase.from("customer_stories").select("id, slug, entreprise");

  const items = await fetchFrenchItems(COLLECTIONS.customerStories);
  for (const item of items) {
    const fd = item.fieldData || {};
    // Match by entreprise (company name is stable across locales)
    const match = enStories?.find((s) => s.entreprise === fd.entreprise) ||
      enStories?.find((s) => s.slug === fd.slug);

    if (!match) {
      console.error(`  No match for: ${fd.entreprise || fd.name}`);
      continue;
    }

    const { error } = await supabase
      .from("customer_stories")
      .update({
        slug_fr: fd.slug || null,
        name_fr: fd.name || null,
        description_fr: fd.description || null,
        about_fr: fd.about || null,
        seo_title_fr: fd["seo-title-tag"] || null,
        seo_meta_desc_fr: fd["seo-meta-desc"] || null,
        medaille_fr: fd.medaille || null,
        challenge_summary_fr: fd["challenge-summary"] || null,
        impact_summary_fr: fd["impact-summary"] || null,
        presentation_fr: fd["presentation-de-l-entreprise"] || null,
        challenges_fr: fd.challenges || null,
        contexte_rse_fr: fd["contexte-rse"] || null,
        solution_fr: fd.solution || null,
        impact_fr: fd.impact || null,
        ending_fr: fd.ending || null,
        quote_fr: fd.quote || null,
        quote_2_fr: fd["quote-2"] || null,
        quote_3_fr: fd["quote-3"] || null,
        quote_author_role_fr: fd["quote-author-role"] || null,
      })
      .eq("id", match.id);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name} (slug_fr: ${fd.slug})`);
  }
}

async function updateBlogPosts() {
  console.log("Updating blog posts (FR)...");
  const { data: enPosts } = await supabase.from("blog_posts").select("id, slug");

  const items = await fetchFrenchItems(COLLECTIONS.blogs);
  for (const item of items) {
    const fd = item.fieldData || {};
    // Match by checking if an English post exists — FR items have same ID structure
    // Try matching by English slug first, then by name similarity
    const match = enPosts?.find((p) => p.slug === fd.slug) ||
      enPosts?.find((p) => {
        // Items share IDs across locales in Webflow
        return false; // fallback
      });

    // Since Webflow items share IDs across locales, the slug might be the FR slug.
    // We need a different approach: update by English slug where we can find a match.
    // For blogs, let's fetch English items too to build a mapping.
    // Actually — let's just try updating by the FR slug matching any existing slug,
    // and if that fails, skip it (it means the slug changed for FR).

    if (match) {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          slug_fr: fd.slug || null,
          name_fr: fd.name || null,
          description_fr: fd.description || null,
          body_fr: fd.body || null,
          seo_title_fr: fd["new-field-seo-title-tag"] || null,
          seo_meta_desc_fr: fd["new-field-seo-meta-desc"] || null,
          banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
        })
        .eq("id", match.id);
      if (error) console.error(`  Error: ${fd.name}:`, error.message);
      else console.log(`  ✓ ${fd.name}`);
    }
  }
}

async function updateBlogPostsByWebflowId() {
  console.log("Updating blog posts (FR) via Webflow ID matching...");

  // Fetch English items to build webflow_id -> supabase slug mapping
  const enItems = await fetchEnglishItems(COLLECTIONS.blogs);
  const frItems = await fetchFrenchItems(COLLECTIONS.blogs);

  const enMap: Record<string, string> = {};
  for (const item of enItems) {
    enMap[item.id] = item.fieldData?.slug || "";
  }

  for (const item of frItems) {
    const fd = item.fieldData || {};
    const enSlug = enMap[item.id];
    if (!enSlug) {
      console.error(`  No EN match for FR item: ${fd.name}`);
      continue;
    }

    const { error } = await supabase
      .from("blog_posts")
      .update({
        slug_fr: fd.slug || null,
        name_fr: fd.name || null,
        description_fr: fd.description || null,
        body_fr: fd.body || null,
        seo_title_fr: fd["new-field-seo-title-tag"] || null,
        seo_meta_desc_fr: fd["new-field-seo-meta-desc"] || null,
        banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
      })
      .eq("slug", enSlug);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name} (slug_fr: ${fd.slug})`);
  }
}

async function fetchEnglishItems(collectionId: string): Promise<any[]> {
  const items: any[] = [];
  let offset = 0;
  const limit = 100;
  while (true) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`,
      { headers: { Authorization: `Bearer ${WEBFLOW_TOKEN}`, accept: "application/json" } }
    );
    if (!res.ok) break;
    const data = await res.json();
    items.push(...(data.items || []));
    if (!data.items || data.items.length < limit) break;
    offset += limit;
  }
  return items;
}

async function updateCollectionByWebflowId(
  collectionId: string,
  table: string,
  mapFn: (fd: any) => Record<string, any>,
  label: string,
) {
  console.log(`Updating ${label} (FR) via Webflow ID matching...`);
  const enItems = await fetchEnglishItems(collectionId);
  const frItems = await fetchFrenchItems(collectionId);

  const enMap: Record<string, string> = {};
  for (const item of enItems) {
    enMap[item.id] = item.fieldData?.slug || "";
  }

  for (const item of frItems) {
    const fd = item.fieldData || {};
    const enSlug = enMap[item.id];
    if (!enSlug) {
      console.error(`  No EN match for: ${fd.name}`);
      continue;
    }

    const updates = mapFn(fd);
    const { error } = await supabase.from(table).update(updates).eq("slug", enSlug);
    if (error) console.error(`  Error: ${fd.name}:`, error.message);
    else console.log(`  ✓ ${fd.name} (slug_fr: ${fd.slug})`);
  }
}

async function main() {
  console.log("=== French Locale Migration ===\n");

  await updateAuthors();
  await updateIndustries();
  await updateTestimonials();
  await updateCustomerStories();

  await updateCollectionByWebflowId(
    COLLECTIONS.blogs, "blog_posts",
    (fd) => ({
      slug_fr: fd.slug || null,
      name_fr: fd.name || null,
      description_fr: fd.description || null,
      body_fr: fd.body || null,
      seo_title_fr: fd["new-field-seo-title-tag"] || null,
      seo_meta_desc_fr: fd["new-field-seo-meta-desc"] || null,
      banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
    }),
    "blog posts"
  );

  await updateCollectionByWebflowId(
    COLLECTIONS.news, "news",
    (fd) => ({
      slug_fr: fd.slug || null,
      name_fr: fd.name || null,
      description_fr: fd.description || null,
      body_fr: fd.body || null,
      banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
    }),
    "news"
  );

  await updateCollectionByWebflowId(
    COLLECTIONS.guides, "guides",
    (fd) => ({
      slug_fr: fd.slug || null,
      name_fr: fd.name || null,
      description_fr: fd.description || null,
      body_fr: fd.body || null,
      seo_title_fr: fd["seo-title-tag"] || null,
      seo_meta_desc_fr: fd["seo-meta-desc"] || null,
      banner_alt_desc_fr: fd["banner-alt-desc"] || null,
      form_fr: fd.form || null,
    }),
    "guides"
  );

  await updateCollectionByWebflowId(
    COLLECTIONS.events, "events",
    (fd) => ({
      slug_fr: fd.slug || null,
      name_fr: fd.name || null,
      description_fr: fd.description || null,
      body_fr: fd.body || null,
      seo_title_fr: fd["seo-title-tag"] || null,
      seo_meta_desc_fr: fd["seo-meta-desc"] || null,
      banner_alt_desc_fr: fd["banner-alt-desc"] || null,
      form_fr: fd.form || null,
    }),
    "events"
  );

  await updateCollectionByWebflowId(
    COLLECTIONS.companyUpdates, "company_updates",
    (fd) => ({
      slug_fr: fd.slug || null,
      name_fr: fd.name || null,
      description_fr: fd.description || null,
      body_fr: fd.body || null,
      seo_title_fr: fd["seo-title-tag"] || null,
      seo_meta_desc_fr: fd["seo-meta-desc"] || null,
      banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
    }),
    "company updates"
  );

  // Framework collections — these need to match by framework_id + slug
  for (const [key, colId, fwSlug] of [
    ["ecovadis", COLLECTIONS.collectionEcovadis, "ecovadis"],
    ["cdp", COLLECTIONS.collectionCdp, "cdp"],
    ["iso14001", COLLECTIONS.collectionIso14001, "iso-14001"],
    ["vsme", COLLECTIONS.collectionVsme, "vsme"],
    ["csrd", COLLECTIONS.collectionCsrd, "csrd"],
    ["sbti", COLLECTIONS.collectionSbti, "sbti"],
    ["positiveCompany", COLLECTIONS.collectionPositiveCompany, "positive-company"],
  ] as const) {
    console.log(`Updating collection ${fwSlug} (FR)...`);
    const enItems = await fetchEnglishItems(colId);
    const frItems = await fetchFrenchItems(colId);

    const enMap: Record<string, string> = {};
    for (const item of enItems) {
      enMap[item.id] = item.fieldData?.slug || "";
    }

    // Get framework ID
    const { data: fw } = await supabase.from("frameworks").select("id").eq("slug", fwSlug).single();
    if (!fw) {
      console.error(`  Framework ${fwSlug} not found`);
      continue;
    }

    for (const item of frItems) {
      const fd = item.fieldData || {};
      const enSlug = enMap[item.id];
      if (!enSlug) continue;

      const { error } = await supabase
        .from("collection_items")
        .update({
          slug_fr: fd.slug || null,
          name_fr: fd.name || null,
          description_fr: fd.description || null,
          body_fr: fd.body || null,
          seo_title_fr: fd["new-field-seo-title-tag"] || null,
          seo_meta_desc_fr: fd["new-field-seo-meta-desc"] || null,
          banner_alt_desc_fr: fd["new-field-banner-alt-desc"] || null,
        })
        .eq("framework_id", fw.id)
        .eq("slug", enSlug);
      if (error) console.error(`  Error: ${fd.name}:`, error.message);
      else console.log(`  ✓ ${fd.name} (slug_fr: ${fd.slug})`);
    }
  }

  console.log("\n=== French locale migration complete! ===");
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
