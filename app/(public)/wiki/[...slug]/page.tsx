import { wiki_content } from "@/.velite";
import { createWikiHeadingComponents, buildWikiToc } from "@/lib/wiki-toc";
import { MDXContent } from "@/components/mc521/markdown/mdx-content";
import { WikiToc } from "@/components/mc521/wiki/wiki-toc";
import { cn } from "@/lib/utils";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";

export async function generateStaticParams() {
    return wiki_content.map((doc: { slug: string }) => ({
        slug: doc.slug.split("/"),
    }));
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;

    const pagePath = slug.join("/");

    const doc = wiki_content.find((item: { slug: string }) => item.slug === pagePath);

    if (!doc) {
        notFound();
    }

    const sourcePath = path.join(process.cwd(), "content", "wiki", "_pages", ...slug) + ".mdx";
    const source = await readFile(sourcePath, "utf8");
    const toc = buildWikiToc(source);
    const headingComponents = createWikiHeadingComponents();

    return (
        <div className={cn("wiki-content-layout", toc.length > 0 && "has-toc")}>
            <article className="island-article">
                <header className="island-article-header">
                    <span className="island-article-label">文档</span>
                    <h1>{doc.title}</h1>
                    {doc.description && <p>{doc.description}</p>}
                </header>

                <div className="island-article-body typeset typeset-docs">
                    <MDXContent code={doc.body} components={headingComponents as Record<string, ComponentType<unknown>>} />
                </div>
            </article>

            <WikiToc items={toc} />
        </div>
    );
}
