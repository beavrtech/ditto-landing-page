import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { SectionCtaPill } from "../../../components/SectionCtaPillI18n";
import { SectionCta } from "../../../../devlink/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../devlink/devlinkScope";
import { supabase } from "../../../lib/supabase";

// Frameworks that have a /collection/{slug} page
const COLLECTION_SLUGS = new Set(["ecovadis", "cdp", "vsme", "csrd", "carbon"]);

// Internal group keys — used only as the `frameworks_type` DB values and as
// JS object keys below. User-facing labels come from the `frameworksIndex`
// translations (tab1/2/3, category1/2/3), not from these identifiers.
// - Certifications: third-party ratings, certifications & CSR labels
//   (EcoVadis, CDP, MSCI, Sustainalytics, B Corp, Label Engagé RSE, Positive
//   Company Label).
// - Reporting: EU/regulatory sustainability reporting & disclosure
//   (VSME, CSRD, Bilan carbone, Mid Cap Standards, UN Global Compact,
//   Sapin II Law, GDPR).
// - ISO: ISO management-system standards.
async function getFrameworksByType() {
  const { data, error } = await supabase
    .from("frameworks")
    .select("*")
    .order("name");

  if (error) throw error;

  const groups: Record<string, typeof data> = {
    Certifications: [],
    Reporting: [],
    ISO: [],
  };

  for (const fw of data || []) {
    const type = fw.frameworks_type;
    if (type && groups[type]) {
      groups[type].push(fw);
    }
  }

  // Sort purely by the stakeholder-given manual order (`sort_order` column,
  // ascending), with name as a stable tiebreak when sort_order is equal or
  // unset — this replaces the previous "has-link-first, then alphabetical"
  // sort, which doesn't reflect the intended manual ordering.
  for (const key of Object.keys(groups)) {
    groups[key].sort((a: any, b: any) => {
      const aOrder = a.sort_order ?? Number.MAX_SAFE_INTEGER;
      const bOrder = b.sort_order ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return String(a.name).localeCompare(String(b.name));
    });
  }

  return groups;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("frameworksIndex.title"),
    description: t("frameworksIndex.description"),
    alternates: {
      canonical: `https://www.trustditto.com/${locale}/frameworks`,
      languages: {
        "x-default": "https://www.trustditto.com/en/frameworks",
        en: "https://www.trustditto.com/en/frameworks",
        fr: "https://www.trustditto.com/fr/frameworks",
      },
    },
    openGraph: {
      title: t("frameworksIndex.title"),
      description: t("frameworksIndex.description"),
      images: [{ url: "https://www.trustditto.com/images/og-default.jpg" }],
    },
  };
}

export const revalidate = 3600;

export default async function FrameworksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const groups = await getFrameworksByType().catch(() => ({
    Certifications: [],
    Reporting: [],
    ISO: [],
  }));

  const categories = [
    { id: "certifications", tab: t("frameworksIndex.allFrameworks.tab1"), heading: t("frameworksIndex.allFrameworks.category1"), items: groups.Certifications },
    { id: "reporting", tab: t("frameworksIndex.allFrameworks.tab2"), heading: t("frameworksIndex.allFrameworks.category2"), items: groups.Reporting },
    { id: "iso", tab: t("frameworksIndex.allFrameworks.tab3"), heading: t("frameworksIndex.allFrameworks.category3"), items: groups.ISO },
  ];

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="breadcrumbs_section">
            <div className="padding-global">
              <div className="spacer-1x5rem" />
              <div className="container-80rem">
                <div className="breadcrumbs_list">
                  <a href={`${prefix}/frameworks`} className="link-size-1rem">{t("frameworksIndex.breadcrumb1")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        {/* All frameworks */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
              <div className="container-64rem">
                <div className="header">
                  <h1 className="heading-size-3rem">{t("frameworksIndex.allFrameworks.title")}</h1>
                  <div className="spacer-1x5rem" />
                </div>
              </div>
              <div className="agents_ui_nav">
                <div className="agents_ui_list">
                  {categories.map((cat) => (
                    <a key={cat.id} href={`#${cat.id}`} className="blogui_link">{cat.tab}</a>
                  ))}
                </div>
              </div>
              <div className="container-80rem">
                {categories.map((cat) => (
                  <div key={cat.id} id={cat.id} className="frameworks_category">
                    <div className="frameworks_category_header">
                      <p className="heading-size-2rem">{cat.heading}</p>
                    </div>
                    <div style={{ height: "2.5rem" }} />
                    {cat.items.length > 0 ? (
                      <div className="w-dyn-list">
                        <div role="list" className="frameworks_list w-dyn-items">
                          {cat.items.map((fw: any) => {
                            // page_url is stored locale-agnostic (e.g.
                            // /frameworks/carbon). Framework paths are not
                            // localised — just prefix the current locale. The
                            // strip handles any legacy /en|/fr-prefixed values.
                            const pageHref = fw.page_url
                              ? `${prefix}${fw.page_url.replace(/^\/(en|fr)\//, "/")}`
                              : null;
                            const displayName =
                              locale === "fr" && fw.name_fr ? fw.name_fr : fw.name;
                            const collectionHref = COLLECTION_SLUGS.has(fw.slug)
                              ? `${prefix}/collection/${fw.slug}`
                              : null;
                            return (
                              <div key={fw.slug} role="listitem" className="w-dyn-item">
                                <div className="frameworks_list_card">
                                  <h3 className="heading-size-1x375rem">{displayName}</h3>
                                  <div className="spacer-0x75rem" />
                                  {(fw.description || fw.description_fr) && (
                                    <p className="text-size-1rem text-color-neutral">
                                      {locale === "fr" && fw.description_fr ? fw.description_fr : fw.description}
                                    </p>
                                  )}
                                  <div className="spacer-auto" />
                                  {(pageHref || collectionHref || fw.slug === "vsme") && (
                                    <div className="button-group" style={{ marginTop: "1.5rem" }}>
                                      {pageHref && (
                                        <a href={pageHref} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 is--small">
                                          {t("frameworksIndex.readMore")}
                                        </a>
                                      )}
                                      {collectionHref && (
                                        <a href={collectionHref} className="button is--small">
                                          {t("frameworksIndex.resources")}
                                        </a>
                                      )}
                                      {/* VSME <-> CSRD cross-link: the two are closely related EU
                                          reporting standards, so surface a quick pointer from the
                                          VSME card to the CSRD framework page — styled as the same
                                          yellow button used for "Read more" elsewhere on this page. */}
                                      {fw.slug === "vsme" && (
                                        <a
                                          href={`${prefix}/frameworks/csrd`}
                                          className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 is--small"
                                        >
                                          {t("frameworksIndex.vsmeCsrdLink")}
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="w-dyn-empty"><div>No items found.</div></div>
                    )}
                  </div>
                ))}
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        {/* CTA banner — the frameworks index previously had no dedicated
            call-to-action of its own before the closing CTA pill. */}
        <SectionCta
          title={t("frameworksIndex.cta.title")}
          paragraph={t("frameworksIndex.cta.paragraph")}
          buttonText={t("frameworksIndex.cta.button")}
          buttonLink={{ href: `${prefix}/demo` }}
        />

        {/* CTA Pill */}
        <SectionCtaPill />

        <Footer />
      </main>
    </div>
  );
}
