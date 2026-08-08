"use client";

import { useMemo, useState } from "react";
import { gallery_enchants_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/mc521/gallery/reusable/gallery-filter-panel";
import { GalleryShell } from "@/components/mc521/gallery/reusable/gallery-shell";
import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

interface EnchantItem {
    id: string;
    slug: string;
    basic: {
        id: string;
        name: string;
        description: string;
        placeholder?: string;
        placeholders?: Record<string, string>;
        "max-level": number;
    };
    filter: {
        rarity: string;
        tradeable: boolean;
        discoverable: boolean;
        enchantable: boolean;
    };
    targets: string[];
    conflicts: string[];
}

const RARITY_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "common", label: "普通" },
    { value: "rare", label: "精良" },
    { value: "epic", label: "史诗" },
    { value: "special", label: "稀世" },
] as const;

const RARITY_LABELS: Record<string, string> = {
    common: "普通",
    rare: "精良",
    epic: "史诗",
    special: "稀世",
};

const RARITY_COLORS: Record<string, string> = {
    evil: "#E50000",
    common: "#F6F1E9",
    rare: "#39BCD1",
    epic: "#FC3E7C",
    special: "#FFD500",
};

const SUITABLE_ITEMS: Record<string, string> = {
    sword: "剑",
    axe: "斧",
    pickaxe: "镐",
    shovel: "铲",
    hoe: "锄",
    bow: "弓",
    crossbow: "弩",
    helmet: "头盔",
    chestplate: "胸甲",
    leggings: "腿甲",
    boots: "靴",
    armor: "全部护甲",
    shield: "盾",
    trident: "三叉戟",
    elytra: "鞘翅",
    all: "全部",
    shears: "剪刀",
    fishing_rod: "钓鱼竿",
};

function formatConflictsName(items: EnchantItem[], conflictId: string[]) {
    return conflictId.map((id) => {
        const item = items.find((item) => item.id === id);
        return item?.basic.name ?? id;
    });
}

function formatList(values: string[]) {
    return values.length > 0 ? values.join(" / ") : "-";
}

function formatPlaceholder(description: string, placeholder?: string, placeholders?: Record<string, string>) {
    let result = description;
    const replacements = {
        placeholder: placeholder?.replace("%level%", "[等级]") ?? "",
        ...(placeholders ?? {}),
    };

    Object.entries(replacements).forEach(([key, value]) => {
        result = result.replaceAll(`%${key}%`, value.replace("%level%", "[等级]"));
    });

    return result;
}

