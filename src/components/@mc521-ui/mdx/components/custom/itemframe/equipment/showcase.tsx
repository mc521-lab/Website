"use client";

import { useState, useEffect, useMemo } from "react";
import { ResolvedEquipment, EquipmentJobEntry } from "./types";
import { EquipmentGrid } from "./grid";
import { EquipmentCard } from "./card";
import { loadAllEquipmentData } from "./utils";
import { Loader2, Users, Search } from "lucide-react";

interface EquipmentShowcaseProps {
    jobId?: string;
    equipmentId?: string;
}

export function EquipmentShowcase({ jobId, equipmentId }: EquipmentShowcaseProps) {
    const [equipments, setEquipments] = useState<ResolvedEquipment[]>([]);
    const [allEquipments, setAllEquipments] = useState<ResolvedEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobEntries, setJobEntries] = useState<EquipmentJobEntry[]>([]);
    const [jobColors, setJobColors] = useState<Record<string, string>>({});
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                const data = await loadAllEquipmentData();
                if (!data) throw new Error("无法加载装备数据");

                // 构建职业颜色映射
                const colors: Record<string, string> = {};
                if (data.colors) {
                    Object.entries(data.colors.jobs).forEach(([id, job]) => {
                        colors[id] = job.symbolColor;
                    });
                }
                setJobColors(colors);
                setJobEntries(data.jobs);

                // 过滤装备
                const list = data.equipments.filter((e) => !jobId || e.jobId === jobId);
                setAllEquipments(list);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [jobId, equipmentId]);

    const filteredEquipments = useMemo(() => {
        let list = allEquipments;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (e) => e.name.toLowerCase().includes(q) || e.setName?.toLowerCase().includes(q) || e.jobName?.toLowerCase().includes(q)
            );
        }
        if (equipmentId) {
            list = list.filter((e) => e.id === equipmentId);
        }
        return list;
    }, [allEquipments, searchQuery, equipmentId]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setEquipments(filteredEquipments);
        }, 0);
        return () => clearTimeout(timer);
    }, [filteredEquipments]);

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
                    placeholder="搜索装备名称或套装..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>
            <EquipmentGrid equipments={equipments} jobEntries={jobEntries} jobColors={jobColors} />
        </div>
    );
}

// 武器展示组件
interface WeaponShowcaseProps {
    jobId?: string;
}

const QUALITY_ORDER = ["D", "C", "B", "A", "S"];

export function WeaponShowcase({ jobId }: WeaponShowcaseProps) {
    const [weapons, setWeapons] = useState<ResolvedEquipment[]>([]);
    const [allWeapons, setAllWeapons] = useState<ResolvedEquipment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jobEntries, setJobEntries] = useState<EquipmentJobEntry[]>([]);
    const [jobColors, setJobColors] = useState<Record<string, string>>({});
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);

                const data = await loadAllEquipmentData();
                if (!data) throw new Error("无法加载装备数据");

                // 构建职业颜色映射
                const colors: Record<string, string> = {};
                if (data.colors) {
                    Object.entries(data.colors.jobs).forEach(([id, job]) => {
                        colors[id] = job.symbolColor;
                    });
                }
                setJobColors(colors);
                setJobEntries(data.jobs);

                // 过滤武器
                const list = data.weapons.filter((w) => !jobId || w.jobId === jobId);
                setAllWeapons(list);
                setWeapons(list);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [jobId]);

    void weapons;

    // 按职业分组并排序武器
    const groupedWeapons = useMemo(() => {
        // 先按搜索过滤
        let filtered = allWeapons;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (w) => w.name.toLowerCase().includes(q) || w.setName?.toLowerCase().includes(q) || w.jobName?.toLowerCase().includes(q)
            );
        }

        // 再按职业过滤
        filtered = selectedJob ? filtered.filter((w) => w.jobId === selectedJob) : filtered;

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
    }, [allWeapons, selectedJob, searchQuery]);

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
            <div className="relative mb-6">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                <input
                    type="text"
                    placeholder="搜索武器名称或套装..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>

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
