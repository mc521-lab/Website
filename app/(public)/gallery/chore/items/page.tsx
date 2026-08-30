"use client";

import { useMemo, useState } from "react";
import { gallery_items_currency_data, gallery_items_material_data, gallery_items_prop_data } from "@/.velite";
import { IconifyIcon } from "@/components/iconify-icon";
import { GalleryFilterPanel } from "@/components/module-spcific/gallery/reusable/gallery-filter-panel";
import { ItemsGalleryPage, type GallerySourceRule } from "@/components/module-spcific/gallery/specific/items-gallery";

const SOURCE_RULES: GallerySourceRule[] = [
    { pattern: /水晶商城/, icon: <IconifyIcon icon="fluent-emoji-flat:shopping-cart" /> },
    { pattern: /魔塔/, icon: <IconifyIcon icon="fluent-emoji-flat:alien" /> },
    { pattern: /商人|(地牢|银币)商店/, icon: <IconifyIcon icon="streamline-ultimate-color:farmers-market-kiosk-1" /> },
    { pattern: /副本/, icon: <IconifyIcon icon="fluent-emoji-flat:crossed-swords" /> },
    { pattern: /任务/, icon: <IconifyIcon icon="fluent-emoji-flat:bookmark-tabs" /> },
    { pattern: /进服赠送/, icon: <IconifyIcon icon="fluent-emoji-flat:wrapped-gift" /> },
];

const SECTION_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "material", label: "材料" },
    { value: "prop", label: "道具" },
    { value: "currency", label: "货币" },
] as const;

type ItemSection = (typeof SECTION_OPTIONS)[number]["value"];

interface GalleryItem {
    id: string;
    basic: { name: string; quality?: string };
    usage: string[];
    source: string[];
    limit: string[];
}

const SECTION_ITEMS: Record<Exclude<ItemSection, "all">, GalleryItem[]> = {
    material: gallery_items_material_data as unknown as GalleryItem[],
    prop: gallery_items_prop_data as unknown as GalleryItem[],
    currency: gallery_items_currency_data as unknown as GalleryItem[],
};

export default function ItemsPage() {
    const allItems = useMemo(() => Object.values(SECTION_ITEMS).flat(), []);
    const [search, setSearch] = useState("");
    const [section, setSection] = useState<ItemSection>("all");

    const filteredItems = useMemo(() => {
        let result = section === "all" ? allItems : SECTION_ITEMS[section];
        if (search.trim()) {
            const q = search.trim().toLowerCase();
            result = result.filter((item) => item.basic.name.toLowerCase().includes(q));
        }
        return result;
    }, [allItems, search, section]);

    const filterBar = (
        <GalleryFilterPanel
            total={allItems.length}
            filtered={filteredItems.length}
            unit="件"
            search={{
                value: search,
                onChange: setSearch,
                placeholder: "搜索物品名称…",
                label: "物品名称",
            }}
            groups={[
                {
                    key: "section",
                    label: "分类",
                    icon: "lucide:package",
                    value: section,
                    onChange: (value) => setSection(value as ItemSection),
                    options: SECTION_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                },
            ]}
        />
    );

    return (
        <ItemsGalleryPage
            items={filteredItems}
            title="物品图鉴"
            description="浏览游戏中的材料、道具和货币"
            filterBar={filterBar}
            sourceRules={SOURCE_RULES}
        />
    );
}
