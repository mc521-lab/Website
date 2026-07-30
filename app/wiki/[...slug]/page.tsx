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
        <main>
            <article className="typeset typeset-docs">
                <h1>{doc.title}</h1>

                <MDXContent code={doc.body} />
            </article>
        </main>
    );
}
