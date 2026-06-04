/**
 * Migration script: Pull all CMS data from Webflow API and insert into Supabase
 *
 * Usage: npx tsx scripts/migrate-webflow-to-supabase.ts
 *
 * Requires env vars:
 * - WEBFLOW_API_TOKEN
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (needs write access, not the anon key)
 */

import { createClient } from "@supabase/supabase-js";

const WEBFLOW_TOKEN = process.env.WEBFLOW_API_TOKEN!;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const SITE_ID = "682d7fad3c89203197a56faa";

// Webflow collection IDs
const COLLECTIONS = {
  customerStories: "6835cfc538240dce48169939",
  frameworks: "6836d5f3eb378c6b1f2e37fd",
  industries: "68370bc4adbdc99cd20dd9bc",
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
};

// Maps Webflow item IDs to Supabase UUIDs
const idMap: Record<string, string> = {};

async function fetchWebflowItems(collectionId: string): Promise<any[]> {
  const items: any[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const res = await fetch(
      `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`,
      {
        headers: {
          Authorization: `Bearer ${WEBFLOW_TOKEN}`,
          accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error(`Failed to fetch collection ${collectionId}: ${res.status} ${text}`);
      break;
    }

    const data = await res.json();
    items.push(...(data.items || []));

    if (!data.items || data.items.length < limit) break;
    offset += limit;
  }

  return items;
}

function getFieldValue(item: any, slug: string): any {
  return item.fieldData?.[slug] ?? null;
}

function getImageUrl(item: any, slug: string): string | null {
  const field = getFieldValue(item, slug);
  if (!field) return null;
  if (typeof field === "string") return field;
  return field?.url || field?.fileId || null;
}

function getRefId(item: any, slug: string): string | null {
  return getFieldValue(item, slug) || null;
}

function getMultiRef(item: any, slug: string): string[] {
  const val = getFieldValue(item, slug);
  if (Array.isArray(val)) return val;
  return [];
}

// ============================================================
// MIGRATION FUNCTIONS
// ============================================================

async function migrateAuthors() {
  console.log("Migrating authors...");
  const items = await fetchWebflowItems(COLLECTIONS.authors);
  console.log(`  Found ${items.length} authors`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name: fd.name || "",
      slug: fd.slug || "",
      picture_url: getImageUrl(item, "picture"),
      description_en: fd.description || null,
      description_fr: null, // Webflow localization handled separately
      linkedin_url: fd.linkedin || null,
      job_title: fd["job-title"] || null,
    };

    const { data, error } = await supabase.from("authors").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting author ${row.name}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name}`);
    }
  }
}

async function migrateIndustries() {
  console.log("Migrating industries...");
  const items = await fetchWebflowItems(COLLECTIONS.industries);
  console.log(`  Found ${items.length} industries`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
    };

    const { data, error } = await supabase.from("industries").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting industry ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

async function migrateFrameworks() {
  console.log("Migrating frameworks...");
  const items = await fetchWebflowItems(COLLECTIONS.frameworks);
  console.log(`  Found ${items.length} frameworks`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name: fd.name || "",
      slug: fd.slug || "",
      description: fd.description || null,
      frameworks_type: fd["frameworks-type"] || null,
      is_filter: fd["is-filter"] || false,
      collection_url: fd["collection-url"] || null,
      page_url: fd["page-url"] || null,
      sort_order: fd.order || 0,
    };

    const { data, error } = await supabase.from("frameworks").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting framework ${row.name}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name}`);
    }
  }
}

