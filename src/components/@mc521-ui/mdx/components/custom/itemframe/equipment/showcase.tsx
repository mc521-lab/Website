"use client";

import { useState, useEffect, useMemo } from "react";
import { ResolvedEquipment, EquipmentIndex, EquipmentJobEntry } from "./types";
import { EquipmentGrid } from "./grid";
import { EquipmentCard } from "./card";
import { loadJobIndex, loadSetData, loadSetEquipments, loadSetWeapon, loadColorConfig } from "./utils";
import { Loader2, Users } from "lucide-react";

interface EquipmentShowcaseProps {
    jobId?: string;
    equipmentId?: string;
}

export function EquipmentShowcase({ jobId, equipmentId }: EquipmentShowcaseProps) {
    const [equipments, setEquipments] = useState<ResolvedEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobEntries, setJobEntries] = useState<EquipmentJobEntry[]>([]);
    const [jobColors, setJobColors] = useState<Record<string, string>>({});

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                // 加载颜色配置
                const colorConfig = await loadColorConfig();

                // 构建职业颜色映射
                const colors: Record<string, string> = {};
                if (colorConfig) {
                    Object.entries(colorConfig.jobs).forEach(([id, job]) => {
                        colors[id] = job.symbolColor;
                    });
                }
                setJobColors(colors);

                // 加载总索引
                const indexRes = await fetch("/wiki/item/data/equipment/index.json");
                if (!indexRes.ok) throw new Error("无法加载装备索引");
                const indexData: EquipmentIndex = await indexRes.json();
                setJobEntries(indexData.jobs);

                // 加载所有职业的装备
                const allEquipments: ResolvedEquipment[] = [];

                for (const job of indexData.jobs) {
                    // 如果指定了职业，只加载该职业
                    if (jobId && job.id !== jobId) continue;

                    // 加载职业索引
                    const jobIndex = await loadJobIndex(job.entryPrefix);
                    if (!jobIndex) continue;

                    // 加载该职业所有套装的装备
                    for (const setEntry of jobIndex.sets) {
                        const setPath = `${job.entryPrefix}/${setEntry.folder}`;
                        const setData = await loadSetData(setPath);
                        if (!setData) continue;

                        const setEquipments = await loadSetEquipments(setPath, setData, job, colorConfig);
                        allEquipments.push(...setEquipments);
                    }
                }

                setEquipments(allEquipments);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [jobId, equipmentId]);

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

    return <EquipmentGrid equipments={equipments} jobEntries={jobEntries} jobColors={jobColors} />;
}

// 武器展示组件
interface WeaponShowcaseProps {
    jobId?: string;
}

const QUALITY_ORDER = ["D", "C", "B", "A", "S"];

export function WeaponShowcase({ jobId }: WeaponShowcaseProps) {
    const [weapons, setWeapons] = useState<ResolvedEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobEntries, setJobEntries] = useState<EquipmentJobEntry[]>([]);
    const [jobColors, setJobColors] = useState<Record<string, string>>({});
    const [selectedJob, setSelectedJob] = useState<string | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                // 加载颜色配置
                const colorConfig = await loadColorConfig();

                // 构建职业颜色映射
                const colors: Record<string, string> = {};
                if (colorConfig) {
                    Object.entries(colorConfig.jobs).forEach(([id, job]) => {
                        colors[id] = job.symbolColor;
                    });
                }
                setJobColors(colors);

                // 加载总索引
                const indexRes = await fetch("/wiki/item/data/equipment/index.json");
                if (!indexRes.ok) throw new Error("无法加载装备索引");
                const indexData: EquipmentIndex = await indexRes.json();
                setJobEntries(indexData.jobs);

                // 加载所有职业的武器
                const allWeapons: ResolvedEquipment[] = [];

                for (const job of indexData.jobs) {
                    // 如果指定了职业，只加载该职业
                    if (jobId && job.id !== jobId) continue;

                    // 加载职业索引
                    const jobIndex = await loadJobIndex(job.entryPrefix);
                    if (!jobIndex) continue;

                    // 加载该职业所有套装的武器
                    for (const setEntry of jobIndex.sets) {
                        const setPath = `${job.entryPrefix}/${setEntry.folder}`;
                        const setData = await loadSetData(setPath);
                        if (!setData) continue;

                        const weapon = await loadSetWeapon(setPath, setData, job, colorConfig);
                        if (weapon) {
                            allWeapons.push(weapon);
                        }
                    }
                }

                setWeapons(allWeapons);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [jobId]);

    // 按职业分组并排序武器
    const groupedWeapons = useMemo(() => {
        // 先按职业过滤
        const filtered = selectedJob ? weapons.filter((w) => w.jobId === selectedJob) : weapons;

        // 按职业分组
        const groups = new Map<string, ResolvedEquipment[]>();

        for (const weapon of filtered) {
            const jobId = weapon.jobId || "unknown";
            if (!groups.has(jobId)) {
                groups.set(jobId, []);
            }
            groups.get(jobId)!.push(weapon);
        }

        // 对每个职业的武器按品质排序 (D-C-B-A-S)
        for (const [, jobWeapons] of groups) {
            jobWeapons.sort((a, b) => {
                const aIndex = QUALITY_ORDER.indexOf(a.quality);
                const bIndex = QUALITY_ORDER.indexOf(b.quality);
                return aIndex - bIndex;
            });
        }

        return groups;
    }, [weapons, selectedJob]);

    // 获取职业颜色的辅助函数
    const getJobColor = (jobId: string): string => {
        return jobColors[jobId] ?? "#767676";
    };

    // 获取职业名称
    const getJobName = (jobId: string): string => {
        const job = jobEntries.find((j) => j.id === jobId);
        return job?.name || jobId;
    };

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
            {/* 职业过滤器 */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                <Users className="h-4 w-4 text-neutral-500" />
                <button
                    onClick={() => setSelectedJob(null)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedJob === null
                            ? "bg-primary text-primary-foreground"
                            : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                    }`}>
                    全部职业
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

            {/* 按职业分组展示武器 */}
            <div className="space-y-8">
                {Array.from(groupedWeapons.entries()).map(([jobId, jobWeapons]) => (
                    <div key={jobId} className="space-y-3">
                        {/* 职业标题 */}
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-1 rounded-full" style={{ backgroundColor: getJobColor(jobId) }} />
                            <h3 className="text-base font-bold text-neutral-100">{getJobName(jobId)}</h3>
                            <span className="text-xs text-neutral-500">({jobWeapons.length})</span>
                        </div>

                        {/* 该职业的武器横向排列 - 5个一行 */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {jobWeapons.map((weapon) => (
                                <EquipmentCard key={weapon.id} equipment={weapon} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {groupedWeapons.size === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">暂无武器数据</div>
            )}
        </div>
    );
}
