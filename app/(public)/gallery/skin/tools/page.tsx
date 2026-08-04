"use client";

import { gallery_skin_tools_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function SkinToolsPage() {
    const items = gallery_skin_tools_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="工具皮肤" description="浏览游戏中的各类工具皮肤" isGif={true} />;
}
