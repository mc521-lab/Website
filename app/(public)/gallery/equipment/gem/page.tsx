"use client";

import { gallery_equipment_gem_data } from "@/.velite";
import { GemGalleryPage } from "@/components/mc521/gallery/specific/gem-gallery";
import type { GemItem } from "@/components/mc521/gallery/types";

export default function GemPage() {
    const items: GemItem[] = gallery_equipment_gem_data;
    return <GemGalleryPage items={items} />;
}