async function migrateTestimonials() {
  console.log("Migrating testimonials...");
  const items = await fetchWebflowItems(COLLECTIONS.testimonials);
  console.log(`  Found ${items.length} testimonials`);

  let order = 0;
  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name: fd.name || "",
      slug: fd.slug || "",
      customer_name: fd["customer-name"] || null,
      logo_url: getImageUrl(item, "logo"),
      profile_picture_url: getImageUrl(item, "profile-picture"),
      quote_en: fd.quote || null,
      quote_fr: null,
      job_title: fd["job-title"] || null,
      sort_order: order++,
    };

    const { data, error } = await supabase.from("testimonials").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting testimonial ${row.name}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name} (${row.customer_name})`);
    }
  }
}

async function migrateCustomerStories() {
  console.log("Migrating customer stories...");
  const items = await fetchWebflowItems(COLLECTIONS.customerStories);
  console.log(`  Found ${items.length} customer stories`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      business_logo_url: getImageUrl(item, "new-field-business-logo"),
      seo_title_en: fd["seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      banner_url: getImageUrl(item, "banner"),
      description_en: fd.description || null,
      description_fr: null,
      about_en: fd.about || null,
      about_fr: null,
      entreprise: fd.entreprise || null,
      localisation: fd["new-field-localisation"] || null,
      industry_id: fd["new-field-industry-2"] ? idMap[fd["new-field-industry-2"]] || null : null,
      medaille_en: fd.medaille || null,
      medaille_fr: null,
      score: fd.score || null,
      team_size: fd["new-field-team-size"] || null,
      solutions: fd["new-field-solutions"] || null,
      challenge_summary_en: fd["challenge-summary"] || null,
      challenge_summary_fr: null,
      impact_summary_en: fd["impact-summary"] || null,
      impact_summary_fr: null,
      presentation_en: fd["presentation-de-l-entreprise"] || null,
      presentation_fr: null,
      challenges_en: fd.challenges || null,
      challenges_fr: null,
      contexte_rse_en: fd["contexte-rse"] || null,
      contexte_rse_fr: null,
      solution_en: fd.solution || null,
      solution_fr: null,
      impact_en: fd.impact || null,
      impact_fr: null,
      ending_en: fd.ending || null,
      ending_fr: null,
      quote_en: fd.quote || null,
      quote_fr: null,
      quote_2_en: fd["quote-2"] || null,
      quote_2_fr: null,
      quote_3_en: fd["quote-3"] || null,
      quote_3_fr: null,
      quote_author: fd["quote-author"] || null,
      quote_author_role: fd["quote-author-role"] || null,
      quote_author_picture_url: getImageUrl(item, "quote-author-picture"),
      featured: fd.featured || false,
      publish_date: fd["publish-date"] || null,
      display_on_showcase: fd["display-on-showcase"] || false,
    };

    const { data, error } = await supabase.from("customer_stories").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting customer story ${row.name_en}:`, error.message);
      continue;
    }
    idMap[item.id] = data.id;
    console.log(`  ✓ ${row.name_en}`);

    // Insert framework references
    const frameworkRefs = getMultiRef(item, "filter-referentiels");
    for (const fwId of frameworkRefs) {
      const supabaseFwId = idMap[fwId];
      if (supabaseFwId) {
        await supabase.from("customer_story_frameworks").upsert({
          customer_story_id: data.id,
          framework_id: supabaseFwId,
        });
      }
    }
  }
}

