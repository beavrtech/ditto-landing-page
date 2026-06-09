"use client";

import { BlogPostForm } from "../../../../components/admin/BlogPostForm";

const emptyPost = {
  name_en: "",
  name_fr: "",
  slug: "",
  slug_fr: "",
  seo_title_en: "",
  seo_title_fr: "",
  seo_meta_desc_en: "",
  seo_meta_desc_fr: "",
  banner_url: "",
  banner_alt_desc: "",
  description_en: "",
  description_fr: "",
  body_en: "",
  body_fr: "",
  date_de_publication: null,
  published: false,
  archived: false,
  en_avant: false,
  embed_included: false,
  embed_included_fr: false,
};

export default function NewBlogPostPage() {
  return <BlogPostForm post={emptyPost} isNew />;
}
