"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../../components/NavbarI18n";
import { Footer } from "../../../components/FooterI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";

export default function ResourcesPage() {
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
                  <a href={`${prefix}/resources`} className="link-size-1rem">{t("resourcesPage.breadcrumb")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background"></div>
            </div>
          </section>

          {/* Filter UI / Header */}
          <section className="filterui_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-55rem">
                <div className="header">
                  <h1 className="heading-size-4rem">{t("resourcesPage.title")}</h1>
                </div>
                <div className="spacer-3rem"></div>
                <div className="blogui_block">
                  <div className="blogui_list">
                    <a href={`${prefix}/resources`} className="blogui_link w--current">{t("resourcesPage.all")}</a>
                    <a href={`${prefix}/resources/blog`} className="blogui_link">{t("resourcesPage.blog")}</a>
                    <a href={`${prefix}/resources/news`} className="blogui_link">{t("resourcesPage.news")}</a>
                    <a href={`${prefix}/resources/guides`} className="blogui_link">{t("resourcesPage.guide")}</a>
                  </div>
                </div>
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background"></div>
            </div>
          </section>

          {/* Blog preview section (CMS content - Collection Lists will come later) */}
          <section className="blog-preview_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-84rem">
                {/* Blog subsection */}
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.blog")}</h2>
                  <a data-wf--button--variant="secondary" href={`${prefix}/resources/blog`} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllBlog")}</div>
                  </a>
                </div>
                <div className="spacer-3rem"></div>
                {/* Collection List placeholder - CMS content will come later */}
                <div className="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <div className="spacer-3rem"></div>
              <div className="container-84rem">
                {/* News subsection */}
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.news")}</h2>
                  <a data-wf--button--variant="secondary" href={`${prefix}/resources/news`} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllNews")}</div>
                  </a>
                </div>
                <div className="spacer-3rem"></div>
                <div className="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <div className="spacer-3rem"></div>
              <div className="container-84rem">
                {/* Guides subsection */}
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.guides")}</h2>
                  <a data-wf--button--variant="secondary" href={`${prefix}/resources/guides`} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllGuides")}</div>
                  </a>
                </div>
                <div className="spacer-3rem"></div>
                <div className="w-dyn-empty">
                  <div>No items found.</div>
                </div>
              </div>
              <div className="spacer-3rem"></div>
              <div className="spacer-3rem"></div>
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
