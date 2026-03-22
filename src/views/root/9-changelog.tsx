import { Mc521 } from "@/components";
import { ChangelogItem } from "@/types/api";
import { ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const daysSince = (d: string) => Math.floor((new Date().getTime() - new Date(d).getTime()) / 86400000);

export function Changelog() {
    const runningDays = daysSince("2026-02-26");

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
                setChangelog(data.slice(0, 4));
            });
    }, []);

    const $router = useRouter();

    return (
        <Mc521.Section id="changelog" zebra>
            <div className="flex w-full max-w-3/5 flex-col items-center justify-center">
                <Mc521.SectionTitle title="更新日志" description={`累计 ${changelog.length} 条更新 · 过去 ${runningDays} 天持续更新`} />
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
                        <button
                            className="group border-foreground/20 bg-muted text-foreground hover:bg-foreground hover:text-background mx-auto flex cursor-pointer items-center justify-center gap-2 border px-6 py-3 transition-all duration-300"
                            onClick={() => $router.push("/changelog")}>
                            <span className="text-sm font-bold">查看完整历史记录</span>
                            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </section>
            </div>
        </Mc521.Section>
    );
}
