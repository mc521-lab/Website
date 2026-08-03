"use client";

import { gallery_items_fragments_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function FragmentsPage() {
    const items = gallery_items_fragments_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="宠物碎片图鉴" description="浏览游戏中的各类宠物碎片" />;
}
