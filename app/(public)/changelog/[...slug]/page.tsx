import { changelog_content } from "@/.velite";
import { MDXContent } from "@/app/(public)/_components/markdown/mdx-content";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
    return changelog_content.map((doc: { slug: string }) => ({
        slug: doc.slug.split("/"),
    }));
}

export default async function ChangelogPage({ params }: { params: Promise<{ slug: string[] }> }) {
    const { slug } = await params;

    const path = slug.join("/");

    const doc = changelog_content.find((item: { slug: string }) => item.slug === path);

    if (!doc) {
        notFound();
    }

    return (
        <article className="island-article">
            <header className="island-article-header">
                <span className="island-article-label">{doc.version ? `v${doc.version}` : "更新"}</span>
                <h1>{doc.title}</h1>
                {doc.description && <p>{doc.description}</p>}
                {doc.date && <p className="island-article-date">📅 {doc.date}</p>}
            </header>

            <div className="island-article-body typeset typeset-docs">
                <MDXContent code={doc.body} />
            </div>
        </article>
    );
}

