"use client";

import { MaterialData } from "./types";
import { getQualityColor, getCategoryColor, getMaterialCategory } from "./utils";
import { Diamond, Sparkles, MapPin } from "lucide-react";

interface MaterialCardProps {
    material: MaterialData;
}

export function MaterialCard({ material }: MaterialCardProps) {
    const qualityColor = getQualityColor(material.quality);
    const categoryColor = getCategoryColor(getMaterialCategory(material));

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/80 transition-all duration-300 hover:border-neutral-700 hover:bg-neutral-800/80"
            style={{
                boxShadow: `inset 0 0 0 1px ${categoryColor}20`,
            }}>
            {/* 顶部装饰条 */}
            <div
                className="absolute top-0 left-0 h-1 w-full opacity-60"
                style={{
                    background: `linear-gradient(90deg, transparent, ${categoryColor}, transparent)`,
                }}
            />

            <div className="flex flex-1 flex-col p-4 pb-3">
                {/* 头部：图标 + 名称 + 品质 */}
                <div className="mb-3 flex items-center gap-2.5">
                    <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xl"
                        style={{
                            background: `linear-gradient(135deg, ${categoryColor}20, ${categoryColor}08)`,
                            border: `1px solid ${categoryColor}30`,
                        }}>
                        <Diamond className="h-5 w-5" style={{ color: categoryColor }} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                            <h3 className="truncate text-sm font-bold text-neutral-100">{material.name}</h3>
                            <span
                                className="shrink-0 rounded px-1 py-0 text-[10px] leading-4 font-bold"
                                style={{
                                    background: `${qualityColor}20`,
                                    color: qualityColor,
                                    border: `1px solid ${qualityColor}40`,
                                }}>
                                {material.quality}
                            </span>
                        </div>
                        <div className="text-[11px] text-neutral-500">{material.type}</div>
                    </div>
                </div>

                {/* 描述 */}
                {material.description && (
                    <p className="mb-2 text-[11px] leading-relaxed whitespace-pre-line text-neutral-400">{material.description}</p>
                )}

                {/* 效果 */}
                {material.effect && (
                    <div className="mt-auto flex items-start gap-1.5 border-t border-neutral-800/80 pt-2">
                        <Sparkles className="mt-0.5 h-3 w-3 shrink-0 text-amber-500/70" />
                        <p className="text-[11px] leading-relaxed whitespace-pre-line text-amber-400/80">{material.effect}</p>
                    </div>
                )}

                {/* 获取方式 */}
                {material.source && (
                    <div className="mt-auto flex items-start gap-1.5 border-t border-neutral-800/80 pt-2">
                        <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500/70" />
                        <p className="text-[11px] leading-relaxed whitespace-pre-line text-emerald-400/80">{material.source}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
