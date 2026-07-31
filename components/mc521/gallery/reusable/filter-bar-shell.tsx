"use client";

import type { ReactNode } from "react";
import { IconifyIcon } from "@/components/iconify-icon";
import { Separator } from "@/components/ui/separator";

export interface FilterBarShellProps {
    title?: string;
    description?: string;
    icon?: string;
    extra?: ReactNode;
    children: ReactNode;
}

export function FilterBarShell({
    title = "快速筛选",
    description = "点击分类即可更新下方图鉴",
    icon = "lucide:sliders-horizontal",
    extra,
    children,
}: FilterBarShellProps) {
    return (
        <div className="border-border/60 bg-card/30 rounded-xl border p-4 backdrop-blur-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="border-border/80 bg-muted/60 flex h-9 w-9 items-center justify-center rounded-lg border">
                        <IconifyIcon icon={icon} className="text-muted-foreground" width={18} height={18} />
                    </div>
                    <div>
                        <h3 className="text-foreground text-base font-semibold">{title}</h3>
                        <p className="text-muted-foreground text-xs">{description}</p>
                    </div>
                </div>
                {extra && <div className="text-muted-foreground text-sm whitespace-nowrap">{extra}</div>}
            </div>
            <Separator />
            <div className="flex flex-col gap-3 mt-4">{children}</div>
        </div>
    );
}
