"use client";

import { useMemo, useState } from "react";
import { gallery_deco_furniture_data } from "@/.velite";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { IconifyIcon } from "@/components/iconify-icon";

interface FurnitureItem {
    id: string;
    basic: { name: string; type: string };
    usage: string[];
    source: string[];
    limit: string[];
}

function FurnitureCard({ item }: { item: FurnitureItem }) {
    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}.gif`} alt={item.basic.name} />
                <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                </div>
            </div>

            <div className="space-y-2.5">
                {item.usage.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <IconifyIcon icon="lucide:wand-2" width={12} height={12} />
                            用途
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.usage.map((u, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {u}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {item.source.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <IconifyIcon icon="lucide:map-pin" width={12} height={12} />
                            来源
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.source.map((s, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function DecoFurniturePage() {
    const allItems = gallery_deco_furniture_data as unknown as FurnitureItem[];
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        if (!search.trim()) return allItems;
        const q = search.trim().toLowerCase();
        return allItems.filter((item) => item.basic.name.toLowerCase().includes(q));
    }, [allItems, search]);

    const filterBar = (
        <div className="relative">
            <IconifyIcon
                icon="lucide:search"
                width={16}
                height={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-amber-500"
            />
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="搜索家具名称…"
                className="w-full rounded-lg border border-amber-400 bg-amber-50 py-2.5 pr-4 pl-10 text-sm text-amber-900 transition-all duration-300 outline-none placeholder:text-amber-500/60 focus:border-amber-400 focus:shadow-[0_0_16px_-2px_rgba(251,191,36,0.5)] focus:ring-2 focus:ring-amber-400/50 dark:border-amber-500/70 dark:bg-amber-950/30 dark:text-amber-100 dark:placeholder:text-amber-400/60 dark:focus:shadow-[0_0_16px_-2px_rgba(251,191,36,0.4)]"
            />
            <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium text-amber-600 tabular-nums dark:text-amber-400">
                {filteredItems.length}/{allItems.length}
            </span>
        </div>
    );

    return (
        <GalleryShell
            title="家具图鉴"
            subtitle="浏览游戏中的各类家具装饰"
            filterBar={filterBar}
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的家具</p>
                    <p className="mt-1 text-sm">请尝试其他关键词搜索</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                    <FurnitureCard key={item.id} item={item} />
                ))}
            </div>
        </GalleryShell>
    );
}
