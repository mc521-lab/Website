"use client";

import { Mc521, Radix } from "@/components";
import { PhotoItem } from "@/types/api";
import { useEffect, useState } from "react";

export default function ChangeLog() {
    const [photos, setChangelog] = useState<PhotoItem[]>([]);
    const [current, setCurrent] = useState<PhotoItem>();

    useEffect(() => {
        fetch("/api/data/photos")
            .then((res) => res.json())
            .then((data: PhotoItem[]) => {
                setChangelog(data.slice(0, 12));
            });
    }, []);

    return (
        <Mc521.Section id="photos" className="min-h-screen">
            <div className="flex w-full max-w-4/5 flex-col items-center justify-center py-12 lg:max-w-3/5">
                <Mc521.SectionTitle title="光影时刻" description="查看一路上走来的点点滴滴" />
                {photos.length > 0 && (
                    <Radix.Dialog>
                        <Radix.DialogTrigger asChild>
                            <section className="pointer-events-none mt-12 grid w-full gap-x-4 lg:grid-cols-4">
                                {photos.map((item, index) => (
                                    <Mc521.ImageShowEntry
                                        key={index}
                                        {...item}
                                        className={index > 8 - 1 ? "pointer-events-none" : ""}
                                        onClick={() => setCurrent(item)}
                                    />
                                ))}
                            </section>
                        </Radix.DialogTrigger>
                        <Radix.DialogContent showCloseButton={false} className="w-[90vw]">
                            <Mc521.ImageShow {...current!} />
                        </Radix.DialogContent>
                    </Radix.Dialog>
                )}
                <span className="group border-foreground/20 bg-muted text-foregroundmx-auto mx-auto flex w-fit items-center justify-center gap-2 border px-6 py-3">
                    <span className="text-sm font-bold">已到最底部</span>
                </span>
            </div>
        </Mc521.Section>
    );
}
