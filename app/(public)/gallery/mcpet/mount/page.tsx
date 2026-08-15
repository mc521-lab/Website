"use client";

import { useEffect, useMemo, useState } from "react";
import { gallery_mcpet_mount_data, gallery_mcpet_mount_fragment_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/mc521/gallery/reusable/gallery-filter-panel";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { IconifyIcon } from "@/components/iconify-icon";
import { ItemCard } from "@/components/mc521/gallery/specific/items-gallery";
import { cn } from "@/lib/utils";

interface MountItem {
    id: string;
    basic: { name: string; maxLevel?: number };
    effects: {
        ExperienceThreshold: Array<number | string | null>;
        MaxHealth: Array<number | string | null>;
        Regeneration: Array<number | string | null>;
        ResistanceModifier: Array<number | string | null>;
        RespawnCooldown: Array<number | string | null>;
    };
    variants?: string[];
    filter?: { type?: string };
}

interface FragmentItem {
    id: string;
    basic: { name: string };
    usage: string[];
    filter?: { type?: string };
}

function MountOverviewCard({ item }: { item: MountItem }) {
    const variants = useMemo(() => item.variants ?? [], [item.variants]);
    const [activeIndex, setActiveIndex] = useState(0);
    const hasVariants = variants.length > 1;

    useEffect(() => {
        if (variants.length <= 1) return;

        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % variants.length);
        }, 2200);

        return () => window.clearInterval(timer);
    }, [variants.length]);

    const activeVariant = variants[activeIndex] ?? item.basic.name;
    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="gallery-card-header mb-3 flex items-start gap-2">
                <GalleryItemImage src={`/gallery/${activeVariant}.png`} alt={activeVariant} />
                <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">坐骑</p>
                        {hasVariants && (
                            <div className="flex gap-2">
                                {variants.map((variant, index) => {
                                    const isActive = index === activeIndex;
                                    return (
                                        <span
                                            key={`${variant}-${index}`}
                                            className={cn(
                                                "block h-2 rounded-full bg-current/40 transition-[width] duration-150 ease-in-out",
                                                isActive ? "w-4" : "w-2"
                                            )}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="mb-3 grid grid-cols-4 gap-2 text-sm">
                <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground text-xs">生命</div>
                    <div className="mt-0.5 font-medium">{item.effects.MaxHealth.at(-1) ?? "-"}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground text-xs">恢复</div>
                    <div className="mt-0.5 font-medium">{item.effects.Regeneration.at(-1) ?? "-"}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground text-xs">防御</div>
                    <div className="mt-0.5 font-medium">{item.effects.ResistanceModifier.at(-1) ?? "-"}</div>
                </div>
                <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground text-xs">复活冷却</div>
                    <div className="mt-0.5 font-medium">{item.effects.RespawnCooldown.at(-1) ?? "-"}s</div>
                </div>
            </div>
        </article>
    );
}

export default function PetMountPage() {
    const mounts = gallery_mcpet_mount_data as unknown as MountItem[];
    const fragments = gallery_mcpet_mount_fragment_data as unknown as FragmentItem[];
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const TYPE_OPTIONS = [
        { value: "all", label: "全部" },
        { value: "mount", label: "坐骑" },
        { value: "fragment", label: "碎片" },
    ] as const;

    const mountItems = useMemo(() => {
        let result = mounts;
        if (typeFilter !== "all" && typeFilter !== "mount") return [];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [mounts, search, typeFilter]);

    const fragmentItems = useMemo(() => {
        let result = fragments;
        if (typeFilter !== "all" && typeFilter !== "fragment") return [];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [fragments, search, typeFilter]);

    const total = mounts.length + fragments.length;
    const filtered = mountItems.length + fragmentItems.length;

    const filterBar = (
        <GalleryFilterPanel
            total={total}
            filtered={filtered}
            unit="件"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索坐骑或碎片名称…",
                label: "名称搜索",
            }}
            groups={[
                {
                    key: "type",
                    label: "类型",
                    icon: "lucide:layers-3",
                    value: typeFilter,
                    onChange: setTypeFilter,
                    options: TYPE_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
                },
            ]}
        />
    );

    return (
        <GalleryShell
            title="坐骑图鉴"
            subtitle="查看坐骑本体与碎片，并按类型切换筛选"
            filterBar={filterBar}
            isEmpty={filtered === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的条目</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(typeFilter === "all" || typeFilter === "mount") &&
                    mountItems.length > 0 &&
                    mountItems.map((item) => <MountOverviewCard key={item.id} item={item} />)}
                {(typeFilter === "all" || typeFilter === "fragment") &&
                    fragmentItems.length > 0 &&
                    fragmentItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={{ ...item, source: ["坐骑抽奖箱"], limit: [] }}
                            sourceRules={[{ pattern: /坐骑抽奖箱/, icon: <IconifyIcon icon="fluent-emoji-flat:game-die" /> }]}
                        />
                    ))}
            </div>
        </GalleryShell>
    );
}
