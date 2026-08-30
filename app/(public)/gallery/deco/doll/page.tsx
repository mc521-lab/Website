"use client";

import { useMemo, useState } from "react";
import { gallery_deco_doll_data } from "@/.velite";
import { GalleryShell } from "@/components/module-spcific/gallery/reusable/gallery-shell";
import { GallerySearchPanel } from "@/components/module-spcific/gallery/reusable/gallery-search-panel";
import { DecoGalleryDetailCard } from "@/app/(public)/gallery/deco/_components/deco-gallery-detail-card";

interface DollItem {
    id: string;
    basic: { name: string };
    usage: string[];
    source: string[];
    limit: string[];
}

export default function DecoDollPage() {
    const allItems = gallery_deco_doll_data as unknown as DollItem[];
    const [search, setSearch] = useState("");

    const filteredItems = useMemo(() => {
        if (!search.trim()) return allItems;
        const q = search.trim().toLowerCase();
        return allItems.filter((item) => item.basic.name.toLowerCase().includes(q));
    }, [allItems, search]);

    return (
        <GalleryShell
            title="玩偶图鉴"
            subtitle="浏览游戏中的各类玩偶装饰"
            filterBar={
                <GallerySearchPanel
                    total={allItems.length}
                    filtered={filteredItems.length}
                    unit="件"
                    label="玩偶名称"
                    placeholder="搜索玩偶名称…"
                    value={search}
                    onChange={setSearch}
                />
            }
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的玩偶</p>
                    <p className="mt-1 text-sm">请尝试其他关键词搜索</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredItems.map((item) => (
                    <DecoGalleryDetailCard
                        key={item.id}
                        name={item.basic.name}
                        imageSrc={`/gallery/${item.basic.name}.png`}
                        usage={item.usage}
                        source={item.source}
                        limit={item.limit}
                        sourceItemClassName="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm bg-muted text-foreground/80"
                        imageExtraClassName="-translate-x-2 scale-120"
                    />
                ))}
            </div>
        </GalleryShell>
    );
}
