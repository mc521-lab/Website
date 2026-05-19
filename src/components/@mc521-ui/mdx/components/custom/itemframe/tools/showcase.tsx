"use client";

import { useState, useEffect, useMemo } from "react";
import { ResolvedTool, ToolCategory } from "./types";
import { loadToolsIndex, resolveTools } from "./utils";
import { ToolCard } from "./card";
import { Loader2, Wrench, Search } from "lucide-react";

export function ToolsShowcase() {
    const [tools, setTools] = useState<ResolvedTool[]>([]);
    const [categories, setCategories] = useState<ToolCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                const index = await loadToolsIndex();
                if (!index) {
                    throw new Error("无法加载工具数据");
                }
                setCategories(index.categories);
                const resolved = resolveTools(index);
                setTools(resolved);
            } catch (err) {
                setError(err instanceof Error ? err.message : "加载失败");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // 按类别和搜索过滤
    const filteredTools = useMemo(() => {
        let list = tools;
        if (selectedCategory) {
            list = list.filter((t) => t.category === selectedCategory);
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (t) => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.categoryName?.toLowerCase().includes(q)
            );
        }
        return list;
    }, [tools, selectedCategory, searchQuery]);

    // 按类别分组
    const groupedTools = useMemo(() => {
        const groups = new Map<string, ResolvedTool[]>();

        for (const tool of filteredTools) {
            const catId = tool.category;
            if (!groups.has(catId)) {
                groups.set(catId, []);
            }
            groups.get(catId)!.push(tool);
        }

        return groups;
    }, [filteredTools]);

    // 获取类别信息
    const getCategoryInfo = (catId: string): ToolCategory | undefined => {
        return categories.find((c) => c.id === catId);
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
                    placeholder="搜索工具名称..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 py-2 pr-4 pl-9 text-sm text-neutral-200 placeholder-neutral-600 outline-none focus:border-neutral-600"
                />
            </div>

            {/* 类别过滤器 */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
                <Wrench className="h-4 w-4 text-neutral-500" />
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                        selectedCategory === null
                            ? "bg-primary text-primary-foreground"
                            : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                    }`}>
                    全部工具
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                            selectedCategory === cat.id
                                ? "border border-amber-500/40 bg-amber-500/20 text-amber-400"
                                : "border border-neutral-700 bg-neutral-800/60 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200"
                        }`}>
                        <span className="mr-1">{cat.icon}</span>
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* 按类别分组展示 */}
            <div className="space-y-8">
                {Array.from(groupedTools.entries()).map(([catId, catTools]) => {
                    const catInfo = getCategoryInfo(catId);
                    return (
                        <div key={catId} className="space-y-3">
                            {/* 类别标题 */}
                            <div className="flex items-center gap-3">
                                <div className="h-5 w-1 rounded-full bg-amber-500/60" />
                                <h3 className="text-base font-bold text-neutral-100">
                                    <span className="mr-1">{catInfo?.icon}</span>
                                    {catInfo?.name}
                                </h3>
                                <span className="text-xs text-neutral-500">({catTools.length})</span>
                            </div>

                            {/* 工具网格 */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {catTools.map((tool) => (
                                    <ToolCard key={tool.id} tool={tool} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {groupedTools.size === 0 && (
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-8 text-center text-neutral-500">暂无工具数据</div>
            )}
        </div>
    );
}
