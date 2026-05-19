"use client";

import { useState, useEffect, useMemo } from "react";
import { GemData } from "./types";
import { GemGrid } from "./grid";
import { GemCard } from "./card";
import { Loader2, Search } from "lucide-react";

interface GemShowcaseProps {
    category?: string;
    gemId?: string;
}

export function GemShowcase({ gemId }: GemShowcaseProps) {
    const [gems, setGems] = useState<GemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

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

    const filteredGems = useMemo(() => {
        if (!searchQuery.trim()) return gems;
        const q = searchQuery.toLowerCase();
        return gems.filter((g) => g.name.toLowerCase().includes(q));
    }, [gems, searchQuery]);

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

    if (gemId && filteredGems.length === 1) {
        return <GemCard gem={filteredGems[0]} />;
    }

    return (
        <div className="my-6">
            <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                    type="text"
                    placeholder="搜索宝石名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>
            <GemGrid gems={filteredGems} />
        </div>
    );
}
