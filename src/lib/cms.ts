import { supabase } from "./supabase";

type Locale = "en" | "fr";

// Helper to pick the right locale field
function localized<T extends Record<string, any>>(
  item: T,
  field: string,
  locale: Locale
): string {
  return item[`${field}_${locale}`] || item[`${field}_en`] || "";
}

// ============================================================
// AUTHORS
// ============================================================

export async function getAuthors() {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getAuthorBySlug(slug: string) {
  const { data, error } = await supabase
    .from("authors")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// INDUSTRIES
// ============================================================

export async function getIndustries(locale: Locale) {
  const { data, error } = await supabase
    .from("industries")
    .select("*")
    .order("name_en");

  if (error) throw error;

  return data?.map((ind) => ({
    ...ind,
    name: localized(ind, "name", locale),
  }));
}

// ============================================================
// FRAMEWORKS
// ============================================================

export async function getFrameworks() {
  const { data, error } = await supabase
    .from("frameworks")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return data;
}

export async function getFilterFrameworks() {
  const { data, error } = await supabase
    .from("frameworks")
    .select("*")
    .eq("is_filter", true)
    .order("sort_order");

  if (error) throw error;
  return data;
}

// ============================================================
// TESTIMONIALS
// ============================================================

export async function getTestimonials(locale: Locale) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("published", true)
    .eq("archived", false)
    .order("sort_order");

  if (error) throw error;

  return data?.map((t) => ({
    ...t,
    quote: localized(t, "quote", locale),
  }));
}

// ============================================================
// COMPANY LOGOS (logo strip)
// ============================================================

export async function getCompanyLogos() {
  const { data, error } = await supabase
    .from("company_logos")
    .select("*")
    .eq("published", true)
    .order("sort_order");

  if (error) throw error;
  return data;
}

/** Customers selected for the homepage logo strip, in homepage_order. */
export async function getHomepageCustomers() {
  const { data, error } = await supabase
    .from("company_logos")
    .select("*")
    .eq("published", true)
    .not("homepage_order", "is", null)
    .order("homepage_order");

  if (error) throw error;
  return data;
}

/** Published customers tagged with the given industry slug (for /industry/[slug]). */
export async function getCustomersByIndustry(industrySlug: string) {
  const { data, error } = await supabase
    .from("company_logos")
    .select("*")
    .eq("published", true)
    .eq("industry", industrySlug)
    .order("homepage_order", { ascending: true, nullsFirst: false })
    .order("sort_order");

  if (error) throw error;
  return data;
}

// ============================================================
// CUSTOMER STORIES
// ============================================================

export async function getCustomerStories(locale: Locale) {
  const { data, error } = await supabase
    .from("customer_stories")
    .select(
      "*, industry:industries(*), customer_story_frameworks(framework:frameworks(*))"
    )
    .eq("published", true)
    .eq("archived", false)
    .order("publish_date", { ascending: false });

  if (error) throw error;

  return data?.map((story) => ({
    ...story,
    name: localized(story, "name", locale),
    description: localized(story, "description", locale),
    about: localized(story, "about", locale),
    medaille: localized(story, "medaille", locale),
    seo_title: localized(story, "seo_title", locale),
    seo_meta_desc: localized(story, "seo_meta_desc", locale),
    challenge_summary: localized(story, "challenge_summary", locale),
    impact_summary: localized(story, "impact_summary", locale),
    presentation: localized(story, "presentation", locale),
    challenges: localized(story, "challenges", locale),
    contexte_rse: localized(story, "contexte_rse", locale),
    solution: localized(story, "solution", locale),
    impact: localized(story, "impact", locale),
    ending: localized(story, "ending", locale),
    quote: localized(story, "quote", locale),
    quote_2: localized(story, "quote_2", locale),
    quote_3: localized(story, "quote_3", locale),
    frameworks:
      story.customer_story_frameworks?.map((csf: any) => csf.framework) || [],
  }));
}

export async function getFeaturedCustomerStories(locale: Locale) {
  const { data, error } = await supabase
    .from("customer_stories")
    .select(
      "*, industry:industries(*), customer_story_frameworks(framework:frameworks(*))"
    )
    .eq("published", true)
    .eq("archived", false)
    .eq("featured", true)
    .order("publish_date", { ascending: false });

  if (error) throw error;

  return data?.map((story) => ({
    ...story,
    name: localized(story, "name", locale),
    description: localized(story, "description", locale),
    quote: localized(story, "quote", locale),
    frameworks:
      story.customer_story_frameworks?.map((csf: any) => csf.framework) || [],
  }));
}

export async function getShowcaseCustomerStories(locale: Locale) {
  const { data, error } = await supabase
    .from("customer_stories")
    .select(
      "*, industry:industries(*), customer_story_frameworks(framework:frameworks(*))"
    )
    .eq("published", true)
    .eq("archived", false)
    .eq("display_on_showcase", true)
    .order("publish_date", { ascending: false });

  if (error) throw error;

  return data?.map((story) => ({
    ...story,
    name: localized(story, "name", locale),
    description: localized(story, "description", locale),
    frameworks:
      story.customer_story_frameworks?.map((csf: any) => csf.framework) || [],
  }));
}

export async function getCustomerStoryBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("customer_stories")
    .select(
      "*, industry:industries(*), customer_story_frameworks(framework:frameworks(*))"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    // Try French slug
    const frResult = await supabase
      .from("customer_stories")
      .select(
        "*, industry:industries(*), customer_story_frameworks(framework:frameworks(*))"
      )
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    description: localized(data, "description", locale),
    about: localized(data, "about", locale),
    medaille: localized(data, "medaille", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    challenge_summary: localized(data, "challenge_summary", locale),
    impact_summary: localized(data, "impact_summary", locale),
    presentation: localized(data, "presentation", locale),
    challenges: localized(data, "challenges", locale),
    contexte_rse: localized(data, "contexte_rse", locale),
    solution: localized(data, "solution", locale),
    impact: localized(data, "impact", locale),
    ending: localized(data, "ending", locale),
    quote: localized(data, "quote", locale),
    quote_2: localized(data, "quote_2", locale),
    quote_3: localized(data, "quote_3", locale),
    frameworks:
      data.customer_story_frameworks?.map((csf: any) => csf.framework) || [],
  };
}

// ============================================================
// BLOG POSTS
// ============================================================

/**
 * Map of published collection-item EN slug -> { slug, slug_fr, framework }.
 * Used to detect blog posts that duplicate a collection item so the blog URL
 * can redirect to the canonical collection version at
 * /collection/[framework]/[slug].
 */
export async function getCollectionSlugMap(): Promise<
  Map<string, { slug: string; slug_fr: string | null; framework: string }>
> {
  const { data, error } = await supabase
    .from("collection_items")
    .select("slug, slug_fr, framework:frameworks(slug)")
    .eq("published", true)
    .eq("archived", false);
  if (error) throw error;
  const map = new Map<string, { slug: string; slug_fr: string | null; framework: string }>();
  for (const item of (data || []) as any[]) {
    const framework = item.framework?.slug;
    if (!framework) continue;
    map.set(item.slug, { slug: item.slug, slug_fr: item.slug_fr, framework });
  }
  return map;
}

/**
 * Attaches each post's collection twin (if any) as `collectionTwin` so links
 * can target the canonical collection URL instead of the blog URL (which
 * redirects). See {@link getCollectionSlugMap} and `articleHref`.
 */
export async function withCollectionTwins<T extends { slug: string }>(
  posts: T[]
): Promise<(T & { collectionTwin: { slug: string; slug_fr: string | null; framework: string } | null })[]> {
  const map = await getCollectionSlugMap().catch(() => new Map());
  return (posts || []).map((p) => ({ ...p, collectionTwin: map.get(p.slug) || null }));
}

export async function getBlogPosts(locale: Locale, limit?: number) {
  let query = supabase
    .from("blog_posts")
    .select("*, author:authors(*), category:frameworks(*)")
    .eq("published", true)
    .eq("archived", false)
    .order("date_de_publication", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return data?.map((post) => ({
    ...post,
    name: localized(post, "name", locale),
    seo_title: localized(post, "seo_title", locale),
    seo_meta_desc: localized(post, "seo_meta_desc", locale),
    description: localized(post, "description", locale),
    body: localized(post, "body", locale),
  }));
}

export async function getFeaturedBlogPosts(locale: Locale) {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:authors(*), category:frameworks(*)")
    .eq("published", true)
    .eq("archived", false)
    .eq("en_avant", true)
    .order("date_de_publication", { ascending: false });

  if (error) throw error;

  return data?.map((post) => ({
    ...post,
    name: localized(post, "name", locale),
    description: localized(post, "description", locale),
    body: localized(post, "body", locale),
  }));
}

export async function getBlogPostBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("blog_posts")
    .select("*, author:authors(*), category:frameworks(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("blog_posts")
      .select("*, author:authors(*), category:frameworks(*)")
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
  };
}

// ============================================================
// NEWS
// ============================================================

export async function getNews(locale: Locale, limit?: number) {
  let query = supabase
    .from("news")
    .select("*, author:authors(*)")
    .eq("published", true)
    .eq("archived", false)
    .order("published_date", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return data?.map((item) => ({
    ...item,
    name: localized(item, "name", locale),
    seo_title: localized(item, "seo_title", locale),
    seo_meta_desc: localized(item, "seo_meta_desc", locale),
    description: localized(item, "description", locale),
    body: localized(item, "body", locale),
  }));
}

export async function getFeaturedNews(locale: Locale) {
  const { data, error } = await supabase
    .from("news")
    .select("*, author:authors(*)")
    .eq("published", true)
    .eq("archived", false)
    .eq("en_avant", true)
    .order("published_date", { ascending: false });

  if (error) throw error;

  return data?.map((item) => ({
    ...item,
    name: localized(item, "name", locale),
    seo_title: localized(item, "seo_title", locale),
    seo_meta_desc: localized(item, "seo_meta_desc", locale),
    description: localized(item, "description", locale),
    body: localized(item, "body", locale),
  }));
}

export async function getNewsItemBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("news")
    .select("*, author:authors(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("news")
      .select("*, author:authors(*)")
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
  };
}

// ============================================================
// GUIDES
// ============================================================

export async function getGuides(locale: Locale, limit?: number) {
  let query = supabase
    .from("guides")
    .select(
      "*, author:authors(*), tag:frameworks!guides_tag_id_fkey(*), guide_display_frameworks(framework:frameworks!guide_display_frameworks_framework_id_fkey(*))"
    )
    .eq("published", true)
    .eq("archived", false)
    .order("date", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;

  return data?.map((guide) => ({
    ...guide,
    name: localized(guide, "name", locale),
    seo_title: localized(guide, "seo_title", locale),
    seo_meta_desc: localized(guide, "seo_meta_desc", locale),
    description: localized(guide, "description", locale),
    body: localized(guide, "body", locale),
    form: localized(guide, "form", locale),
    display_frameworks:
      guide.guide_display_frameworks?.map((gdf: any) => gdf.framework) || [],
  }));
}

export async function getGuideBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("guides")
    .select(
      "*, author:authors(*), tag:frameworks!guides_tag_id_fkey(*), guide_display_frameworks(framework:frameworks!guide_display_frameworks_framework_id_fkey(*))"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("guides")
      .select(
        "*, author:authors(*), tag:frameworks!guides_tag_id_fkey(*), guide_display_frameworks(framework:frameworks!guide_display_frameworks_framework_id_fkey(*))"
      )
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
    form: localized(data, "form", locale),
    display_frameworks:
      data.guide_display_frameworks?.map((gdf: any) => gdf.framework) || [],
  };
}

// ============================================================
// EVENTS
// ============================================================

export async function getEvents(locale: Locale) {
  const { data, error } = await supabase
    .from("events")
    .select("*, author:authors(*), tag:frameworks(*)")
    .eq("published", true)
    .eq("archived", false)
    .order("date", { ascending: false });

  if (error) throw error;

  return data?.map((event) => ({
    ...event,
    name: localized(event, "name", locale),
    seo_title: localized(event, "seo_title", locale),
    seo_meta_desc: localized(event, "seo_meta_desc", locale),
    description: localized(event, "description", locale),
    body: localized(event, "body", locale),
    form: localized(event, "form", locale),
  }));
}

export async function getEventBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("events")
    .select("*, author:authors(*), tag:frameworks(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("events")
      .select("*, author:authors(*), tag:frameworks(*)")
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
    form: localized(data, "form", locale),
  };
}

