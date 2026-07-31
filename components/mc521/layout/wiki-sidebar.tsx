"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { wiki_navigation } from "@/.velite";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

export function WikiSidebar() {
    const pathname = usePathname();

    // 按 order 排序
    const sortedNav = [...wiki_navigation].sort((a, b) => a.order - b.order);

    return (
        <aside className="bg-background/75 h-full w-70 shrink-0 overflow-x-hidden overflow-y-auto rounded-lg px-2 py-4 backdrop-blur-lg">
            <div className="px-0">
                <div className="mb-4 px-2">
                    <h2 className="text-foreground text-2xl font-semibold tracking-wide">君庭阁百科</h2>
                </div>

                <nav className="space-y-2">
                    {sortedNav.map((group) => {
                        const sortedItems = [...group.items].sort((a, b) => a.order - b.order);

                        return (
                            <div key={group.title} className="mb-2 p-2 bg-muted/50 rounded-lg">
                                <h3 className="text-foreground mb-0 px-2 py-2 text-xs font-medium tracking-wider uppercase">
                                    {group.title}
                                </h3>
                                <ul className="space-y-0">
                                    {sortedItems.map((item) => {
                                        const isActive = pathname === "/wiki" + item.href;

                                        return (
                                            <li key={item.href}>
                                                <Link
                                                    href={"/wiki" + item.href}
                                                    className={cn(
                                                        "text-foreground mx-2 flex items-center gap-2 rounded-md border border-l-2 border-transparent px-4 py-2 text-sm transition-colors duration-150",
                                                        isActive
                                                            ? "border-l-primary bg-primary/50 font-medium"
                                                            : "hover:bg-primary/25"
                                                    )}>
                                                    {item.icon && (
                                                        <IconifyIcon
                                                            icon={item.icon}
                                                            className="text-base leading-none opacity-70"
                                                        />
                                                    )}
                                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                        {item.title}
                                                    </span>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        );
                    })}
                </nav>
            </div>
        </aside>
    );
}

