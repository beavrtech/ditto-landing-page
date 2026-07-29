import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { mdxComponents } from "../components/mdx";
import type { MediaLocale } from "../data/taxonomy";

/**
 * Compile an article body at build time. `evaluate` uses `new Function`, which
 * is fine here because every media route is statically generated on the Node
 * runtime — do not make these routes dynamic or edge.
 */
export async function renderArticleBody(body: string, locale: MediaLocale) {
  const { default: MDXContent } = await evaluate(body, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return <MDXContent components={mdxComponents(locale)} />;
}
