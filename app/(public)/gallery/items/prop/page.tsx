"use client";

import { gallery_items_prop_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function PropPage() {
    const items = gallery_items_prop_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="道具图鉴" description="浏览游戏中的各类道具" />;
}
