"use client";

import { GemData } from "./types";
import { GemCard } from "./card";

interface GemGridProps {
    gems: GemData[];
    title?: string;
}

export function GemGrid({ gems, title }: GemGridProps) {
    return (
        <div className="my-6">
            {title && (
                <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-neutral-100">
                    <span className="bg-primary h-6 w-1 rounded-full" />
                    {title}
                </h2>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {gems.map((gem) => (
                    <GemCard key={gem.id} gem={gem} />
                ))}
            </div>
        </div>
    );
}
