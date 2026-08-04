"use client";

import { gallery_skin_weapon_data } from "@/.velite";
import { ItemsGalleryPage } from "@/components/mc521/gallery/specific/items-gallery";

export default function SkinWeaponPage() {
    const items = gallery_skin_weapon_data as unknown as Parameters<typeof ItemsGalleryPage>[0]["items"];
    return <ItemsGalleryPage items={items} title="武器皮肤" description="浏览游戏中的各类武器皮肤" isGif={true} />;
}
