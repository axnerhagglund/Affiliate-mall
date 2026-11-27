import type { ComponentProps } from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { Callout } from "@/components/Callout";
import { Faq } from "@/components/Faq";
import { FeedingTable } from "@/components/FeedingTable";
import { Placeholder } from "@/components/Placeholder";
import { ProductCard } from "@/components/ProductCard";
import { ProductTable } from "@/components/ProductTable";
import { ProsCons } from "@/components/ProsCons";
import type { FaqItem } from "@/config/sites";
import { linksToHiddenDraft } from "./content";

/** What the MDX components need to know about the page they render on. */
export type MdxContext = { slug: string; href: string; faq: FaqItem[] };

/** Renders MDX body (frontmatter already stripped) with ids on every heading. */
export async function renderMdx(source: string, context: MdxContext) {
  const components = {
    Callout,
    Placeholder,
    ProsCons,
    FeedingTable,
    ProductCard: ({ id }: { id: string }) => <ProductCard id={id} articleSlug={context.slug} />,
    ProductTable: ({ ids }: { ids: string[] }) => <ProductTable ids={ids} articleSlug={context.slug} articleHref={context.href} />,
    /** A link to an unpublished draft is plain text until the draft is published. */
    a: ({ href = "", children, ...props }: ComponentProps<"a">) =>
      linksToHiddenDraft(href) ? (
        <>{children}</>
      ) : (
        <a href={href} {...props}>
          {children}
        </a>
      ),
    /**
     * GFM task lists ("- [ ]") are checklists to read, not a form: show a box
     * that is not a form control, so no unlabelled inputs end up on the page.
     */
    input: (props: ComponentProps<"input">) =>
      props.type === "checkbox" ? (
        <span
          aria-hidden="true"
          className="mr-2 inline-block size-4 translate-y-0.5 rounded border-2 border-[var(--brand)] bg-white"
        />
      ) : (
        <input {...props} />
      ),
    /** Markdown tables scroll sideways on narrow screens instead of widening the page. */
    table: (props: ComponentProps<"table">) => (
      <div className="overflow-x-auto">
        <table {...props} />
      </div>
    ),
    /** <FAQ /> places the frontmatter questions here, under the article's own heading, instead of at the end. */
    FAQ: () => <Faq items={context.faq} heading={null} />,
  };
  const { content } = await compileMDX({
    source,
    components,
    options: {
      // The MDX lives in this repository, so props may be JS expressions such as ids={["a", "b"]}.
      // blockDangerousJS stays on.
      blockJS: false,
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] },
    },
  });
  return content;
}
