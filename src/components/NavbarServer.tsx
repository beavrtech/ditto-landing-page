import { getBlogPosts } from "../lib/cms";
import { NavbarClient } from "./NavbarI18n";
import { getLocale } from "next-intl/server";

export async function Navbar() {
  const locale = await getLocale();
  const previewPosts = await getBlogPosts(locale as "en" | "fr", 2).catch(() => []);

  return <NavbarClient previewPosts={previewPosts || []} />;
}
