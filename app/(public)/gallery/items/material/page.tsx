"use client";

import { gallery_items_material_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function MaterialPage() {
    const items = gallery_items_material_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="材料图鉴" description="浏览游戏中的各类材料" />;
}
