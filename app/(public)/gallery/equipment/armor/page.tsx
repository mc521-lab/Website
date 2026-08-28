"use client";

import { gallery_equipment_armor_data } from "@/.velite";
import { ArmorGalleryPage } from "@/app/(public)/gallery/_components/specific/armor-gallery";
import type { ArmorItem } from "@/app/(public)/gallery/_components/types";

export default function ArmorPage() {
    const items: ArmorItem[] = gallery_equipment_armor_data;
    return <ArmorGalleryPage items={items} />;
}
