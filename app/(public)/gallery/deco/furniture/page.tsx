"use client";

import { useMemo, useState } from "react";
import { gallery_deco_furniture_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/module-spcific/gallery/reusable/gallery-filter-panel";
import { GalleryShell } from "@/components/module-spcific/gallery/reusable/gallery-shell";
import { DecoGalleryDetailCard } from "@/app/(public)/gallery/deco/_components/deco-gallery-detail-card";

interface FurnitureItem {
    id: string;
    basic: { name: string };
    filter?: { type?: string; bundle?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

const BUNDLE_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "jiudian", label: "酒店家具" },
    { value: "nongchang", label: "农场家具" },
    { value: "gufeng", label: "古风家具" },
    { value: "duchang", label: "赌场家具" },
    { value: "zhanpu", label: "占卜家具" },
    { value: "zhongshiji", label: "中世纪家具" },
    { value: "shengdan", label: "圣诞家具" },
    { value: "muyu", label: "沐浴家具" },
] as const;

export default function DecoFurniturePage() {
    const allItems = gallery_deco_furniture_data as unknown as FurnitureItem[];
    const [search, setSearch] = useState("");
    const [bundleFilter, setBundleFilter] = useState<string>("all");

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (bundleFilter !== "all") {
            result = result.filter((item) => item.filter?.bundle === bundleFilter);
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [allItems, bundleFilter, search]);

    const filterBar = (
        <GalleryFilterPanel
            total={allItems.length}
            filtered={filteredItems.length}
            unit="件"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索家具名称…",
                label: "家具名称",
            }}
            groups={[
                {
                    key: "bundle",
                    label: "套系",
                    icon: "lucide:layers",
                    value: bundleFilter,
                    onChange: (value) => setBundleFilter(value),
                    options: BUNDLE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                },
            ]}
        />
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
                    <DecoGalleryDetailCard
                        key={item.id}
                        name={item.basic.name}
                        imageSrc={`/gallery/${item.basic.name}.gif`}
                        usage={item.usage}
                        source={item.source}
                        limit={item.limit}
                        sourceItemClassName="flex items-center gap-1.5 rounded-md px-2 py-1 text-sm bg-muted text-foreground/80"
                        imageExtraClassName="-translate-x-2 scale-130"
                    />
                ))}
            </div>
        </GalleryShell>
    );
}
