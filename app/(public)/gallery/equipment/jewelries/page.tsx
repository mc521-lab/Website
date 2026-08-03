"use client";

import { gallery_equipment_jewelry_data } from "@/.velite";
import { JewelryGalleryPage } from "@/components/mc521/gallery/specific/jewelry-gallery";
import type { JewelryItem } from "@/components/mc521/gallery/types";

export default function JewelryPage() {
    const items: JewelryItem[] = gallery_equipment_jewelry_data as JewelryItem[];
    return <JewelryGalleryPage items={items} />;
}
