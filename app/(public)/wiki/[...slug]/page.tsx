import { wiki_content } from "@/.velite";
import { MDXContent } from "@/components/markdown/mdx-content";
import { createWikiHeadingComponents, buildWikiToc } from "@/components/module-spcific/wiki/wiki-toc";
import { WikiToc } from "@/components/module-spcific/wiki/wiki-toc";
import { cn } from "@/lib/utils";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import { Suspense, type ComponentType } from "react";

export async function generateStaticParams() {
    return wiki_content.map((doc: { slug: string }) => ({
        slug: doc.slug.split("/"),
    }));
}

interface WikiPageProps {
    params: Promise<{ slug: string[] }>;
}
export default async function WikiPage({ params }: WikiPageProps) {
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
    const isNoSubtitlePage = doc.nosubtitle;

    return (
        <div className={cn("wiki-content-layout", toc.length > 0 && "has-toc")}>
            <article className="island-article">
                <header className="island-article-header">
                    <span className="island-article-label">文档</span>
                    <h1>{doc.title}</h1>
                    {doc.description && <p>{doc.description}</p>}
                </header>

                <div className={cn("island-article-body typeset typeset-docs", isNoSubtitlePage && "island-article-body-full")}>
                    <Suspense>
                        <MDXContent code={doc.body} components={headingComponents as Record<string, ComponentType<unknown>>} />
                    </Suspense>
                </div>
            </article>

            <WikiToc items={toc} />
        </div>
    );
}