// ============================================================
// COMPANY UPDATES
// ============================================================

export async function getCompanyUpdates(locale: Locale) {
  const { data, error } = await supabase
    .from("company_updates")
    .select("*, author:authors(*)")
    .eq("published", true)
    .eq("archived", false)
    .order("published_date", { ascending: false });

  if (error) throw error;

  return data?.map((item) => ({
    ...item,
    name: localized(item, "name", locale),
    seo_title: localized(item, "seo_title", locale),
    seo_meta_desc: localized(item, "seo_meta_desc", locale),
    description: localized(item, "description", locale),
    body: localized(item, "body", locale),
  }));
}

export async function getCompanyUpdateBySlug(slug: string, locale: Locale) {
  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("company_updates")
    .select("*, author:authors(*)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("company_updates")
      .select("*, author:authors(*)")
      .eq("slug_fr", slug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
  };
}

// ============================================================
// FRAMEWORK COLLECTION ITEMS
// (EcoVadis, CDP, ISO 14001, VSMEs, CSRDs, SBTis, Positive Companies)
// ============================================================

export async function getCollectionItems(
  frameworkSlug: string,
  locale: Locale
) {
  const { data: fw } = await supabase
    .from("frameworks")
    .select("id")
    .eq("slug", frameworkSlug)
    .single();

  if (!fw) return [];

  // 1. Native collection items
  const { data, error } = await supabase
    .from("collection_items")
    .select("*, author:authors(*)")
    .eq("published", true)
    .eq("archived", false)
    .eq("framework_id", fw.id)
    .order("ordre");

  if (error) throw error;

  const items = (data || []).map((item) => ({
    ...item,
    name: localized(item, "name", locale),
    seo_title: localized(item, "seo_title", locale),
    seo_meta_desc: localized(item, "seo_meta_desc", locale),
    description: localized(item, "description", locale),
    body: localized(item, "body", locale),
    _type: "collection_item" as const,
  }));

  // 2. Linked guides (via guide_display_frameworks)
  const { data: linkedGuides } = await supabase
    .from("guide_display_frameworks")
    .select("guide:guides!guide_display_frameworks_guide_id_fkey(*, author:authors(*))")
    .eq("framework_id", fw.id);

  const guideItems = (linkedGuides || [])
    .map((row: any) => row.guide)
    .filter((g: any) => g && g.published !== false && g.archived !== true)
    .map((guide: any) => {
      // Map "Succeeding with X" → "Succeeding with EcoVadis" etc.
      const catTemplate = guide.display_on_collection_page_category || "";
      const fwNameMap: Record<string, string> = {
        ecovadis: "EcoVadis",
        cdp: "CDP",
        vsme: "VSME",
        "iso-14001": "ISO 14001",
        csrd: "CSRD",
        sbti: "SBTi",
      };
      const fwName = fwNameMap[frameworkSlug] || frameworkSlug;
      const categorie = catTemplate.replace(/X/g, fwName);

      return {
        ...guide,
        slug: guide.slug,
        slug_fr: guide.slug_fr,
        name: localized(guide, "name", locale),
        description: localized(guide, "description", locale),
        body: localized(guide, "body", locale),
        categorie,
        banner_url: guide.banner_url,
        _type: "guide" as const,
      };
    });

  return [...items, ...guideItems];
}

export async function getCollectionItemBySlug(
  frameworkSlug: string,
  itemSlug: string,
  locale: Locale
) {
  const { data: fw } = await supabase
    .from("frameworks")
    .select("id")
    .eq("slug", frameworkSlug)
    .single();

  if (!fw) return null;

  // Try English slug first, then French slug
  let { data, error } = await supabase
    .from("collection_items")
    .select("*, author:authors(*)")
    .eq("framework_id", fw.id)
    .eq("slug", itemSlug)
    .eq("published", true)
    .single();

  if (error || !data) {
    const frResult = await supabase
      .from("collection_items")
      .select("*, author:authors(*)")
      .eq("framework_id", fw.id)
      .eq("slug_fr", itemSlug)
      .eq("published", true)
      .single();
    data = frResult.data;
    error = frResult.error;
  }

  if (error) return null;
  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    seo_title: localized(data, "seo_title", locale),
    seo_meta_desc: localized(data, "seo_meta_desc", locale),
    description: localized(data, "description", locale),
    body: localized(data, "body", locale),
  };
}

