import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { SectionContactSidebar } from "../../../components/SectionContactSidebarI18n";
import { SectionCtaPill } from "../../../components/SectionCtaPillI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";
import { localizedHref } from "../../../lib/localized-paths";
import { supabase } from "../../../lib/supabase";

// Frameworks that have a /collection/{slug} page
const COLLECTION_SLUGS = new Set(["ecovadis", "cdp", "vsme", "csrd"]);

async function getFrameworksByType() {
  const { data, error } = await supabase
    .from("frameworks")
    .select("*")
    .order("name");

  if (error) throw error;

  const groups: Record<string, typeof data> = {
    Security: [],
    Privacy: [],
    Others: [],
  };

  for (const fw of data || []) {
    const type = fw.frameworks_type;
    if (type && groups[type]) {
      groups[type].push(fw);
    }
  }

  // Sort: items with page_url or collection come first
  for (const key of Object.keys(groups)) {
    groups[key].sort((a: any, b: any) => {
      const aHasLink = (a.page_url || COLLECTION_SLUGS.has(a.slug)) ? 1 : 0;
      const bHasLink = (b.page_url || COLLECTION_SLUGS.has(b.slug)) ? 1 : 0;
      return bHasLink - aHasLink;
    });
  }

  return groups;
}

export const revalidate = 3600;

export default async function FrameworksPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const groups = await getFrameworksByType().catch(() => ({
    Security: [],
    Privacy: [],
    Others: [],
  }));

  const categories = [
    { id: "security", tab: t("frameworksIndex.allFrameworks.tab1"), heading: t("frameworksIndex.allFrameworks.category1"), items: groups.Security },
    { id: "privacy", tab: t("frameworksIndex.allFrameworks.tab2"), heading: t("frameworksIndex.allFrameworks.category2"), items: groups.Privacy },
    { id: "others", tab: t("frameworksIndex.allFrameworks.tab3"), heading: t("frameworksIndex.allFrameworks.category3"), items: groups.Others },
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
              <div className="container-84rem">
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

        {/* Contact section with form */}
        <SectionContactSidebar
          title={t("frameworksIndex.hero.title")}
          subtitle={t("frameworksIndex.hero.subtitle")}
          hubspotFormId={process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID!}
        />

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
              <div className="container-84rem">
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
                            const pageHref = fw.page_url
                              ? localizedHref(fw.page_url.replace(/^\/(en|fr)/, ""), locale)
                              : null;
                            const collectionHref = COLLECTION_SLUGS.has(fw.slug)
                              ? `${prefix}/collection/${fw.slug}`
                              : null;
                            return (
                              <div key={fw.slug} role="listitem" className="w-dyn-item">
                                <div className="frameworks_list_card">
                                  <h3 className="heading-size-1x375rem">{fw.name}</h3>
                                  <div className="spacer-0x75rem" />
                                  {(fw.description || fw.description_fr) && (
                                    <p className="text-size-1rem text-color-neutral">
                                      {locale === "fr" && fw.description_fr ? fw.description_fr : fw.description}
                                    </p>
                                  )}
                                  <div className="spacer-auto" />
                                  {(pageHref || collectionHref) && (
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

        {/* CTA Pill */}
        <SectionCtaPill />

        <Footer />
      </main>
    </div>
  );
}
