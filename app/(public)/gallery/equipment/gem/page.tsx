"use client";

import { gallery_equipment_gem_data } from "@/.velite";
import { GemGalleryPage } from "@/app/(public)/gallery/_components/specific/gem-gallery";
import type { GemItem } from "@/app/(public)/gallery/_components/types";

export default function GemPage() {
    const items: GemItem[] = gallery_equipment_gem_data;
    return <GemGalleryPage items={items} />;
}

