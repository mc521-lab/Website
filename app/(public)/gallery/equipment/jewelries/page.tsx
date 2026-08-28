"use client";

import { gallery_equipment_jewelry_data } from "@/.velite";
import { JewelryGalleryPage } from "@/app/(public)/gallery/_components/specific/jewelry-gallery";
import type { JewelryItem } from "@/app/(public)/gallery/_components/types";

export default function JewelryPage() {
    const items: JewelryItem[] = gallery_equipment_jewelry_data as JewelryItem[];
    return <JewelryGalleryPage items={items} />;
}
