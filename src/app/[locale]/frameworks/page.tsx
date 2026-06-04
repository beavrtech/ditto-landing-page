"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../../components/NavbarI18n";
import { Footer } from "../../../components/FooterI18n";
import { SectionBreadcrumbs } from "../../../../webflow/sections/SectionBreadcrumbs";
import { SectionContactSidebar } from "../../../components/SectionContactSidebarI18n";
import { SectionCtaPill } from "../../../components/SectionCtaPillI18n";
import { SectionCta } from "../../../../webflow/sections/SectionCta";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";

export default function FrameworksPage() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* 1. Breadcrumbs */}
        <SectionBreadcrumbs
          backgroundBackground="Primary"
          item1Item1Text={t("frameworksIndex.breadcrumb1")}
          item1Item1Link={{ href: `${prefix}/frameworks` }}
          item2Item2Visibility={true}
          item2Item2Text={t("frameworksIndex.breadcrumb2")}
          item2Item2Link={{ href: `${prefix}/frameworks` }}
          item3Item3Visibility={false}
        />

        {/* 2. Contact section with form */}
        <SectionContactSidebar
          title={t("frameworksIndex.hero.title")}
          subtitle={t("frameworksIndex.hero.subtitle")}
          hubspotFormId={process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_FORM_ID!}
        />

        {/* 3. Generic section - "All frameworks" with CMS lists (NotSupported) */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
              <div className="container-64rem">
                <div className="header">
                  <h1 className="heading-size-3rem">{t("frameworksIndex.allFrameworks.title")}<br /></h1>
                  <div className="spacer-1x5rem" />
                </div>
              </div>
              <div className="agents_ui_nav">
                <div className="agents_ui_list">
                  <a href="#security" className="blogui_link">{t("frameworksIndex.allFrameworks.tab1")}</a>
                  <a href="#privacy" className="blogui_link">{t("frameworksIndex.allFrameworks.tab2")}</a>
                  <a href="#others" className="blogui_link">{t("frameworksIndex.allFrameworks.tab3")}</a>
                </div>
              </div>
              <div className="container-84rem">
                <div id="security" className="frameworks_category">
                  <div className="frameworks_category_header">
                    <p className="heading-size-2rem">{t("frameworksIndex.allFrameworks.category1")}</p>
                  </div>
                  <div className="spacer-2x5rem" />
                  {/* Collection List - NotSupported */}
                  <div className="w-dyn-list">
                    <div role="list" className="frameworks_list w-dyn-items">
                      <div role="listitem" className="w-dyn-item">
                        <div className="frameworks_list_card">
                          <h3 className="heading-size-1x375rem w-dyn-bind-empty" />
                          <div className="spacer-0x75rem" />
                          <p className="text-size-1rem text-color-neutral w-dyn-bind-empty" />
                          <div className="spacer-auto" />
                        </div>
                      </div>
                    </div>
                    <div className="w-dyn-empty">
                      <div>No items found.</div>
                    </div>
                  </div>
                </div>
                <div id="privacy" className="frameworks_category">
                  <div className="frameworks_category_header">
                    <p className="heading-size-2rem">{t("frameworksIndex.allFrameworks.category2")}</p>
                  </div>
                  <div className="spacer-2x5rem" />
                  {/* Collection List - NotSupported */}
                  <div className="w-dyn-list">
                    <div role="list" className="frameworks_list w-dyn-items">
                      <div role="listitem" className="w-dyn-item">
                        <div className="frameworks_list_card">
                          <h3 className="heading-size-1x375rem w-dyn-bind-empty" />
                          <div className="spacer-0x75rem" />
                          <p className="text-size-1rem text-color-neutral w-dyn-bind-empty" />
                          <div className="spacer-auto" />
                        </div>
                      </div>
                    </div>
                    <div className="w-dyn-empty">
                      <div>No items found.</div>
                    </div>
                  </div>
                </div>
                <div id="others" className="frameworks_category">
                  <div className="frameworks_category_header">
                    <p className="heading-size-2rem">{t("frameworksIndex.allFrameworks.category3")}</p>
                  </div>
                  <div className="spacer-2x5rem" />
                  {/* Collection List - NotSupported */}
                  <div className="w-dyn-list">
                    <div role="list" className="frameworks_list w-dyn-items">
                      <div role="listitem" className="w-dyn-item">
                        <div className="frameworks_list_card">
                          <h3 className="heading-size-1x375rem w-dyn-bind-empty" />
                          <div className="spacer-0x75rem" />
                          <p className="text-size-1rem text-color-neutral w-dyn-bind-empty" />
                          <div className="spacer-auto" />
                        </div>
                      </div>
                    </div>
                    <div className="w-dyn-empty">
                      <div>No items found.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        {/* 4. CTA Pill */}
        <SectionCtaPill />

        {/* 5. Blog preview - CMS driven, empty */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="blog-preview_section">
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        {/* 6. CTA */}
        <SectionCta
          title={t("cta.title")}
          paragraph={t("cta.subtitle")}
          buttonText={t("cta.button")}
          buttonLink={{ href: `${prefix}/get-started` }}
        />

        <Footer />
      </main>
    </div>
  );
}
