"use client";

import { useState, useEffect } from "react";
import { ResolvedJewelry, JewelryManifest } from "./types";
import { JewelryGrid } from "./grid";
import { JewelryCard } from "./card";
import { resolveJewelryEntry } from "./utils";
import { Loader2 } from "lucide-react";

interface JewelryShowcaseProps {
    category?: string;
    jewelryId?: string;
}

export function JewelryShowcase({ category, jewelryId }: JewelryShowcaseProps) {
    const [manifest, setManifest] = useState<JewelryManifest | null>(null);
    const [jewelries, setJewelries] = useState<ResolvedJewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const res = await fetch("/wiki/item/data/manifest.json");
                if (!res.ok) throw new Error("无法加载物品清单");
                const manifestData: JewelryManifest = await res.json();
                setManifest(manifestData);

                const cat = manifestData.categories.find((c) => c.id === (category ?? "jewelries"));
                if (!cat) {
                    setJewelries([]);
                    setLoading(false);
                    return;
                }

                const jobEntries = cat.metadata?.jobEntries ?? [];
                const jobMap = new Map(jobEntries.map((j) => [j.entryPrefix, j]));

                let entries: string[] = [];
                if (jewelryId) {
                    const found = cat.entries.find((e) => {
                        const filename = e.split("/").pop()?.replace(".json", "");
                        return filename === jewelryId || e.includes(jewelryId);
                    });
                    entries = found ? [found] : [];
                } else {
                    entries = cat.entries;
                }

                const promises = entries.map(async (entry) => {
                    const prefix = entry.split("/").slice(0, 2).join("/");
                    const jobEntry = jobMap.get(prefix);
                    return resolveJewelryEntry(entry, jobEntry);
                });

                const results = (await Promise.all(promises)).filter(Boolean) as ResolvedJewelry[];
                setJewelries(results);
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

    const cat = manifest?.categories.find((c) => c.id === (category ?? "jewelries"));
    const jobEntries = cat?.metadata?.jobEntries;
    const hasTreasure = jewelries.some((j) => j.isTreasure);

    return <JewelryGrid jewelries={jewelries} jobEntries={jobEntries} showTreasureHint={hasTreasure} />;
}
