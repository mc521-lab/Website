"use client";

import { gallery_items_currency_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function CurrencyPage() {
    const items = gallery_items_currency_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="货币图鉴" description="浏览游戏中的各类货币" />;
}
