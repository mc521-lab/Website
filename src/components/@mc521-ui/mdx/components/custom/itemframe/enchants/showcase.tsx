"use client";

import { useState, useEffect, useMemo } from "react";
import { ResolvedEnchant, EnchantsManifest } from "./types";
import { loadAllEnchantsData } from "./utils";
import { EnchantCard } from "./card";
import { Loader2, Layers, Gem, Search } from "lucide-react";

export function EnchantsShowcase() {
    const [enchants, setEnchants] = useState<ResolvedEnchant[]>([]);
    const [manifest, setManifest] = useState<EnchantsManifest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const data = await loadAllEnchantsData();
                if (!data) {
                    throw new Error("无法加载附魔数据");
                }
                setManifest(data.manifest);
                setEnchants(data.enchants);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // 构建附魔ID到显示名的映射
    const enchantNameMap = useMemo(() => {
        const map = new Map<string, string>();
        for (const enchant of enchants) {
            map.set(enchant.id, enchant.displayName);
        }
        return map;
    }, [enchants]);

    // 过滤附魔
    const filteredEnchants = useMemo(() => {
        let list = enchants;
        if (selectedType) {
            list = list.filter((e) => e.type === selectedType);
        }
        if (selectedRarity) {
            list = list.filter((e) => e.rarity === selectedRarity);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((e) => e.displayName.toLowerCase().includes(q) || e.id.toLowerCase().includes(q));
        }
        return list;
    }, [enchants, selectedType, selectedRarity, searchQuery]);

    // 按稀有度分组
    const groupedEnchants = useMemo(() => {
        const groups = new Map<string, ResolvedEnchant[]>();

        for (const enchant of filteredEnchants) {
            const rarityId = enchant.rarity;
            if (!groups.has(rarityId)) {
                groups.set(rarityId, []);
            }
            groups.get(rarityId)!.push(enchant);
        }

        return groups;
    }, [filteredEnchants]);

    // 获取类型和稀有度信息
    const types = manifest?.types || {};
    const rarities = useMemo(() => manifest?.rarities || {}, [manifest]);

    // 稀有度排序
    const sortedRarityIds = useMemo(() => {
        return Array.from(groupedEnchants.keys()).sort((a, b) => {
            const orderA = rarities[a]?.order || 99;
            const orderB = rarities[b]?.order || 99;
            return orderA - orderB;
        });
    }, [groupedEnchants, rarities]);

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
                    placeholder="搜索附魔名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>

            {/* 过滤器 */}
            <div className="mb-6 flex flex-wrap items-start gap-6">
                {/* 类型筛选 */}
                <div className="flex flex-wrap items-center gap-2">
                    <Layers className="h-4 w-4 text-neutral-500" />
                    <button
                        onClick={() => setSelectedType(null)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            selectedType === null
                                ? "bg-primary text-neutral-900"
                                : "border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                        }`}>
                        全部
                    </button>
                    {Object.entries(types).map(([typeId, typeInfo]) => (
                        <button
                            key={typeId}
                            onClick={() => setSelectedType(typeId)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                selectedType === typeId
                                    ? "text-neutral-900"
                                    : "border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                            }`}
                            style={
                                selectedType === typeId
                                    ? {
                                          backgroundColor: typeInfo.color,
                                          borderColor: typeInfo.color,
                                      }
                                    : undefined
                            }>
                            {typeInfo.name}
                        </button>
                    ))}
                </div>

                {/* 稀有度筛选 */}
                <div className="flex flex-wrap items-center gap-2">
                    <Gem className="h-4 w-4 text-neutral-500" />
                    <button
                        onClick={() => setSelectedRarity(null)}
                        className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                            selectedRarity === null
                                ? "bg-primary text-neutral-900"
                                : "border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                        }`}>
                        全部
                    </button>
                    {Object.entries(rarities)
                        .sort((a, b) => (a[1].order || 99) - (b[1].order || 99))
                        .map(([rarityId, rarityInfo]) => (
                            <button
                                key={rarityId}
                                onClick={() => setSelectedRarity(rarityId)}
                                className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                                    selectedRarity === rarityId
                                        ? "text-neutral-900"
                                        : "border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                                }`}
                                style={
                                    selectedRarity === rarityId
                                        ? {
                                              backgroundColor: rarityInfo.color,
                                              borderColor: rarityInfo.color,
                                          }
                                        : undefined
                                }>
                                {rarityInfo.name}
                            </button>
                        ))}
                </div>
            </div>

            {/* 按稀有度分组展示 */}
            <div className="space-y-8">
                {sortedRarityIds.map((rarityId) => {
                    const rarityEnchants = groupedEnchants.get(rarityId) || [];
                    const rarityInfo = rarities[rarityId];
                    const isCurse = rarityId === "curse";

                    return (
                        <div key={rarityId} className="space-y-3">
                            {/* 稀有度标题 */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="h-5 w-1 rounded-full"
                                    style={{
                                        backgroundColor: rarityInfo?.color || "#f8f4ed",
                                        opacity: isCurse ? 0.6 : 1,
                                    }}
                                />
                                <h3 className="text-base font-bold" style={{ color: rarityInfo?.color || "#f8f4ed" }}>
                                    {rarityInfo?.name || rarityId}
                                </h3>
                                <span className="text-xs text-neutral-500">({rarityEnchants.length})</span>
                            </div>

                            {/* 附魔网格 */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {rarityEnchants.map((enchant) => (
                                    <EnchantCard key={enchant.id} enchant={enchant} enchantNameMap={enchantNameMap} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {groupedEnchants.size === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">暂无附魔数据</div>
            )}
        </div>
    );
}
