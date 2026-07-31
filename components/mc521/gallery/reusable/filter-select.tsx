"use client";

import { Field, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
    return (
        <div className="flex flex-col gap-1">
            <Field>
                <FieldLabel className="text-muted-foreground -mb-2 text-xs">{label}</FieldLabel>
                <Select value={value} onValueChange={(v) => onChange(v as T | "all")}>
                    <SelectTrigger className="bg-background! w-36!">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="all">{placeholder}</SelectItem>
                        {options.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </Field>
        </div>
    );
}
