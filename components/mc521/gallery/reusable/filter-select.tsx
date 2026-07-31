"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";

export interface FilterOption<T extends string> {
    value: T;
    label: string;
}

export interface FilterSelectProps<T extends string> {
    label: string;
    value: T | "all";
    options: FilterOption<T>[];
    onChange: (value: T | "all") => void;
    placeholder?: string;
}

export function FilterSelect<T extends string>({
    label,
    value,
    options,
    onChange,
    placeholder = "全部",
}: FilterSelectProps<T>) {
    const allOptions: FilterOption<T | "all">[] = [{ value: "all", label: placeholder }, ...options];

    return (
        <div className="flex flex-col gap-1">
            <Field>
                <FieldLabel className="text-muted-foreground -mb-2 text-xs">{label}</FieldLabel>
                <div className="flex flex-wrap gap-1" role="radiogroup" aria-label={label}>
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
                                    "focus-visible:ring-ring inline-flex h-8 items-center justify-center rounded-md border px-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2",
                                    selected
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                                )}>
                                {o.label}
                            </button>
                        );
                    })}
                </div>
            </Field>
        </div>
    );
}