async function migrateBlogPosts() {
  console.log("Migrating blog posts...");
  const items = await fetchWebflowItems(COLLECTIONS.blogs);
  console.log(`  Found ${items.length} blog posts`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      seo_title_en: fd["new-field-seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["new-field-seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["new-field-banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      body_en: fd.body || null,
      body_fr: null,
      category_id: fd["category-2"] ? idMap[fd["category-2"]] || null : null,
      date_de_publication: fd["date-de-publication"] || null,
      author_id: fd.author ? idMap[fd.author] || null : null,
      en_avant: fd["en-avant"] || false,
      url_to_redirect: fd["url-to-redirect"] || null,
      embed_included: fd["embed-included"] || false,
      embed_included_fr: fd["embed-included-fr"] || false,
    };

    const { data, error } = await supabase.from("blog_posts").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting blog ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

async function migrateNews() {
  console.log("Migrating news...");
  const items = await fetchWebflowItems(COLLECTIONS.news);
  console.log(`  Found ${items.length} news items`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      published_date: fd["published-date"] || null,
      body_en: fd.body || null,
      body_fr: null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["new-field-banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      author_id: fd.author ? idMap[fd.author] || null : null,
      en_avant: fd["en-avant"] || false,
    };

    const { data, error } = await supabase.from("news").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting news ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

async function migrateGuides() {
  console.log("Migrating guides...");
  const items = await fetchWebflowItems(COLLECTIONS.guides);
  console.log(`  Found ${items.length} guides`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      seo_title_en: fd["seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      body_en: fd.body || null,
      body_fr: null,
      tag_id: fd.tag ? idMap[fd.tag] || null : null,
      date: fd.date || null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      author_id: fd.auteur ? idMap[fd.auteur] || null : null,
      document_url: fd.document ? (typeof fd.document === "string" ? fd.document : fd.document?.url || null) : null,
      form_en: fd.form || null,
      form_fr: null,
      display_on_collection_page_category: fd["display-on-collection-page-category"] || null,
    };

    const { data, error } = await supabase.from("guides").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting guide ${row.name_en}:`, error.message);
      continue;
    }
    idMap[item.id] = data.id;
    console.log(`  ✓ ${row.name_en}`);

    // Insert display-on-collection-page framework references
    const displayFrameworks = getMultiRef(item, "display-on-collection-page");
    for (const fwId of displayFrameworks) {
      const supabaseFwId = idMap[fwId];
      if (supabaseFwId) {
        await supabase.from("guide_display_frameworks").upsert({
          guide_id: data.id,
          framework_id: supabaseFwId,
        });
      }
    }
  }
}

async function migrateEvents() {
  console.log("Migrating events...");
  const items = await fetchWebflowItems(COLLECTIONS.events);
  console.log(`  Found ${items.length} events`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      link_to_livestorm_event: fd["link-to-lifestorm-event"] || null,
      seo_title_en: fd["seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      body_en: fd.body || null,
      body_fr: null,
      tag_id: fd.tag ? idMap[fd.tag] || null : null,
      date: fd.date || null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      author_id: fd.auteur ? idMap[fd.auteur] || null : null,
      document_url: fd.document ? (typeof fd.document === "string" ? fd.document : fd.document?.url || null) : null,
      form_en: fd.form || null,
      form_fr: null,
    };

    const { data, error } = await supabase.from("events").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting event ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

async function migrateCompanyUpdates() {
  console.log("Migrating company updates...");
  const items = await fetchWebflowItems(COLLECTIONS.companyUpdates);
  console.log(`  Found ${items.length} company updates`);

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      name_en: fd.name || "",
      name_fr: null,
      slug: fd.slug || "",
      seo_title_en: fd["seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      published_date: fd["published-date"] || null,
      body_en: fd.body || null,
      body_fr: null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["new-field-banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      author_id: fd.author ? idMap[fd.author] || null : null,
    };

    const { data, error } = await supabase.from("company_updates").upsert(row, { onConflict: "slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting company update ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

async function migrateCollectionItems(collectionId: string, frameworkSlug: string) {
  console.log(`Migrating collection items for ${frameworkSlug}...`);
  const items = await fetchWebflowItems(collectionId);
  console.log(`  Found ${items.length} items`);

  // Look up framework ID
  const { data: fw } = await supabase.from("frameworks").select("id").eq("slug", frameworkSlug).single();
  if (!fw) {
    // Create a placeholder framework
    const { data: newFw } = await supabase
      .from("frameworks")
      .upsert({ name: frameworkSlug, slug: frameworkSlug, sort_order: 99 }, { onConflict: "slug" })
      .select("id")
      .single();
    if (!newFw) {
      console.error(`  Could not find or create framework ${frameworkSlug}`);
      return;
    }
    var frameworkId = newFw.id;
  } else {
    var frameworkId = fw.id;
  }

  for (const item of items) {
    const fd = item.fieldData || {};
    const row = {
      framework_id: frameworkId,
      slug: fd.slug || "",
      name_en: fd.name || "",
      name_fr: null,
      seo_title_en: fd["new-field-seo-title-tag"] || null,
      seo_title_fr: null,
      seo_meta_desc_en: fd["new-field-seo-meta-desc"] || null,
      seo_meta_desc_fr: null,
      banner_url: getImageUrl(item, "banner"),
      banner_alt_desc: fd["new-field-banner-alt-desc"] || null,
      description_en: fd.description || null,
      description_fr: null,
      body_en: fd.body || null,
      body_fr: null,
      date_de_publication: fd["date-de-publication"] || null,
      author_id: fd.author ? idMap[fd.author] || null : null,
      categorie: fd.categorie || null,
      ordre: fd.ordre || 0,
    };

    const { data, error } = await supabase.from("collection_items").upsert(row, { onConflict: "framework_id,slug" }).select("id").single();
    if (error) {
      console.error(`  Error inserting ${row.name_en}:`, error.message);
    } else {
      idMap[item.id] = data.id;
      console.log(`  ✓ ${row.name_en}`);
    }
  }
}

// ============================================================
// MAIN
// ============================================================

async function main() {
  console.log("=== Webflow → Supabase Migration ===\n");

  if (!WEBFLOW_TOKEN) {
    console.error("Missing WEBFLOW_API_TOKEN env var");
    process.exit(1);
  }
  if (!SUPABASE_URL) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL env var");
    process.exit(1);
  }

  // Order matters: reference tables first, then content tables
  await migrateAuthors();
  await migrateIndustries();
  await migrateFrameworks();
  await migrateTestimonials();
  await migrateCustomerStories();
  await migrateBlogPosts();
  await migrateNews();
  await migrateGuides();
  await migrateEvents();
  await migrateCompanyUpdates();

  // Framework collection items
  await migrateCollectionItems(COLLECTIONS.collectionEcovadis, "ecovadis");
  await migrateCollectionItems(COLLECTIONS.collectionCdp, "cdp");
  await migrateCollectionItems(COLLECTIONS.collectionIso14001, "iso-14001");
  await migrateCollectionItems(COLLECTIONS.collectionVsme, "vsme");
  await migrateCollectionItems(COLLECTIONS.collectionCsrd, "csrd");
  await migrateCollectionItems(COLLECTIONS.collectionSbti, "sbti");
  await migrateCollectionItems(COLLECTIONS.collectionPositiveCompany, "positive-company");

  console.log("\n=== Migration complete! ===");
  console.log(`Total items mapped: ${Object.keys(idMap).length}`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
