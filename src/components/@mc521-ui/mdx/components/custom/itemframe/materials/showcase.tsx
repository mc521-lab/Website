"use client";

import { useState, useEffect, useMemo } from "react";
import { MaterialData } from "./types";
import { groupMaterials, sortCategories, getCategoryColor } from "./utils";
import { MaterialCard } from "./card";
import { Loader2, Package, Search } from "lucide-react";

export function MaterialShowcase() {
    const [materials, setMaterials] = useState<MaterialData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const res = await fetch("/wiki/item/data/_compiled/materials.json");
                if (!res.ok) throw new Error("无法加载材料数据");
                const data = await res.json();
                setMaterials(data.materials ?? []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // 按类别分组
    const grouped = useMemo(() => {
        return groupMaterials(materials);
    }, [materials]);

    // 类别列表
    const categories = useMemo(() => {
        return sortCategories(Array.from(grouped.keys()));
    }, [grouped]);

    // 过滤后的分组（类别 + 搜索）
    const filteredGrouped = useMemo(() => {
        let filtered = materials;

        if (selectedCategory) {
            filtered = filtered.filter((m) => {
                const cat = m.id.startsWith("ZQ_")
                    ? "坐骑碎片"
                    : m.id.startsWith("CW_") && !m.id.startsWith("CWFOOD")
                      ? "宠物币"
                      : m.type === "宠食"
                        ? "宠食"
                        : m.type === "道具"
                          ? "道具"
                          : m.type === "货币"
                            ? "货币"
                            : "材料";
                return cat === selectedCategory;
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (m) =>
                    m.name.toLowerCase().includes(q) ||
                    m.description.toLowerCase().includes(q) ||
                    m.effect.toLowerCase().includes(q) ||
                    m.source.toLowerCase().includes(q)
            );
        }

        // 重新分组
        const result = new Map<string, MaterialData[]>();
        for (const m of filtered) {
            const cat = m.id.startsWith("ZQ_")
                ? "坐骑碎片"
                : m.id.startsWith("CW_") && !m.id.startsWith("CWFOOD")
                  ? "宠物币"
                  : m.type === "宠食"
                    ? "宠食"
                    : m.type === "道具"
                      ? "道具"
                      : m.type === "货币"
                        ? "货币"
                        : "材料";
            if (!result.has(cat)) {
                result.set(cat, []);
            }
            result.get(cat)!.push(m);
        }
        return result;
    }, [materials, selectedCategory, searchQuery]);

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

    return (
        <div className="my-6">
            <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                    type="text"
                    placeholder="搜索材料名称、描述或效果..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>

            {/* 类别过滤器 */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                <Package className="h-4 w-4 text-neutral-500" />
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                    }`}>
                    全部材料
                </button>
                {categories.map((cat) => {
                    const catColor = getCategoryColor(cat);
                    return (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className="rounded-full px-3 py-1 text-xs font-medium transition-all"
                            style={
                                selectedCategory === cat
                                    ? {
                                          border: `1px solid ${catColor}60`,
                                          backgroundColor: `${catColor}20`,
                                          color: catColor,
                                      }
                                    : {
                                          border: "1px solid #404040",
                                          backgroundColor: "rgba(38, 38, 38, 0.6)",
                                          color: "#a3a3a3",
                                      }
                            }>
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* 按类别分组展示 */}
            <div className="space-y-8">
                {Array.from(filteredGrouped.entries()).map(([cat, items]) => {
                    return (
                        <div key={cat} className="space-y-3">
                            {/* 类别标题 */}
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-1 rounded-full" style={{ backgroundColor: getCategoryColor(cat) }} />
                                <h3 className="text-base font-bold" style={{ color: getCategoryColor(cat) }}>
                                    {cat}
                                </h3>
                                <span className="text-xs text-neutral-500">({items.length})</span>
                            </div>

                            {/* 材料网格 */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                {items.map((m) => (
                                    <MaterialCard key={m.id} material={m} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredGrouped.size === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">暂无材料数据</div>
            )}
        </div>
    );
}
