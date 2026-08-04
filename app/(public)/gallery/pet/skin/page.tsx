"use client";

import { gallery_pet_skin_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function PetSkinPage() {
    const items = gallery_pet_skin_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="宠物皮肤图鉴" description="浏览游戏中的各类宠物皮肤" />;
}
