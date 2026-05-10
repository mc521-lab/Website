"use client";

import { Mc521, Radix } from "@/components";
import { PhotoItem } from "@/types/api";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export function Photos() {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [current, setCurrent] = useState<PhotoItem | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const $router = useRouter();

    const fetchPhotos = useCallback(async () => {
        try {
            const res = await fetch("/api/data/photos", {
                next: { revalidate: 3600 },
            });
            const data: PhotoItem[] = await res.json();
            setPhotos(data.slice(0, 12));
        } catch (error) {
            console.error("Failed to fetch photos:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPhotos();
    }, [fetchPhotos]);

    return (
        <Mc521.Section id="photos">
            <div className="mb-6 flex w-full max-w-4/5 flex-col items-center justify-center mask-[linear-gradient(to_bottom,black_75%,transparent_98%)] lg:max-w-3/5">
                <Mc521.SectionTitle title="光影时刻" description="记录社区内的每一个精彩瞬间" />

                {isLoading ? (
                    <div className="mt-12 flex h-140 w-full items-center justify-center">
                        <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
                    </div>
                ) : photos.length > 0 ? (
                    <Radix.Dialog>
                        <Radix.DialogTrigger asChild>
                            <section className="pointer-events-none mt-12 grid h-140 w-full gap-x-4 lg:grid-cols-4">
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
                        {current && (
                            <Radix.DialogContent showCloseButton={false} className="w-9/10 lg:w-1/2">
                                <Mc521.ImageShow {...current} />
                            </Radix.DialogContent>
                        )}
                    </Radix.Dialog>
                ) : (
                    <span className="mt-12 text-center opacity-50">暂无数据</span>
                )}
            </div>
            <Mc521.HomeButton text="查看更多" theme="primary" className="absolute! bottom-24" onClick={() => $router.push("/photos")}>
                <SquareArrowOutUpRightIcon />
            </Mc521.HomeButton>
        </Mc521.Section>
    );
}
