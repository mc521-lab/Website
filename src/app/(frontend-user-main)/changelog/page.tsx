"use client";

import { Mc521 } from "@/components";
import { useEffect, useState } from "react";

type ChangelogItem = {
    version: [number, number, number];
    date: string;
    major: boolean;
    content: string[];
};

export default function ChangeLog() {
    const [changelog, setChangelog] = useState<ChangelogItem[]>([]);

    useEffect(() => {
        fetch("/api/data/changelog")
            .then((res) => res.json())
            .then((data: ChangelogItem[]) => {
                data.sort((a: ChangelogItem, b: ChangelogItem) => {
                    const [a1, a2, a3] = a.version;
                    const [b1, b2, b3] = b.version;
                    if (a1 !== b1) return b1 - a1;
                    if (a2 !== b2) return b2 - a2;
                    return b3 - a3;
                });
                setChangelog(data);
            });
    }, []);

    return (
        <Mc521.Section id="changelog" className="min-h-screen">
            <div className="flex w-full max-w-4/5 lg:max-w-3/5 flex-col items-center justify-center py-12">
                <Mc521.SectionTitle title="完整更新日志" description="按时间顺序查看所有版本变更" />
                <section className="relative mt-12 w-full">
                    <div className="absolute top-0 bottom-0 left-4 w-px transform bg-neutral-800 md:left-1/2 md:-translate-x-1/2"></div>
                    <div className="space-y-12">
                        {changelog.map((item, idx) => (
                            <Mc521.TimelineItem
                                key={item.version.join(".")}
                                dir={["left", "right"][idx % 2] as "left" | "right"}
                                version={item.version.join(".")}
                                date={item.date}
                                major={item.major}
                                content={item.content}
                            />
                        ))}
                    </div>
                    <div className="relative z-10 mt-16 text-center">
                        <span className="group border-foreground/20 bg-muted text-foregroundmx-auto mx-auto flex w-fit items-center justify-center gap-2 border px-6 py-3">
                            <span className="text-sm font-bold">已到最底部</span>
                        </span>
                    </div>
                </section>
            </div>
        </Mc521.Section>
    );
}
