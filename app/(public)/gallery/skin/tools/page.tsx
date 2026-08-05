"use client";

import { useMemo, useState } from "react";
import { gallery_skin_tools_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/mc521/gallery/reusable/gallery-filter-panel";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { IconifyIcon } from "@/components/iconify-icon";

interface ToolsItem {
    id: string;
    basic: { name: string };
    filter?: { type?: string; bundle?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

const BUNDLE_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "dasheng", label: "大圣" },
    { value: "jingkai", label: "晶凯" },
    { value: "yuanlian", label: "缘恋" },
    { value: "shuanghan", label: "霜寒" },
] as const;

function ToolsCard({ item }: { item: ToolsItem }) {
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

export default function SkinToolsPage() {
    const allItems = gallery_skin_tools_data as unknown as ToolsItem[];
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
                placeholder: "搜索工具皮肤名称…",
                label: "皮肤名称",
            }}
            groups={[
                {
                    key: "bundle",
                    label: "套装",
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
            title="工具皮肤"
            subtitle="浏览游戏中的各类工具皮肤"
            filterBar={filterBar}
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的工具皮肤</p>
                    <p className="mt-1 text-sm">请尝试其他关键词搜索</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item) => (
                    <ToolsCard key={item.id} item={item} />
                ))}
            </div>
        </GalleryShell>
    );
}