// ============================================================
// GUIDE BY FRAMEWORK (for sidebar)
// ============================================================

export async function getGuideByFrameworkId(frameworkId: string, locale: Locale) {
  // First try via tag_id direct FK
  let { data } = await supabase
    .from("guides")
    .select("*, tag:frameworks!guides_tag_id_fkey(*)")
    .eq("published", true)
    .eq("archived", false)
    .eq("tag_id", frameworkId)
    .order("date", { ascending: false })
    .limit(1)
    .single();

  // If no direct match, try via guide_display_frameworks junction
  if (!data) {
    const { data: junction } = await supabase
      .from("guide_display_frameworks")
      .select("guide_id")
      .eq("framework_id", frameworkId)
      .limit(1)
      .single();

    if (junction) {
      const { data: guide } = await supabase
        .from("guides")
        .select("*, tag:frameworks!guides_tag_id_fkey(*)")
        .eq("id", junction.guide_id)
        .eq("published", true)
        .eq("archived", false)
        .single();
      data = guide;
    }
  }

  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    description: localized(data, "description", locale),
    slug_fr: data.slug_fr,
  };
}

const DEFAULT_GUIDE_SLUG = "ecovadis-guide-3-weeks-to-succeed-in-your-csr-assessment";

export async function getFeaturedGuide(locale: Locale) {
  const { data } = await supabase
    .from("guides")
    .select("*, tag:frameworks!guides_tag_id_fkey(*)")
    .eq("slug", DEFAULT_GUIDE_SLUG)
    .single();

  if (!data) return null;

  return {
    ...data,
    name: localized(data, "name", locale),
    description: localized(data, "description", locale),
    slug_fr: data.slug_fr,
  };
}

