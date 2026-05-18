"use client";

import { useState, useMemo } from "react";
import { ResolvedEquipment, EquipmentJobEntry } from "./types";
import { EquipmentSetRow } from "./card";
import { Users } from "lucide-react";

interface EquipmentGridProps {
    equipments: ResolvedEquipment[];
    title?: string;
    jobEntries?: EquipmentJobEntry[];
    jobColors?: Record<string, string>;
}

export function EquipmentGrid({ equipments, title, jobEntries, jobColors }: EquipmentGridProps) {
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    const filtered = useMemo(() => {
        if (!selectedJob) return equipments;
        return equipments.filter((e) => e.jobId === selectedJob || e.jobId === undefined);
    }, [equipments, selectedJob]);

    const hasJobs = jobEntries && jobEntries.length > 0;

    // 按 setId 分组
    const grouped = useMemo(() => {
        const map = new Map<string, ResolvedEquipment[]>();
        for (const eq of filtered) {
            const key = eq.setId ?? eq.id;
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(eq);
        }
        return map;
    }, [filtered]);

    // 获取职业颜色的辅助函数
    const getJobColor = (jobId: string): string => {
        if (jobColors && jobColors[jobId]) return jobColors[jobId];
        // 从装备数据中查找
        const equipment = equipments.find((e) => e.jobId === jobId);
        return equipment?.jobColor ?? "#767676";
    };

    return (
        <div className="my-6">
            {title && (
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-100">
                    <span className="bg-primary h-6 w-1 rounded-full" />
                    {title}
                </h2>
            )}

            {/* 筛选栏：职业标签 */}
            {hasJobs && (
                <div className="mb-4 flex flex-wrap items-center gap-2">
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
                            style={selectedJob === job.id ? { backgroundColor: getJobColor(job.id) } : undefined}>
                            {job.name}
                        </button>
                    ))}
                </div>
            )}

            {/* 按套装分组展示 - 只显示防具 */}
            <div>
                {Array.from(grouped.entries()).map(([setId, items]) => {
                    const first = items[0];
                    const setName = first.setName ?? first.name;
                    const jobColor = first.jobColor;
                    const setEffects = first.setEffects;

                    // 只取防具
                    const armors = items.filter((e) => e.slot !== "weapon");
                    if (armors.length === 0) return null;

                    return <EquipmentSetRow key={setId} setName={setName} armors={armors} jobColor={jobColor} setEffects={setEffects} />;
                })}
            </div>

            {filtered.length === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">
                    该职业暂无装备数据
                </div>
            )}
        </div>
    );
}
