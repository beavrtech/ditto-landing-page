import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarI18n";
import { Footer } from "../../../components/FooterI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";
import { getCustomerStories } from "../../../lib/cms";
import { localizedHref, localizedCmsHref } from "../../../lib/localized-paths";

function CustomerStoryCard({ item, locale }: { item: any; locale: string }) {
  const href = localizedCmsHref("/customer-stories", item.slug, item.slug_fr, locale);
  return (
    <div className="blog-preview_item" role="listitem">
      <a href={href} className="card-image w-inline-block">
        {item.banner_url && (
          <div className="card-image_thumbnail">
            <img src={item.banner_url} loading="lazy" alt={item.banner_alt_desc || ""} className="media-full-size" />
          </div>
        )}
        <div className="card-image_content">
          <div className="spacer-1x5rem spacer-mob-1rem" />
          <p className="label">{item.industry?.name_en || "Customer Story"}</p>
          <div className="spacer-0x75rem" />
          <div className="card-image_link_wrapper">
            <p className="heading-size-2rem link-hover-parent text-style-2lines">{item.name}</p>
          </div>
          <div className="spacer-0x75rem" />
          <p className="text-size-1rem text-style-3lines">{item.description}</p>
        </div>
      </a>
    </div>
  );
}

export default async function CustomerStoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

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

          {/* Customer stories list */}
          <section className="blog-preview_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component"></div>
              <div className="container-84rem">
                {items && items.length > 0 ? (
                  <div className="blog_list_wrapper">
                    <div className="blog_list" role="list">
                      {items.map((story: any) => (
                        <CustomerStoryCard key={story.slug} item={story} locale={locale} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-dyn-empty"><div>No items found.</div></div>
                )}
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
