"use client";

import { useState, useEffect } from "react";
import { GemData } from "./types";
import { GemGrid } from "./grid";
import { GemCard } from "./card";
import { Loader2 } from "lucide-react";

interface GemShowcaseProps {
    category?: string;
    gemId?: string;
}

export function GemShowcase({ gemId }: GemShowcaseProps) {
    const [gems, setGems] = useState<GemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const res = await fetch("/wiki/item/data/_compiled/gems.json");
                if (!res.ok) throw new Error("无法加载宝石数据");
                const data = await res.json();

                let gemList: GemData[] = data.gems ?? [];
                if (gemId) {
                    gemList = gemList.filter((g: GemData) => g.id === gemId);
                }
                setGems(gemList);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [gemId]);

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

    return <GemGrid gems={gems} />;
}
