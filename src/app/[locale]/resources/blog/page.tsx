"use client";

import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "../../../../components/NavbarI18n";
import { Footer } from "../../../../components/FooterI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../../webflow/devlinkScope";

export default function ResourcesBlogPage() {
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
                  <div className="icon-wrapper">
                    <div className="icon w-embed">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.5312 3.52729C5.79155 3.26694 6.21366 3.26694 6.47401 3.52729L10.474 7.52729C10.7344 7.78764 10.7344 8.20975 10.474 8.4701L6.47401 12.4701C6.21366 12.7305 5.79155 12.7305 5.5312 12.4701C5.27085 12.2098 5.27085 11.7876 5.5312 11.5273L9.0598 7.9987L5.5312 4.4701C5.27085 4.20975 5.27085 3.78764 5.5312 3.52729Z" fill="#5F5C6E"></path>
                      </svg>
                    </div>
                  </div>
                  <a href={`${prefix}/resources/blog`} className="link-size-1rem">{t("resourcesPage.blog")}</a>
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
                  <h1 className="heading-size-4rem">{t("resourcesBlog.heading")}</h1>
                </div>
                <div className="spacer-3rem"></div>
                <div className="blogui_block">
                  <div className="blogui_list">
                    <a href={`${prefix}/resources`} className="blogui_link">{t("resourcesPage.all")}</a>
                    <a href={`${prefix}/resources/blog`} className="blogui_link w--current">{t("resourcesPage.blog")}</a>
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

          {/* Blog list (Collection List - CMS content will come later) */}
          <section className="blog-preview_section">
            <div className="padding-global">
              <div className="container-84rem">
                {/* Collection List placeholder */}
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
