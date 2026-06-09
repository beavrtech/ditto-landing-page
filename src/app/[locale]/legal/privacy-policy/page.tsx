import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../../components/NavbarServer";
import { Footer } from "../../../../components/FooterServer";
import { DEVLINK_SCOPE_CLASS } from "../../../../../webflow/devlinkScope";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("legalPrivacy.title"),
    description: t("legalPrivacy.description"),
  };
}

export const revalidate = 3600;

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Breadcrumbs */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="breadcrumbs_section">
            <div className="padding-global">
              <div className="spacer-1x5rem"></div>
              <div className="container-84rem">
                <div className="breadcrumbs_list">
                  <a href={`${prefix}/legal/privacy-policy`} className="link-size-1rem">{t("privacyPolicy.breadcrumbParent")}</a>
                  <div className="icon-wrapper">
                    <div className="icon w-embed">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M5.5312 3.52729C5.79155 3.26694 6.21366 3.26694 6.47401 3.52729L10.474 7.52729C10.7344 7.78764 10.7344 8.20975 10.474 8.4701L6.47401 12.4701C6.21366 12.7305 5.79155 12.7305 5.5312 12.4701C5.27085 12.2098 5.27085 11.7876 5.5312 11.5273L9.0598 7.9987L5.5312 4.4701C5.27085 4.20975 5.27085 3.78764 5.5312 3.52729Z" fill="#5F5C6E"></path>
                      </svg>
                    </div>
                  </div>
                  <a href={`${prefix}/legal/privacy-policy`} className="link-size-1rem">{t("privacyPolicy.breadcrumb")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Post Hero */}
          <section className="post-hero_section">
            <div className="padding-global">
              <div className="hide-tablet">
                <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              </div>
              <div className="container-84rem">
                <div className="post-hero_component">
                  <div className="post-hero_content">
                    <h1 className="heading-size-3rem">{t("privacyPolicy.title")}</h1>
                    <div className="spacer-1x5rem"></div>
                    <p className="text-size-1x375rem">{t("privacyPolicy.updatedDate")}</p>
                  </div>
                </div>
              </div>
              <div className="show-tablet">
                <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              </div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Spacer section */}
          <section className="stories-intro_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Post Content */}
          <section className="post_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-84rem">
                <div className="post_grid">
                  <div className="post_main">
                    <div className="post_content">
                      <div id="company" className="post_chapter">
                        <div className="text-rich-text w-richtext">
                          <p>{t("privacyPolicy.cmsPlaceholder")}</p>
                        </div>
                      </div>
                    </div>
                  </div>
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
