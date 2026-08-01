import { wiki_content } from "@/.velite";
import { MDXContent } from "@/components/mc521/markdown/mdx-content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return wiki_content.map((doc: { slug: string }) => ({
        slug: doc.slug.split("/"),
    }));
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;

    const path = slug.join("/");

    const doc = wiki_content.find((item: { slug: string }) => item.slug === path);

    if (!doc) {
        notFound();
    }

    return (
        <article className="island-article">
            <header className="island-article-header">
                <span className="island-article-label">文档</span>
                <h1>{doc.title}</h1>
                {doc.description && <p>{doc.description}</p>}
            </header>

            <div className="island-article-body typeset typeset-docs">
                <MDXContent code={doc.body} />
            </div>
        </article>
    );
}
