"use client";

import { IconifyIcon } from "@/components/iconify-icon";

export interface GallerySearchPanelProps {
    total: number;
    filtered: number;
    unit?: string;
    label?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    value: string;
}

export function GallerySearchPanel({
    total,
    filtered,
    unit = "件",
    label = "名称搜索",
    placeholder = "输入关键词搜索…",
    onChange,
    value,
}: GallerySearchPanelProps) {
    return (
        <section className="gallery-filter-panel" aria-label="搜索">
            <div className="gallery-filter-toolbar">
                <div className="gallery-filter-toolbar-title">
                    <span className="gallery-filter-toolbar-icon" aria-hidden="true">
                        <IconifyIcon icon="lucide:search" width={18} height={18} />
                    </span>
                    <div>
                        <strong>{label}</strong>
                        <span>输入关键词即可筛选</span>
                    </div>
                </div>
                <div className="gallery-filter-toolbar-actions">
                    <div className="gallery-filter-summary" aria-live="polite">
                        <span className="gallery-filter-summary-dot" aria-hidden="true" />
                        正在显示 <strong>{filtered}</strong> / {total} {unit}
                    </div>
                </div>
            </div>
            <div className="gallery-filter-groups">
                <div className="gallery-filter-row">
                    <div className="gallery-filter-heading">
                        <span className="gallery-filter-heading-icon" aria-hidden="true">
                            <IconifyIcon icon="lucide:file-text" width={14} height={14} />
                        </span>
                        {label}
                    </div>
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            className="w-full rounded-lg border py-2.5 pr-4 pl-4 text-sm transition-all duration-300 outline-none"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
