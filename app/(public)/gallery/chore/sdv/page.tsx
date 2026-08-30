"use client";

import { useMemo, useState } from "react";
import { gallery_sdv_crop_data, gallery_sdv_seed_data, gallery_sdv_tool_data } from "@/.velite";
import { GalleryFilterPanel } from "@/components/module-spcific/gallery/reusable/gallery-filter-panel";
import { ItemsGalleryPage, type GallerySourceRule } from "@/components/module-spcific/gallery/specific/items-gallery";
import { IconifyIcon } from "@/components/iconify-icon";

const SOURCE_RULES: GallerySourceRule[] = [
    { pattern: /商人|(地牢|银币)商店/, icon: <IconifyIcon icon="streamline-ultimate-color:farmers-market-kiosk-1" /> },
    { pattern: /收获|收成/, icon: <IconifyIcon icon="fluent-emoji-flat:potted-plant" /> },
    { pattern: /变异/, icon: <IconifyIcon icon="fluent-emoji-flat:bubbles" /> },
];

const VARIANT_STYLES = ["#4ca733", "#D7DCE2", "#fcda18"];

const SECTION_OPTIONS = [
    { value: "all", label: "全部" },
    { value: "seed", label: "种子" },
    { value: "tool", label: "工具" },
    { value: "crop", label: "作物" },
] as const;

type SdvSection = (typeof SECTION_OPTIONS)[number]["value"];

interface GalleryItem {
    id: string;
    basic: { name: string; quality?: string; type?: string };
    usage: string[];
    source: string[];
    limit: string[];
    variants?: string[];
}

const SECTION_ITEMS: Record<Exclude<SdvSection, "all">, GalleryItem[]> = {
    seed: gallery_sdv_seed_data as unknown as GalleryItem[],
    tool: gallery_sdv_tool_data as unknown as GalleryItem[],
    crop: gallery_sdv_crop_data as unknown as GalleryItem[],
};

function SdvGalleryContent() {
    const allItems = useMemo(() => Object.values(SECTION_ITEMS).flat(), []);
    const [search, setSearch] = useState("");
    const [section, setSection] = useState<SdvSection>("all");

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
                placeholder: "搜索名称…",
                label: "名称",
            }}
            groups={[
                {
                    key: "section",
                    label: "分类",
                    icon: "lucide:layout-grid",
                    value: section,
                    onChange: (value) => setSection(value as SdvSection),
                    options: SECTION_OPTIONS.map((opt) => ({ value: opt.value, label: opt.label })),
                },
            ]}
        />
    );

    return (
        <ItemsGalleryPage
            items={filteredItems}
            title="星露谷图鉴"
            description="浏览星露谷中的种子、工具和作物"
            filterBar={filterBar}
            sourceRules={SOURCE_RULES}
            variantStyles={VARIANT_STYLES}
        />
    );
}

export default function SdvPage() {
    return <SdvGalleryContent />;
}