// ============================================================
// COMBINED: All resources (blog + guides + news) for the resources hub
// ============================================================

export async function getAllResources(locale: Locale, limit?: number) {
  const [blogs, guidesData, newsData] = await Promise.all([
    getBlogPosts(locale, limit),
    getGuides(locale, limit),
    getNews(locale, limit),
  ]);

  const all = [
    ...(blogs || []).map((b) => ({
      ...b,
      type: "blog" as const,
      published_at: b.date_de_publication,
    })),
    ...(guidesData || []).map((g) => ({
      ...g,
      type: "guide" as const,
      published_at: g.date,
    })),
    ...(newsData || []).map((n) => ({
      ...n,
      type: "news" as const,
      published_at: n.published_date,
    })),
  ];

  all.sort((a, b) => {
    const dateA = a.published_at ? new Date(a.published_at).getTime() : 0;
    const dateB = b.published_at ? new Date(b.published_at).getTime() : 0;
    return dateB - dateA;
  });

  return limit ? all.slice(0, limit) : all;
}

// ============================================================
// CATEGORY TRANSLATIONS
// ============================================================

export async function getCategoryTranslations(): Promise<Record<string, string>> {
  const { data, error } = await supabase
    .from("category_translations")
    .select("name_en, name_fr");

  if (error) throw error;

  const map: Record<string, string> = {};
  for (const row of data || []) {
    map[row.name_en] = row.name_fr;
  }
  return map;
}
