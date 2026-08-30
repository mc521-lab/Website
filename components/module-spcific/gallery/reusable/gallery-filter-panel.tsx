"use client";

import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

export interface GalleryFilterOption {
    value: string;
    label: string;
}

export interface GalleryFilterGroup {
    key: string;
    label: string;
    icon: string;
    value: string;
    onChange: (value: string) => void;
    options: GalleryFilterOption[];
}

export interface GalleryFilterPanelProps {
    total: number;
    filtered: number;
    unit?: string;
    groups: GalleryFilterGroup[];
    search?: {
        value: string;
        onChange: (value: string) => void;
        placeholder?: string;
        label?: string;
    };
}

export function GalleryFilterPanel({ total, filtered, unit = "件", groups, search }: GalleryFilterPanelProps) {
    const allSelected = filtered === total;

    const handleReset = () => {
        if (search && search.value) {
            search.onChange("");
        }
        groups.forEach((g) => {
            if (g.value !== "all") {
                g.onChange("all");
            }
        });
    };

    return (
        <section className="gallery-filter-panel" aria-label="筛选器">
            <div className="gallery-filter-toolbar">
                <div className="gallery-filter-toolbar-title">
                    <span className="gallery-filter-toolbar-icon" aria-hidden="true">
                        <IconifyIcon icon="lucide:sliders-horizontal" width={18} height={18} />
                    </span>
                    <div>
                        <strong>快速筛选</strong>
                        <span>{search ? "输入关键词或点击分类筛选" : "点击分类即可更新下方图鉴"}</span>
                    </div>
                </div>
                <div className="gallery-filter-toolbar-actions">
                    <div className="gallery-filter-summary" aria-live="polite">
                        <span className="gallery-filter-summary-dot" aria-hidden="true" />
                        正在显示 <strong>{filtered}</strong> / {total} {unit}
                    </div>
                    {!allSelected && (
                        <button type="button" className="gallery-filter-reset" onClick={handleReset}>
                            重置筛选
                        </button>
                    )}
                </div>
            </div>
            <div className="gallery-filter-groups">
                {search && (
                    <div className="gallery-filter-row">
                        <div className="gallery-filter-heading">
                            <span className="gallery-filter-heading-icon" aria-hidden="true">
                                <IconifyIcon icon="lucide:search" width={14} height={14} />
                            </span>
                            {search.label ?? "名称搜索"}
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={search.value}
                                onChange={(e) => search.onChange(e.target.value)}
                                placeholder={search.placeholder ?? "输入关键词搜索…"}
                                className="w-full rounded-lg border py-2.5 pr-4 pl-4 text-sm transition-all duration-300 outline-none"
                            />
                        </div>
                    </div>
                )}
                {groups.map((group) => (
                    <div key={group.key} className="gallery-filter-row">
                        <div className="gallery-filter-heading">
                            <span className="gallery-filter-heading-icon" aria-hidden="true">
                                <IconifyIcon icon={group.icon} width={14} height={14} />
                            </span>
                            {group.label}
                        </div>
                        <div className="gallery-filter-options" role="radiogroup" aria-label={group.label}>
                            {group.options.map((option) => {
                                const isActive = group.value === option.value;
                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="radio"
                                        aria-checked={isActive}
                                        onClick={() => group.onChange(option.value)}
                                        className={cn("gallery-filter-chip", isActive && "is-active")}>
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
