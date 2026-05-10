import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { WikiSidebar } from "@/components/@mc521-ui/wiki-sidebar";
import { getAllWikis, getWikiBySlug, getWikisByCategory } from "@/lib/mdx";
import { mdxComponents } from "@/components/@mc521-ui/mdx";
import { Mc521 } from "@/components";

interface WikiPageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export async function generateStaticParams() {
    const wikis = await getAllWikis();
    return wikis.map((wiki) => ({
        slug: wiki.slug.split("/"),
    }));
}

export async function generateMetadata({ params }: WikiPageProps) {
    const { slug } = await params;
    const slugString = slug.join("/");
    const wiki = await getWikiBySlug(slugString);

    if (!wiki) {
        return { title: "Not Found" };
    }

    return {
        title: wiki.title,
    };
}

export default async function WikiPage({ params }: WikiPageProps) {
    const { slug } = await params;
    const slugString = slug.join("/");
    const [wiki, { grouped, sortedCategories }] = await Promise.all([getWikiBySlug(slugString), getWikisByCategory()]);

    const options = {
        mdxOptions: {
            remarkPlugins: [remarkGfm],
        },
    };

    if (!wiki) {
        notFound();
    }

    // 构建侧边栏需要的分类数据
    const sidebarCategories = sortedCategories.map((cat) => ({
        folderName: cat.folderName,
        title: cat.title,
        order: cat.order,
        expanded: cat.expanded,
        items: grouped[cat.folderName].map((item) => ({
            slug: item.slug,
            title: item.title,
            order: item.order,
        })),
    }));

    return (
        <>
            <Mc521.NavBarWiki />
            <div className="flex min-h-svh min-w-svw">
                <WikiSidebar currentSlug={wiki.slug} categories={sidebarCategories} />
                <main className="flex-1 px-8 py-6 pt-24">
                    <article className="mx-auto">
                        <header className="mb-8 border-b border-neutral-800 pb-6">
                            <h1 className="text-foreground text-3xl font-bold">{wiki.title}</h1>
                        </header>
                        <div className="prose prose-invert w-full">
                            <MDXRemote source={wiki.content} components={mdxComponents} options={options} />
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
}
