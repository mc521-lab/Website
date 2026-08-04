"use client";

import { gallery_deco_doll_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function DecoDollPage() {
    const items = gallery_deco_doll_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="玩偶图鉴" description="浏览游戏中的各类玩偶装饰" />;
}
