"use client";

import { gallery_equipment_sword_data } from "@/.velite";
import { SwordGalleryPage } from "@/app/(public)/gallery/_components/specific/sword-gallery";
import type { SwordItem } from "@/app/(public)/gallery/_components/types";

export default function SwordPage() {
    const items: SwordItem[] = gallery_equipment_sword_data;
    return <SwordGalleryPage items={items} />;
}
