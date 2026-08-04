"use client";

import { gallery_sdv_seed_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function SdvSeedPage() {
    const items = gallery_sdv_seed_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="种子图鉴" description="浏览星露谷中的各类作物种子" />;
}
