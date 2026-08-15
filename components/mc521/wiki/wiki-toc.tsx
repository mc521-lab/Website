import type { WikiTocItem } from "@/lib/wiki-toc";
import { cn } from "@/lib/utils";

export function WikiToc({ items }: { items: WikiTocItem[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <aside className="wiki-toc better-scroll-bar" aria-label="页面目录">
            <div className="wiki-toc-card">
                <h2>目录</h2>
                <nav>
                    <ul className="wiki-toc-list">
                        {items.map((item) => (
                            <li key={item.id} className={cn("wiki-toc-item", `wiki-toc-depth-${item.depth}`)}>
                                <a href={`#${item.id}`} className="wiki-toc-link">
                                    {item.title}
                                </a>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}
