"use client";

import { useState, useEffect } from "react";
import { GemData, GemManifest } from "./types";
import { GemGrid } from "./grid";
import { GemCard } from "./card";
import { Loader2 } from "lucide-react";

interface GemShowcaseProps {
    category?: string;
    gemId?: string;
}

export function GemShowcase({ category, gemId }: GemShowcaseProps) {
    const [manifest, setManifest] = useState<GemManifest | null>(null);
    const [gems, setGems] = useState<GemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const res = await fetch("/wiki/item/data/manifest.json");
                if (!res.ok) throw new Error("无法加载物品清单");
                const manifestData: GemManifest = await res.json();
                setManifest(manifestData);

                let entries: string[] = [];
                if (gemId) {
                    // 查找指定 gem
                    for (const cat of manifestData.categories) {
                        const found = cat.entries.find((e) => e.includes(`/${gemId}.json`));
                        if (found) {
                            entries = [found];
                            break;
                        }
                    }
                } else if (category) {
                    const cat = manifestData.categories.find((c) => c.id === category);
                    entries = cat?.entries ?? [];
                } else {
                    entries = manifestData.categories.flatMap((c) => c.entries);
                }

                const gemPromises = entries.map(async (entry) => {
                    const res = await fetch(`/wiki/item/data/${entry}`);
                    if (!res.ok) return null;
                    return (await res.json()) as GemData;
                });

                const gemResults = (await Promise.all(gemPromises)).filter(Boolean) as GemData[];
                setGems(gemResults);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [category, gemId]);

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

    if (gemId && gems.length === 1) {
        return <GemCard gem={gems[0]} />;
    }

    if (category && manifest) {
        // const cat = manifest.categories.find((c) => c.id === category);
        return <GemGrid gems={gems} />;
    }

    return <GemGrid gems={gems} />;
}
