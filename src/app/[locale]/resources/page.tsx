import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Navbar } from "../../../components/NavbarServer";
import { Footer } from "../../../components/FooterServer";
import { DEVLINK_SCOPE_CLASS } from "../../../../webflow/devlinkScope";
import { getBlogPosts, getNews, getGuides } from "../../../lib/cms";
import { localizedHref, localizedCmsHref } from "../../../lib/localized-paths";

function ResourceCard({ item, type, locale }: { item: any; type: string; locale: string }) {
  const basePath = type === "blog" ? "/resources/blog" : type === "news" ? "/resources/news" : "/resources/guides";
  const href = localizedCmsHref(basePath, item.slug, item.slug_fr, locale);

  return (
    <div className="blog-preview_item" role="listitem">
      <a href={href} className="card-image w-inline-block">
        {item.banner_url && (
          <div className="card-image_thumbnail">
            <Image src={item.banner_url} alt={item.banner_alt_desc || ""} width={1200} height={630} className="media-full-size" />
          </div>
        )}
        <div className="card-image_content">
          <div className="spacer-1x5rem spacer-mob-1rem" />
          <p className="label">{type === "blog" ? "Blog" : type === "news" ? "News" : "Guide"}</p>
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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("resources.title"),
    description: t("resources.description"),
    alternates: {
      canonical: locale === "fr" ? "https://www.trustditto.com/fr/ressources" : "https://www.trustditto.com/en/resources",
      languages: {
        "x-default": "https://www.trustditto.com/en/resources",
        en: "https://www.trustditto.com/en/resources",
        fr: "https://www.trustditto.com/fr/ressources",
      },
    },
    openGraph: {
      title: t("resources.title"),
      description: t("resources.description"),
    },
  };
}

export const revalidate = 3600;

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const [blogs, news, guides] = await Promise.all([
    getBlogPosts(locale as "en" | "fr", 6).catch(() => []),
    getNews(locale as "en" | "fr", 6).catch(() => []),
    getGuides(locale as "en" | "fr", 6).catch(() => []),
  ]);

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          {/* Breadcrumbs */}
          <section className="breadcrumbs_section">
            <div className="padding-global">
              <div className="spacer-1x5rem" />
              <div className="container-84rem">
                <div className="breadcrumbs_list">
                  <a href={localizedHref("/resources", locale)} className="link-size-1rem">{t("resourcesPage.breadcrumb")}</a>
                </div>
              </div>
              <div className="spacer-1x5rem" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>

          {/* Filter UI / Header */}
          <section className="filterui_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
              <div className="container-55rem">
                <div className="header">
                  <h1 className="heading-size-4rem">{t("resourcesPage.title")}</h1>
                </div>
                <div className="spacer-3rem" />
                <div className="blogui_block">
                  <div className="blogui_list">
                    <a href={localizedHref("/resources", locale)} className="blogui_link w--current">{t("resourcesPage.all")}</a>
                    <a href={localizedHref("/resources/blog", locale)} className="blogui_link">{t("resourcesPage.blog")}</a>
                    <a href={localizedHref("/resources/news", locale)} className="blogui_link">{t("resourcesPage.news")}</a>
                    <a href={localizedHref("/resources/guides", locale)} className="blogui_link">{t("resourcesPage.guide")}</a>
                  </div>
                </div>
              </div>
              <div data-wf--padding--space="small-3rem" className="spacer-component" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>

          {/* Content sections */}
          <section className="blog-preview_section">
            <div className="padding-global">
              <div data-wf--padding--space="small-3rem" className="spacer-component" />

              {/* Blog subsection */}
              <div className="container-84rem">
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.blog")}</h2>
                  <a data-wf--button--variant="secondary" href={localizedHref("/resources/blog", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllBlog")}</div>
                  </a>
                </div>
                <div className="spacer-3rem" />
                {blogs && blogs.length > 0 ? (
                  <div className="blog_list_wrapper">
                    <div className="blog_list" role="list">
                      {blogs.map((post: any) => (
                        <ResourceCard key={post.slug} item={post} type="blog" locale={locale} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-dyn-empty"><div>No items found.</div></div>
                )}
              </div>

              <div className="spacer-3rem" />

              {/* News subsection */}
              <div className="container-84rem">
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.news")}</h2>
                  <a data-wf--button--variant="secondary" href={localizedHref("/resources/news", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllNews")}</div>
                  </a>
                </div>
                <div className="spacer-3rem" />
                {news && news.length > 0 ? (
                  <div className="blog_list_wrapper">
                    <div className="blog_list" role="list">
                      {news.map((item: any) => (
                        <ResourceCard key={item.slug} item={item} type="news" locale={locale} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-dyn-empty"><div>No items found.</div></div>
                )}
              </div>

              <div className="spacer-3rem" />

              {/* Guides subsection */}
              <div className="container-84rem">
                <div className="blog-preview_header">
                  <h2 className="heading-size-3rem">{t("resourcesPage.guides")}</h2>
                  <a data-wf--button--variant="secondary" href={localizedHref("/resources/guides", locale)} className="button w-variant-65493725-7ae1-e50b-73f7-cdb2cb7a8365 w-inline-block">
                    <div>{t("resourcesPage.viewAllGuides")}</div>
                  </a>
                </div>
                <div className="spacer-3rem" />
                {guides && guides.length > 0 ? (
                  <div className="blog_list_wrapper">
                    <div className="blog_list" role="list">
                      {guides.map((guide: any) => (
                        <ResourceCard key={guide.slug} item={guide} type="guide" locale={locale} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-dyn-empty"><div>No items found.</div></div>
                )}
              </div>

              <div className="spacer-3rem" />
              <div className="spacer-3rem" />
              <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="primary" className="background" />
            </div>
          </section>
        </div>

        <Footer />
      </main>
    </div>
  );
}
