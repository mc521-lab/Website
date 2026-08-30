"use client";

import { gallery_equipment_armor_data } from "@/.velite";
import { ArmorGalleryPage } from "@/components/module-spcific/gallery/specific/armor-gallery";
import type { ArmorItem } from "@/types/gallery";

export default function ArmorPage() {
    const items: ArmorItem[] = gallery_equipment_armor_data;
    return <ArmorGalleryPage items={items} />;
}
