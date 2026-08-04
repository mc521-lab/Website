"use client";

import { gallery_deco_wallsticker_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function DecoWallstickerPage() {
    const items = gallery_deco_wallsticker_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="墙贴图鉴" description="浏览游戏中的各类墙贴装饰" />;
}
