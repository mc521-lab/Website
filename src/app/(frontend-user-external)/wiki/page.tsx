import Link from "next/link";
import { getWikisByCategory } from "@/lib/mdx";

const svg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <g fill="#eab308" fill-opacity="0.1">
            <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
        </g>
    </g>
</svg>`;
const encodedSvg = encodeURIComponent(svg);

export default async function WikiHome() {
    const { grouped, sortedCategories } = await getWikisByCategory();

    // 获取第一个文档的链接作为默认入口
    const getFirstDocLink = (folderName: string) => {
        const docs = grouped[folderName];
        if (docs && docs.length > 0) {
            return `/wiki/${docs[0].slug}`;
        }
        return "/wiki";
    };

    return (
        <div
            className="pixel-font flex h-svh w-full flex-col items-center justify-center"
            style={{
                backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
                backgroundPosition: "8px 8px",
            }}>
            <h1 className="text-foreground mb-6 translate-x-1 -translate-y-2 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                <span className="text-primary">MC521</span> Wiki
            </h1>
            <p className="mx-auto mb-10 max-w-2xl -translate-y-2 text-3xl leading-relaxed text-neutral-300 md:text-4xl">无所不知 无所不晓</p>

            <div className="mt-12 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
                {sortedCategories.map((category) => (
                    <Link
                        key={category.folderName}
                        href={getFirstDocLink(category.folderName)}
                        className="group hover:border-primary/50 rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 transition-colors hover:bg-neutral-800/50">
                        <h3 className="mb-2 flex items-center gap-2 text-xl font-semibold text-neutral-200">{category.title}</h3>
                        <p className="text-sm text-neutral-400">{grouped[category.folderName]?.length || 0} 篇文档</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
