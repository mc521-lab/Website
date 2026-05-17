"use client";

import { useState, useMemo } from "react";
import { ResolvedJewelry, JewelryJobEntry } from "./types";
import { JewelryCard } from "./card";
import { Users, Dices } from "lucide-react";

interface JewelryGridProps {
    jewelries: ResolvedJewelry[];
    title?: string;
    jobEntries?: JewelryJobEntry[];
    showTreasureHint?: boolean;
}

export function JewelryGrid({ jewelries, title, jobEntries, showTreasureHint }: JewelryGridProps) {
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!selectedJob) return jewelries;
        return jewelries.filter((j) => j.jobId === selectedJob || j.jobId === undefined);
    }, [jewelries, selectedJob]);

    const hasJobs = jobEntries && jobEntries.length > 0;

    return (
        <div className="my-6">
            {title && (
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-100">
                    <span className="bg-primary h-6 w-1 rounded-full" />
                    {title}
                </h2>
            )}

            {/* 筛选栏：职业标签 + 秘宝提示 */}
            {(hasJobs || showTreasureHint) && (
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    {/* 左侧：职业筛选 */}
                    {hasJobs && (
                        <div className="flex flex-wrap items-center gap-2">
                            <Users className="h-4 w-4 text-neutral-500" />
                            <button
                                onClick={() => setSelectedJob(null)}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                    selectedJob === null
                                        ? "bg-primary text-primary-foreground"
                                        : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                                }`}>
                                全部
                            </button>
                            {jobEntries.map((job) => (
                                <button
                                    key={job.id}
                                    onClick={() => setSelectedJob(job.id)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                                        selectedJob === job.id
                                            ? "text-white"
                                            : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                                    }`}
                                    style={selectedJob === job.id ? { backgroundColor: job.symbolColor } : undefined}>
                                    {job.name}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* 右侧：秘宝提示 */}
                    {showTreasureHint && (
                        <div className="flex items-center gap-1.5 rounded-lg border border-amber-900/30 bg-amber-950/20 px-3 py-1.5 text-xs text-amber-400">
                            <Dices className="h-3.5 w-3.5" />
                            <span>以下三组属性中，随机获得一组</span>
                        </div>
                    )}
                </div>
            )}

            {/* 饰品网格 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filtered.map((jewelry) => (
                    <JewelryCard key={jewelry.id} jewelry={jewelry} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">
                    该职业暂无饰品数据
                </div>
            )}
        </div>
    );
}
