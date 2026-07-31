"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { gallery_navigation } from "@/.velite";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";

export function GallerySidebar() {
    const pathname = usePathname();
    const _gallery_navigation = gallery_navigation as unknown;

    // 按 order 排序
    // @ts-expect-error 安全地忽略类型问题
    const sortedNav = _gallery_navigation.sort((a, b) => a.order - b.order);

    return (
        <aside className="bg-background/50 h-full w-70 shrink-0 overflow-x-hidden overflow-y-auto rounded-lg px-2 py-4 backdrop-blur-lg">
            <div className="px-0">
                <div className="mb-4 px-4">
                    <h2 className="text-foreground text-2xl font-semibold tracking-wide">君庭阁图鉴</h2>
                </div>

                <nav className="space-y-2">
                    <ul className="space-y-0">
                        {/* @ts-expect-error 安全地忽略类型问题 */}
                        {sortedNav.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "text-foreground mx-2 flex items-center gap-2 rounded-md border border-l-2 border-transparent px-4 py-2 text-sm transition-colors duration-150",
                                            isActive ? "border-l-primary bg-primary/50 font-medium" : "hover:bg-primary/25"
                                        )}>
                                        {item.icon && (
                                            <IconifyIcon icon={item.icon} className="text-base leading-none opacity-70" />
                                        )}
                                        <span className="overflow-hidden text-ellipsis whitespace-nowrap">{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </aside>
    );
}

