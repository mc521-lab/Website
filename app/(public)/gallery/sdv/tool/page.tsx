"use client";

import { gallery_sdv_tool_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function SdvToolPage() {
    const items = gallery_sdv_tool_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="工具图鉴" description="浏览星露谷中的各类种植工具" />;
}
