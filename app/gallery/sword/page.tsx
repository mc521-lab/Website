"use client";

import { gallery_sword_data } from "@/.velite";
import { SwordGalleryPage } from "@/components/mc521/gallery/specific/sword-gallery";
import type { SwordItem } from "@/components/mc521/gallery/types";

export default function SwordPage() {
    const items: SwordItem[] = gallery_sword_data;
    return <SwordGalleryPage items={items} />;
}

