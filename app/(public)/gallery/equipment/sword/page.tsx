"use client";

import { gallery_equipment_sword_data } from "@/.velite";
import { SwordGalleryPage } from "@/components/module-spcific/gallery/specific/sword-gallery";
import type { SwordItem } from "@/types/gallery";

export default function SwordPage() {
    const items: SwordItem[] = gallery_equipment_sword_data;
    return <SwordGalleryPage items={items} />;
}
