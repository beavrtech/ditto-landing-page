"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../../components/NavbarI18n";
import { Footer } from "../../../components/FooterI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";

export default function CustomerStoriesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          {/* Breadcrumbs */}
          <section className="breadcrumbs_section">
            <div className="padding-global">
              <div className="spacer-1x5rem"></div>
              <div className="container-84rem">
                <div className="breadcrumbs_list">
                  <a href={`${prefix}/customer-stories`} className="link-size-1rem">{t("customerStories.breadcrumb")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Filter UI / Header */}
          <section className="filterui_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-55rem">
                <div className="header">
                  <h1 className="heading-size-4rem">{t("customerStories.title")}</h1>
                  <div className="spacer-1x5rem"></div>
                  <p className="text-size-1x375rem">{t("customerStories.subtitle")}</p>
                </div>
                <div className="spacer-3rem"></div>
                {/* Filter dropdowns - CMS-driven, placeholder for now */}
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Customer stories list (Collection List - CMS content will come later) */}
          <section className="blog-preview_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-84rem">
                <div className="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background"></div>
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
