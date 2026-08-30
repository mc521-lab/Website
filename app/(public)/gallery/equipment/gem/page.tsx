"use client";

import { gallery_equipment_gem_data } from "@/.velite";
import { GemGalleryPage } from "@/components/module-spcific/gallery/specific/gem-gallery";
import type { GemItem } from "@/types/gallery";

export default function GemPage() {
    const items: GemItem[] = gallery_equipment_gem_data;
    return <GemGalleryPage items={items} />;
}
