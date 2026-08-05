"use client";

import { useMemo, useState } from "react";
import { gallery_items_material_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/mc521/gallery/reusable/gallery-filter-panel";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { QualityBadge } from "@/components/mc521/gallery/reusable/quality-badge";
import { IconifyIcon } from "@/components/iconify-icon";

interface MaterialItem {
    id: string;
    basic: { name: string; quality?: string };
    filter?: { type?: string; for?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

const TYPE_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "bi", label: "晶块" },
    { value: "ding", label: "砂" },
    { value: "hupo", label: "琥珀" },
    { value: "jing", label: "幽晶" },
    { value: "lei", label: "之泪" },
    { value: "shi", label: "辉石" },
    { value: "sui", label: "晶胚" },
    { value: "tajing", label: "塔晶" },
    { value: "tong", label: "通用" },
] as const;

const FOR_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "set_a", label: "A 级套装" },
    { value: "set_b", label: "B 级套装" },
    { value: "set_c", label: "C 级套装" },
    { value: "gem", label: "宝石" },
    { value: "general", label: "通用" },
] as const;

function MaterialCard({ item }: { item: MaterialItem }) {
    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${item.basic.name}.png`} alt={item.basic.name} />
                <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                        {item.basic.quality && <QualityBadge quality={item.basic.quality} />}
                    </div>
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

export default function MaterialPage() {
    const allItems = gallery_items_material_data as unknown as MaterialItem[];
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [forFilter, setForFilter] = useState<string>("all");

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (typeFilter !== "all") {
            result = result.filter((item) => item.filter?.type === typeFilter);
        }
        if (forFilter !== "all") {
            result = result.filter((item) => item.filter?.for === forFilter);
        }
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [allItems, typeFilter, forFilter, search]);

    const filterBar = (
        <GalleryFilterPanel
            total={allItems.length}
            filtered={filteredItems.length}
            unit="件"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索材料名称…",
                label: "材料名称",
            }}
            groups={[
                {
                    key: "type",
                    label: "材料类型",
                    icon: "lucide:package",
                    value: typeFilter,
                    onChange: (value) => setTypeFilter(value),
                    options: TYPE_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                },
                {
                    key: "for",
                    label: "用途",
                    icon: "lucide:target",
                    value: forFilter,
                    onChange: (value) => setForFilter(value),
                    options: FOR_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                },
            ]}
        />
    );

    return (
        <GalleryShell
            title="材料图鉴"
            subtitle="浏览游戏中的各类材料"
            filterBar={filterBar}
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的材料</p>
                    <p className="mt-1 text-sm">请尝试其他关键词搜索</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                    <MaterialCard key={item.id} item={item} />
                ))}
            </div>
        </GalleryShell>
    );
}
