"use client";

import { useState, useEffect } from "react";
import { ResolvedJewelry, JewelryManifestCategory } from "./types";
import { JewelryGrid } from "./grid";
import { JewelryCard } from "./card";
import { Loader2 } from "lucide-react";

interface JewelryShowcaseProps {
    category?: string;
    jewelryId?: string;
}

export function JewelryShowcase({ category, jewelryId }: JewelryShowcaseProps) {
    const [manifest, setManifest] = useState<JewelryManifestCategory | null>(null);
    const [jewelries, setJewelries] = useState<ResolvedJewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const res = await fetch("/wiki/item/data/_compiled/jewelries.json");
                if (!res.ok) throw new Error("无法加载饰品数据");
                const data = await res.json();

                const manifestData: JewelryManifestCategory = data.manifest;
                setManifest(manifestData);

                let list: ResolvedJewelry[] = data.jewelries ?? [];
                if (jewelryId) {
                    list = list.filter(
                        (j: ResolvedJewelry) => j.id === jewelryId || j.slotType?.includes(jewelryId)
                    );
                }
                setJewelries(list);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [category, jewelryId]);

    if (loading) {
        return (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-neutral-500" />
            </div>
        );
    }

    if (error) {
        return <div className="rounded-lg border border-red-900/30 bg-red-950/20 p-4 text-red-400">加载失败: {error}</div>;
    }

    if (jewelryId && jewelries.length === 1) {
        return <JewelryCard jewelry={jewelries[0]} />;
    }

    const jobEntries = manifest?.metadata?.jobEntries;
    const hasTreasure = jewelries.some((j) => j.isTreasure);

    return <JewelryGrid jewelries={jewelries} jobEntries={jobEntries} showTreasureHint={hasTreasure} />;
}
