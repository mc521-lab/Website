"use client";

import { useMemo, useState } from "react";
import { gallery_skin_cosmetic_data } from "@/.velite";
import { GalleryFilterPanel } from "@/app/(public)/gallery/_components/reusable/gallery-filter-panel";
import { GalleryItemImage } from "@/app/(public)/gallery/_components/reusable/gallery-item-image";
import { IconifyIcon } from "@/components/iconify-icon";

interface CosmeticItem {
    id: string;
    basic: { name: string };
    filter?: { type?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

const TYPE_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "head", label: "头饰" },
    { value: "back", label: "背饰" },
] as const;

function CosmeticCard({ item }: { item: CosmeticItem }) {
    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}.gif`} alt={item.basic.name} />
                <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <p className="text-muted-foreground mt-0.5 text-xs">{item.filter?.type === "head" ? "头饰" : "背饰"}</p>
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

export default function SkinCosmeticPage() {
    const allItems = gallery_skin_cosmetic_data as unknown as CosmeticItem[];
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (typeFilter !== "all") {
            result = result.filter((item) => item.filter?.type === typeFilter);
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [allItems, typeFilter, search]);

    return (
        <div className="w-full">
            <header className="gallery-page-header">
                <h1 className="text-3xl font-bold tracking-tight">时装皮肤</h1>
                <p className="text-muted-foreground mt-1">浏览游戏中的各类时装头饰与背饰皮肤</p>
            </header>

            <div className="mb-6">
                <GalleryFilterPanel
                    total={allItems.length}
                    filtered={filteredItems.length}
                    unit="件"
                    search={{
                        value: search,
                        onChange: setSearch,
                        placeholder: "搜索时装名称…",
                        label: "时装名称",
                    }}
                    groups={[
                        {
                            key: "type",
                            label: "部位",
                            icon: "lucide:shirt",
                            value: typeFilter,
                            onChange: (value) => setTypeFilter(value),
                            options: TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                        },
                    ]}
                />
            </div>

            {filteredItems.length === 0 ? (
                <div className="gallery-empty-state">
                    <p className="text-lg">暂无符合条件的时装</p>
                    <p className="mt-1 text-sm">请调整筛选条件后重试</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredItems.map((item) => (
                        <CosmeticCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

