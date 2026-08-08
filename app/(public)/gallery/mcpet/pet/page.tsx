"use client";

import { useEffect, useMemo, useState } from "react";
import { gallery_mcpet_pet_data, gallery_mcpet_pet_fragment_data, gallery_mcpet_food_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/mc521/gallery/reusable/gallery-filter-panel";
import { GalleryItemImage } from "@/components/mc521/gallery/reusable/gallery-item-image";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { IconifyIcon } from "@/components/iconify-icon";
import { ItemCard } from "@/components/mc521/gallery/specific/items-gallery";
import { cn } from "@/lib/utils";

interface PetItem {
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

const TYPE_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "pet", label: "宠物" },
    { value: "fragment", label: "碎片" },
    { value: "food", label: "宠物食品" },
] as const;

function PetOverviewCard({ item }: { item: PetItem }) {
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
                    <h3 className="truncate text-base leading-tight font-semibold">{hasVariants ? activeVariant : item.basic.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                        <p className="text-muted-foreground text-xs">宠物</p>
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
                    <div className="text-muted-foreground text-xs">最大等级</div>
                    <div className="mt-0.5 font-medium">{item.basic.maxLevel ?? "-"}</div>
                </div>
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
            </div>

            <div className="bg-muted rounded-md p-2 text-sm">
                <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                    <IconifyIcon icon="lucide:sparkles" width={12} height={12} />
                    成长曲线 (Lv{Array.from({ length: item.basic.maxLevel ?? 0 }, (_, i) => i + 1).join("/")})
                </div>
                <div className="grid grid-cols-[48px_1fr] gap-x-2 gap-y-1 text-xs">
                    <span className="text-muted-foreground">所需经验</span>
                    <span className="text-right">{item.effects.ExperienceThreshold.join(" / ")}</span>
                    <span className="text-muted-foreground">生命上限</span>
                    <span className="text-right">{item.effects.MaxHealth.join(" / ")}</span>
                    <span className="text-muted-foreground">每秒回血</span>
                    <span className="text-right">{item.effects.Regeneration.join(" / ")}</span>
                    <span className="text-muted-foreground">防御数值</span>
                    <span className="text-right">{item.effects.ResistanceModifier.join(" / ")}</span>
                    <span className="text-muted-foreground">复活冷却</span>
                    <span className="text-right">{item.effects.RespawnCooldown.join("s / ")}s</span>
                </div>
            </div>
        </article>
    );
}

// function FragmentCard({ item }: { item: FragmentItem }) {
//     return (
//         <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
//             <div className="gallery-card-header mb-3 flex items-start gap-2">
//                 <GalleryItemImage src={`/gallery/${item.basic.name}.png`} alt={item.basic.name} />
//                 <div className="ml-1 flex h-full min-w-0 flex-1 flex-col justify-center">
//                     <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
//                     <p className="text-muted-foreground mt-1 text-xs">碎片</p>
//                 </div>
//             </div>

//             {item.usage.length > 0 && (
//                 <div className="bg-muted rounded-md p-2 text-sm">
//                     <div className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
//                         <IconifyIcon icon="lucide:wand-2" width={12} height={12} />
//                         用途
//                     </div>
//                     <ul className="space-y-0.5">
//                         {item.usage.map((usage, index) => (
//                             <li key={`${usage}-${index}`} className="text-foreground/80 text-sm">
//                                 {usage}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </article>
//     );
// }

export default function PetGalleryPage() {
    const pets = gallery_mcpet_pet_data as unknown as PetItem[];
    const fragments = gallery_mcpet_pet_fragment_data as unknown as FragmentItem[];
    const foods = gallery_mcpet_food_data.map((item) => ({
        ...item,
        filter: {
            type: "food",
        },
    }));
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");

    const petItems = useMemo(() => {
        let result = pets;
        if (typeFilter !== "all" && typeFilter !== "pet") return [];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [pets, search, typeFilter]);

    const fragmentItems = useMemo(() => {
        let result = fragments;
        if (typeFilter !== "all" && typeFilter !== "fragment") return [];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [fragments, search, typeFilter]);

    const foodItems = useMemo(() => {
        let result = foods;
        if (typeFilter !== "all" && typeFilter !== "food") return [];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [foods, search, typeFilter]);

    const total = pets.length + fragments.length + foods.length;
    const filtered = petItems.length + fragmentItems.length + foods.length;

    const filterBar = (
        <GalleryFilterPanel
            total={total}
            filtered={filtered}
            unit="件"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索宠物或碎片名称…",
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
            title="宠物图鉴"
            subtitle="查看宠物本体与碎片，并按类型切换筛选"
            filterBar={filterBar}
            isEmpty={filtered === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的条目</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {(typeFilter === "all" || typeFilter === "pet") &&
                    petItems.length > 0 &&
                    petItems.map((item) => <PetOverviewCard key={item.id} item={item} />)}
                {(typeFilter === "all" || typeFilter === "fragment") &&
                    fragmentItems.length > 0 &&
                    fragmentItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={{ ...item, source: ["宠物抽奖箱"], limit: [] }}
                            sourceRules={[{ pattern: /宠物抽奖箱/, icon: <IconifyIcon icon="fluent-emoji-flat:game-die" /> }]}
                        />
                    ))}
                {(typeFilter === "all" || typeFilter === "food") &&
                    foodItems.length > 0 &&
                    foodItems.map((item) => (
                        <ItemCard
                            key={item.id}
                            item={{ ...item, limit: [] }}
                            sourceRules={[
                                {
                                    pattern: /珍宝商人/,
                                    icon: <IconifyIcon icon="streamline-ultimate-color:farmers-market-kiosk-1" />,
                                },
                            ]}
                        />
                    ))}
            </div>
        </GalleryShell>
    );
}
