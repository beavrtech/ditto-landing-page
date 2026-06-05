import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Navbar } from "../../../../components/NavbarI18n";
import { Footer } from "../../../../components/FooterI18n";
import { DEVLINK_SCOPE_CLASS } from "../../../../../webflow/devlinkScope";
import { getAuthorBySlug, getBlogPosts, getNews, getGuides } from "../../../../lib/cms";
import { localizedHref, localizedCmsHref } from "../../../../lib/localized-paths";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations();
  const prefix = `/${locale}`;

  const author = await getAuthorBySlug(slug);
  if (!author) notFound();

  // Fetch all content by this author
  const [allBlogs, allNews, allGuides] = await Promise.all([
    getBlogPosts(locale as "en" | "fr", 100).catch(() => []),
    getNews(locale as "en" | "fr", 100).catch(() => []),
    getGuides(locale as "en" | "fr", 100).catch(() => []),
  ]);

  const blogs = (allBlogs || []).filter((p: any) => p.author_id === author.id);
  const news = (allNews || []).filter((n: any) => n.author_id === author.id);
  const guides = (allGuides || []).filter((g: any) => g.author_id === author.id);

  const jobTitle = locale === "fr"
    ? author.job_title_fr || author.job_title
    : author.job_title;

  const bio = locale === "fr"
    ? author.description_fr || author.description_en
    : author.description_en;

  return (
    <div className="page-wrapper">
      <main className="main-wrapper">
        <Navbar />

        {/* Author bio section */}
        <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
          <section className="generic_section">
            <div className="padding-global">
              <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
              <div className="container-48rem">
                <div className="header" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                  {author.picture_url && (
                    <div className="profile_image" style={{ width: "6rem", height: "6rem", marginBottom: "1.5rem" }}>
                      <img width={96} height={96} alt={author.name} loading="lazy" src={author.picture_url} className="media-full-size" style={{ borderRadius: "50%" }} />
                    </div>
                  )}
                  <h1 className="heading-size-3rem">{author.name}</h1>
                  {jobTitle && (
                    <>
                      <div className="spacer-0x75rem" />
                      <p className="text-size-1x375rem text-color-neutral">{jobTitle}</p>
                    </>
                  )}
                  {bio && (
                    <>
                      <div className="spacer-1x5rem" />
                      <div className="text-rich-text w-richtext" dangerouslySetInnerHTML={{ __html: bio }} />
                    </>
                  )}
                  {author.linkedin_url && (
                    <>
                      <div className="spacer-1x5rem" />
                      <a href={author.linkedin_url} target="_blank" rel="noopener noreferrer" className="post_socials_link w-inline-block">
                        <div className="icon w-embed" dangerouslySetInnerHTML={{ __html: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M22.2234 0H1.77187C0.792187 0 0 0.773438 0 1.72969V22.2656C0 23.2219 0.792187 24 1.77187 24H22.2234C23.2031 24 24 23.2219 24 22.2703V1.72969C24 0.773438 23.2031 0 22.2234 0ZM7.12031 20.4516H3.55781V8.99531H7.12031V20.4516ZM5.33906 7.43438C4.19531 7.43438 3.27188 6.51094 3.27188 5.37187C3.27188 4.23281 4.19531 3.30937 5.33906 3.30937C6.47813 3.30937 7.40156 4.23281 7.40156 5.37187C7.40156 6.50625 6.47813 7.43438 5.33906 7.43438ZM20.4516 20.4516H16.8937V14.8828C16.8937 13.5562 16.8703 11.8453 15.0422 11.8453C13.1906 11.8453 12.9094 13.2937 12.9094 14.7891V20.4516H9.35625V8.99531H12.7687V10.5609H12.8156C13.2891 9.66094 14.4516 8.70937 16.1813 8.70937C19.7859 8.70937 20.4516 11.0813 20.4516 14.1656V20.4516Z" fill="currentColor"/></g><defs><clipPath id="clip0"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>' }} />
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
            </div>
            <div className="layer-4">
              <div data-wf--background--color="secondary" className="background w-variant-d4e67767-ab3f-6e5c-2116-e9a6d2688920" />
            </div>
          </section>
        </div>

        {/* Content by this author */}
        {(blogs.length > 0 || news.length > 0 || guides.length > 0) && (
          <div className={DEVLINK_SCOPE_CLASS} style={{ display: "contents" }}>
            <section className="blog-preview_section">
              <div className="padding-global">
                <div data-wf--padding--space="small-3rem" className="spacer-component" />
                <div className="container-48rem">
                  <div className="header">
                    <h2 className="heading-size-3rem">
                      {locale === "fr" ? "Contenu de cet auteur" : "Content by this author"}
                    </h2>
                  </div>
                </div>
                <div className="spacer-3rem" />

                <div className="container-84rem">
                  {blogs.length > 0 && (
                    <>
                      <div className="blog_list_wrapper">
                        <div className="blog_list" role="list">
                          {blogs.map((post: any) => (
                            <div key={post.slug} className="blog_list_item" role="listitem">
                              <a href={localizedCmsHref("/resources/blog", post.slug, post.slug_fr, locale)} className="card-image w-inline-block">
                                {post.banner_url && (
                                  <div className="card-image_thumbnail">
                                    <img src={post.banner_url} loading="lazy" alt="" className="media-full-size" />
                                  </div>
                                )}
                                <div className="card-image_content">
                                  <div className="spacer-1x5rem spacer-mob-1rem" />
                                  <p className="label">Blog</p>
                                  <div className="spacer-0x75rem" />
                                  <div className="card-image_link_wrapper">
                                    <p className="heading-size-2rem link-hover-parent text-style-2lines">{post.name}</p>
                                  </div>
                                  <div className="spacer-0x75rem" />
                                  <p className="text-size-1rem text-style-3lines">{post.description}</p>
                                </div>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="spacer-3rem" />
                    </>
                  )}

                  {news.length > 0 && (
                    <>
                      <div className="blog_list_wrapper">
                        <div className="blog_list" role="list">
                          {news.map((item: any) => (
                            <div key={item.slug} className="blog_list_item" role="listitem">
                              <a href={localizedCmsHref("/resources/news", item.slug, item.slug_fr, locale)} className="card-image w-inline-block">
                                {item.banner_url && (
                                  <div className="card-image_thumbnail">
                                    <img src={item.banner_url} loading="lazy" alt="" className="media-full-size" />
                                  </div>
                                )}
                                <div className="card-image_content">
                                  <div className="spacer-1x5rem spacer-mob-1rem" />
                                  <p className="label">News</p>
                                  <div className="spacer-0x75rem" />
                                  <div className="card-image_link_wrapper">
                                    <p className="heading-size-2rem link-hover-parent text-style-2lines">{item.name}</p>
                                  </div>
                                  <div className="spacer-0x75rem" />
                                  <p className="text-size-1rem text-style-3lines">{item.description}</p>
                                </div>
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="spacer-3rem" />
                    </>
                  )}

                  {guides.length > 0 && (
                    <div className="blog_list_wrapper">
                      <div className="blog_list" role="list">
                        {guides.map((guide: any) => (
                          <div key={guide.slug} className="blog_list_item" role="listitem">
                            <a href={localizedCmsHref("/resources/guides", guide.slug, guide.slug_fr, locale)} className="card-image w-inline-block">
                              {guide.banner_url && (
                                <div className="card-image_thumbnail">
                                  <img src={guide.banner_url} loading="lazy" alt="" className="media-full-size" />
                                </div>
                              )}
                              <div className="card-image_content">
                                <div className="spacer-1x5rem spacer-mob-1rem" />
                                <p className="label">Guide</p>
                                <div className="spacer-0x75rem" />
                                <div className="card-image_link_wrapper">
                                  <p className="heading-size-2rem link-hover-parent text-style-2lines">{guide.name}</p>
                                </div>
                                <div className="spacer-0x75rem" />
                                <p className="text-size-1rem text-style-3lines">{guide.description}</p>
                              </div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div data-wf--padding--space="medium-6rem" className="spacer-component w-variant-4e707de5-bf1e-dd42-7fb6-ac24ce686a4c" />
              </div>
              <div className="layer-4">
                <div data-wf--background--color="primary" className="background" />
              </div>
            </section>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}
