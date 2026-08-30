"use client";

import { gallery_equipment_jewelry_data } from "@/.velite";
import { JewelryGalleryPage } from "@/components/module-spcific/gallery/specific/jewelry-gallery";
import type { JewelryItem } from "@/types/gallery";

export default function JewelryPage() {
    const items: JewelryItem[] = gallery_equipment_jewelry_data as JewelryItem[];
    return <JewelryGalleryPage items={items} />;
}
