import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import rehypeMinifyHtml from "rehype-preset-minify";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: "https://yanickrochon.github.io",
  base: "/foo-auth",

  integrations: [
    mdx({
      syntaxHighlight: "shiki",
      shikiConfig: { theme: "dracula" },
      rehypePlugins: [rehypeMinifyHtml],
      remarkPlugins: [remarkToc],
      remarkRehype: { footnoteLabel: "Footnotes" },
      gfm: false,
    }),
    tailwind(),
  ],
});
