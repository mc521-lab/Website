"use client";

import { gallery_armor_data } from "@/.velite";
import { ArmorGalleryPage } from "@/components/mc521/gallery/specific/armor-gallery";
import type { ArmorItem } from "@/components/mc521/gallery/types";

export default function ArmorPage() {
    const items: ArmorItem[] = gallery_armor_data;
    return <ArmorGalleryPage items={items} />;
}
