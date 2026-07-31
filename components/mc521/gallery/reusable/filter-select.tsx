"use client";

import { IconifyIcon } from "@/components/iconify-icon";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
    value: T;
    label: string;
}

export interface FilterSelectProps<T extends string> {
    label: string;
    icon: string;
    value: T | "all";
    options: FilterOption<T>[];
    onChange: (value: T | "all") => void;
    placeholder?: string;
}

export function FilterSelect<T extends string>({
    label,
    icon,
    value,
    options,
    onChange,
    placeholder = "全部",
}: FilterSelectProps<T>) {
    const allOptions: FilterOption<T | "all">[] = [{ value: "all", label: placeholder }, ...options];

    return (
        <div
            className="border-border/60 bg-card/50 flex items-center gap-4 rounded-xl border px-3 py-2.5 backdrop-blur-sm"
            role="group"
            aria-label={label}>
            <div className="flex shrink-0 items-center gap-2.5">
                <div className="border-border/80 bg-muted/60 flex h-8 w-8 items-center justify-center rounded-lg border">
                    <IconifyIcon icon={icon} className="text-muted-foreground" width={16} height={16} />
                </div>
                <span className="text-foreground text-sm font-medium">{label}</span>
            </div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
                {allOptions.map((o) => {
                    const selected = value === o.value;
                    return (
                        <button
                            key={o.value}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => onChange(o.value as T | "all")}
                            className={cn(
                                "focus-visible:ring-ring inline-flex h-9 items-center justify-center rounded-lg border px-4 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2",
                                selected
                                    ? "border-primary/80 bg-primary/10 text-primary"
                                    : "border-border bg-background/80 text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                            {o.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

