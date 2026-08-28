"use client";

import { useMemo, useState } from "react";
import { gallery_skin_weapon_data } from "@/.velite";
import { GalleryShell } from "@/app/(public)/gallery/_components/reusable/gallery-shell";
import { GalleryItemImage } from "@/app/(public)/gallery/_components/reusable/gallery-item-image";
import { IconifyIcon } from "@/components/iconify-icon";

interface WeaponItem {
    id: string;
    basic: { name: string };
    filter?: { type?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

function WeaponCard({ item }: { item: WeaponItem }) {
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

                {item.limit.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <IconifyIcon icon="lucide:alert-triangle" width={12} height={12} />
                            限制
                        </h4>
                        <ul className="bg-muted space-y-0.5 rounded-md p-2">
                            {item.limit.map((l, i) => (
                                <li key={i} className="text-foreground/80 text-sm">
                                    {l}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </article>
    );
}

export default function SkinWeaponPage() {
    const allItems = gallery_skin_weapon_data as unknown as WeaponItem[];
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        if (!search.trim()) return allItems;
        const q = search.trim().toLowerCase();
        return allItems.filter((item) => item.basic.name.toLowerCase().includes(q));
    }, [allItems, search]);

    const searchBar = (
        <section className="gallery-filter-panel" aria-label="搜索">
            <div className="gallery-filter-toolbar">
                <div className="gallery-filter-toolbar-title">
                    <span className="gallery-filter-toolbar-icon" aria-hidden="true">
                        <IconifyIcon icon="lucide:search" width={18} height={18} />
                    </span>
                    <div>
                        <strong>名称搜索</strong>
                        <span>输入关键词即可筛选武器皮肤</span>
                    </div>
                </div>
                <div className="gallery-filter-toolbar-actions">
                    <div className="gallery-filter-summary" aria-live="polite">
                        <span className="gallery-filter-summary-dot" aria-hidden="true" />
                        正在显示 <strong>{filteredItems.length}</strong> / {allItems.length} 件
                    </div>
                </div>
            </div>
            <div className="gallery-filter-groups">
                <div className="gallery-filter-row">
                    <div className="gallery-filter-heading">
                        <span className="gallery-filter-heading-icon" aria-hidden="true">
                            <IconifyIcon icon="lucide:file-text" width={14} height={14} />
                        </span>
                        皮肤名称
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="搜索武器皮肤名称…"
                            className="w-full rounded-lg border py-2.5 pr-4 pl-4 text-sm transition-all duration-300 outline-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );

    return (
        <GalleryShell
            title="武器皮肤"
            subtitle="浏览游戏中的各类武器皮肤"
            filterBar={searchBar}
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的武器皮肤</p>
                    <p className="mt-1 text-sm">请尝试其他关键词搜索</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                    <WeaponCard key={item.id} item={item} />
                ))}
            </div>
        </GalleryShell>
    );
}
