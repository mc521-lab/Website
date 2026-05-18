"use client";

import { useState } from "react";
import { ResolvedEnchant } from "./types";
import { getTargetIcon, getTargetName, getValuesAtLevel } from "./utils";
import { Sparkles, Ban, Scale, CheckCircle2 } from "lucide-react";

interface EnchantCardProps {
    enchant: ResolvedEnchant;
    enchantNameMap: Map<string, string>;
}

export function EnchantCard({ enchant, enchantNameMap }: EnchantCardProps) {
    const rarityColor = enchant.rarityColor || "#f8f4ed";
    const typeColor = enchant.typeColor || "#69d941";
    const isCurse = enchant.rarity === "curse";
    const [selectedLevel, setSelectedLevel] = useState(1);

    // 获取当前等级的数值
    const currentValues = getValuesAtLevel(enchant.values, selectedLevel);

    // 替换描述中的占位符（修复重复单位问题）
    const getDescription = () => {
        let desc = enchant.description;
        currentValues.forEach((v) => {
            const displayValue = v.unit === "%" ? Math.round(v.value) : v.value.toFixed(1).replace(/\.0$/, "");
            // 只替换值，不添加单位（因为描述中已经有单位了）
            desc = desc.replace(new RegExp(`%${v.id}%`, "g"), displayValue as string);
        });
        return desc;
    };

    // 获取冲突附魔的显示名
    const getConflictName = (conflictId: string): string => {
        return enchantNameMap.get(conflictId) || conflictId;
    };

    // 是否有数值差异
    const hasValueDifferences = enchant.values.length > 0;

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${rarityColor}20`,
                borderColor: `${rarityColor}30`,
            }}>
            {/* 顶部装饰条 - 使用rarity颜色 */}
            <div
                className="absolute top-0 left-0 h-1 w-full"
                style={{
                    background: `linear-gradient(90deg, transparent, ${rarityColor}, transparent)`,
                    opacity: 0.8,
                }}
            />

            <div className="flex flex-1 flex-col p-4">
                {/* 头部：名称 + 右上角类型·稀有度 */}
                <div className="mb-2 flex items-start justify-between">
                    <h3 className="text-sm font-bold text-neutral-100">{enchant.displayName}</h3>
                    {/* 右上角：{绿色}原版 · {普通色}普通 */}
                    <div className="flex items-center gap-1 text-[10px]">
                        <span style={{ color: typeColor }}>{enchant.typeName}</span>
                        <span className="text-neutral-600">·</span>
                        <span style={{ color: rarityColor }}>{enchant.rarityName}</span>
                    </div>
                </div>

                {/* 描述 */}
                <p className="mb-2 flex-1 text-[11px] leading-relaxed text-neutral-400">{getDescription()}</p>

                {/* 数值展示区域 */}
                {hasValueDifferences ? (
                    <div className="rounded border bg-neutral-900/50 p-2" style={{ borderColor: `${rarityColor}20` }}>
                        {/* 等级选择器 */}
                        <div className="mb-2 flex items-center gap-2">
                            <span className="text-[10px] text-neutral-500">等级:</span>
                            <div className="flex flex-wrap gap-1">
                                {Array.from({ length: enchant.maxLevel }, (_, i) => i + 1).map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`h-5 w-5 rounded text-[10px] font-medium transition-colors ${
                                            selectedLevel === level
                                                ? "text-neutral-900"
                                                : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600"
                                        }`}
                                        style={selectedLevel === level ? { backgroundColor: rarityColor } : undefined}>
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 数值展示 */}
                        <div className="space-y-1">
                            {currentValues.map((v) => (
                                <div key={v.id} className="flex items-center justify-between">
                                    <span className="text-[10px] text-neutral-400">{v.name}</span>
                                    <span className="text-[10px] font-medium" style={{ color: rarityColor }}>
                                        {v.unit === "%" ? Math.round(v.value) : v.value.toFixed(1).replace(/\.0$/, "")}
                                        {v.unit}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    /* 没有数值差异时显示诅咒标签（如果有） */
                    isCurse && (
                        <div className="mb-3">
                            <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[10px] text-red-400">诅咒</span>
                        </div>
                    )
                )}

                {/* 适用物品 */}
                <div className="mt-2 border-t border-neutral-800/80 pt-2">
                    <div className="mb-1.5 flex items-center gap-1 text-[10px] text-neutral-500">
                        <Sparkles className="h-3 w-3" />
                        <span>适用</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {enchant.targets.slice(0, 4).map((target) => (
                            <span
                                key={target}
                                className="inline-flex items-center gap-0.5 rounded bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-neutral-300">
                                <span>{getTargetIcon(target)}</span>
                                <span>{getTargetName(target)}</span>
                            </span>
                        ))}
                        {enchant.targets.length > 4 && (
                            <span className="rounded bg-neutral-800/60 px-1.5 py-0.5 text-[10px] text-neutral-500">
                                +{enchant.targets.length - 4}
                            </span>
                        )}
                    </div>
                </div>

                {/* 冲突附魔 */}
                {enchant.conflicts.length > 0 && (
                    <div className="border-t border-neutral-800/80 pt-2">
                        <div className="mb-1 flex items-center gap-1 text-[10px] text-neutral-500">
                            <Ban className="h-3 w-3" />
                            <span>冲突</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {enchant.conflicts.map((conflict) => (
                                <span key={conflict} className="rounded bg-red-950/30 px-1.5 py-0.5 text-[10px] text-red-400/80">
                                    {getConflictName(conflict)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 获取方式 */}
                <div className="mt-2 flex items-center gap-2 border-t border-neutral-800/80 pt-2 text-[9px] text-neutral-500">
                    {enchant.enchantable && (
                        <span className="flex items-center gap-0.5 text-emerald-400/70">
                            <CheckCircle2 className="h-2.5 w-2.5" />
                            附魔台
                        </span>
                    )}
                    {enchant.tradeable && (
                        <span className="flex items-center gap-0.5 text-blue-400/70">
                            <Scale className="h-2.5 w-2.5" />
                            交易
                        </span>
                    )}
                    {enchant.discoverable && (
                        <span className="flex items-center gap-0.5 text-amber-400/70">
                            <Sparkles className="h-2.5 w-2.5" />
                            探索
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
