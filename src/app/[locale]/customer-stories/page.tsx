import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { CustomerStoriesFilter } from "../../../components/CustomerStoriesFilter";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";
import { getCustomerStories } from "../../../lib/cms";
import { localizedHref } from "../../../lib/localized-paths";

export const revalidate = 3600;

export default async function CustomerStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();

  const items = await getCustomerStories(locale as "en" | "fr").catch(() => []);

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
                  <a href={localizedHref("/customer-stories", locale)} className="link-size-1rem">{t("customerStories.breadcrumb")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem"></div>
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920"></div>
            </div>
          </section>

          {/* Header + Filters + Stories — all inside one client component for filtering */}
          <CustomerStoriesFilter
            stories={items || []}
            locale={locale}
            title={t("customerStories.title")}
            subtitle={t("customerStories.subtitle")}
            frameworkLabel={t("customerStories.filterFramework")}
            teamSizeLabel={t("customerStories.filterTeamSize")}
            industryLabel={t("customerStories.filterIndustry")}
          />
        </div>

        <Footer />
      </main>
    </div>
  );
}
