"use client";

import { useState, useEffect, useMemo } from "react";
import { ResolvedJewelry, JewelryManifestCategory } from "./types";
import { JewelryGrid } from "./grid";
import { JewelryCard } from "./card";
import { Loader2, Search } from "lucide-react";

interface JewelryShowcaseProps {
    category?: string;
    jewelryId?: string;
}

export function JewelryShowcase({ category, jewelryId }: JewelryShowcaseProps) {
    const [manifest, setManifest] = useState<JewelryManifestCategory | null>(null);
    const [jewelries, setJewelries] = useState<ResolvedJewelry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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
                    list = list.filter((j: ResolvedJewelry) => j.id === jewelryId || j.slotType?.includes(jewelryId));
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

    const filteredJewelries = useMemo(() => {
        if (!searchQuery.trim()) return jewelries;
        const q = searchQuery.toLowerCase();
        return jewelries.filter((j) => j.name.toLowerCase().includes(q) || j.slotType?.toLowerCase().includes(q));
    }, [jewelries, searchQuery]);

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

    if (jewelryId && filteredJewelries.length === 1) {
        return <JewelryCard jewelry={filteredJewelries[0]} />;
    }

    const jobEntries = manifest?.metadata?.jobEntries;
    const hasTreasure = filteredJewelries.some((j) => j.isTreasure);

    return (
        <div className="my-6">
            <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                    type="text"
                    placeholder="搜索饰品名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>
            <JewelryGrid jewelries={filteredJewelries} jobEntries={jobEntries} showTreasureHint={hasTreasure} />
        </div>
    );
}