function EnchantCard({ item, allItemArray }: { item: EnchantItem; allItemArray: EnchantItem[] }) {
    const rarityColorName = item.basic.name.includes("诅咒") ? "evil" : item.filter.rarity;

    return (
        <article className="gallery-item-card border-border bg-card relative flex flex-col overflow-hidden rounded-xl border p-4 shadow-sm">
            <div className="mb-3 flex items-start gap-2">
                <div
                    className="bg-muted border-border flex size-11 shrink-0 items-center justify-center rounded-lg border"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${RARITY_COLORS[rarityColorName]}, transparent 75%)`,
                    }}>
                    <IconifyIcon
                        icon={rarityColorName === "evil" ? "lucide:biohazard" : "lucide:sparkles"}
                        width={20}
                        height={20}
                        style={{ color: RARITY_COLORS[rarityColorName] }}
                    />
                </div>
                <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base leading-tight font-semibold">{item.basic.name}</h3>
                    <div className="mt-1 flex flex-wrap gap-2 text-xs">
                        <span
                            className="bg-muted text-muted-foreground rounded-full px-2 py-0.5"
                            style={{
                                color: RARITY_COLORS[rarityColorName],
                                backgroundColor: `color-mix(in srgb, ${RARITY_COLORS[rarityColorName]}, transparent 75%)`,
                            }}>
                            {rarityColorName === "evil"
                                ? RARITY_LABELS["common"]
                                : (RARITY_LABELS[item.filter.rarity] ?? item.filter.rarity)}
                        </span>
                        <span className="bg-muted text-muted-foreground rounded-full px-2 py-0.5">
                            最高 Lv.{item.basic["max-level"]}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-foreground/80 bg-muted rounded-md p-2 text-sm leading-6">
                {formatPlaceholder(item.basic.description, item.basic.placeholder, item.basic.placeholders)}
            </p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                <div className={cn("rounded-md p-2", item.filter.enchantable ? "bg-green-500/25" : "bg-destructive/25")}>
                    <div className="text-muted-foreground text-xs">附魔台产出</div>
                    <div className="mt-0.5 font-medium">{item.filter.enchantable ? "是" : "否"}</div>
                </div>
                <div className={cn("rounded-md p-2", item.filter.tradeable ? "bg-green-500/25" : "bg-destructive/25")}>
                    <div className="text-muted-foreground text-xs">村民交易</div>
                    <div className="mt-0.5 font-medium">{item.filter.tradeable ? "是" : "否"}</div>
                </div>
                <div className={cn("rounded-md p-2", item.filter.discoverable ? "bg-green-500/25" : "bg-destructive/25")}>
                    <div className="text-muted-foreground text-xs">箱子刷新</div>
                    <div className="mt-0.5 font-medium">{item.filter.discoverable ? "是" : "否"}</div>
                </div>
                {/* <div className="bg-muted rounded-md p-2">
                    <div className="text-muted-foreground text-xs">冲突数量</div>
                    <div className="mt-0.5 font-medium">{item.conflicts.length}</div>
                </div> */}
            </div>

            <div className="mt-3 space-y-2.5">
                {item.targets.length > 0 && (
                    <div>
                        <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                            <IconifyIcon icon="lucide:wand-sparkles" width={12} height={12} />
                            适用部位
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {item.targets.map((target) => (
                                <span key={target} className="bg-muted rounded-full px-2 py-1 text-xs">
                                    {SUITABLE_ITEMS[target] ?? target}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h4 className="text-muted-foreground mb-1 flex items-center gap-1 text-xs font-medium">
                        <IconifyIcon icon="lucide:shield-ban" width={12} height={12} />
                        冲突
                    </h4>
                    <div className="bg-muted rounded-md p-2 text-sm">
                        {item.conflicts.length > 0 ? formatList(formatConflictsName(allItemArray, item.conflicts)) : "无"}
                    </div>
                </div>
            </div>
        </article>
    );
}

export default function EnchantmentsPage() {
    const allItems = gallery_enchants_data as unknown as EnchantItem[];
    const [search, setSearch] = useState("");
    const [rarity, setRarity] = useState<string>("all");

    const filteredItems = useMemo(() => {
        let result = allItems;
        if (rarity !== "all") result = result.filter((item) => item.filter.rarity === rarity);
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [allItems, rarity, search]);

    const filterBar = (
        <GalleryFilterPanel
            total={allItems.length}
            filtered={filteredItems.length}
            unit="条"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索附魔名称或 ID…",
                label: "名称搜索",
            }}
            groups={[
                {
                    key: "rarity",
                    label: "稀有度",
                    icon: "lucide:gem",
                    value: rarity,
                    onChange: setRarity,
                    options: RARITY_OPTIONS.map((option) => ({ value: option.value, label: option.label })),
                },
            ]}
        />
    );

    return (
        <GalleryShell
            title="附魔图鉴"
            subtitle="按类型、稀有度和目标快速浏览 EcoEnchants 配置"
            filterBar={filterBar}
            isEmpty={filteredItems.length === 0}
            empty={
                <div className="border-border text-muted-foreground flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
                    <p className="text-lg">未找到匹配的附魔</p>
                    <p className="mt-1 text-sm">请尝试其他筛选条件或关键词</p>
                </div>
            }>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredItems.map((item, index) => (
                    <EnchantCard key={index} item={item} allItemArray={allItems} />
                ))}
            </div>
        </GalleryShell>
    );
}

