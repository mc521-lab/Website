import { Mc521, Radix } from "@/components";
import { PhotoItem } from "@/types/api";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function Photos() {
    const [photos, setChangelog] = useState<PhotoItem[]>([]);
    const [current, setCurrent] = useState<PhotoItem>();

    useEffect(() => {
        fetch("/api/data/photos")
            .then((res) => res.json())
            .then((data: PhotoItem[]) => {
                setChangelog(data.slice(0, 12));
            });
    }, []);

    const $router = useRouter();

    return (
        <Mc521.Section id="photos">
            <div className="mb-6 flex w-full max-w-4/5 lg:max-w-3/5 flex-col items-center justify-center mask-[linear-gradient(to_bottom,black_75%,transparent_98%)]">
                <Mc521.SectionTitle title="光影时刻" description="记录社区内的每一个精彩瞬间" />
                {/* <span className="mt-12 text-center opacity-50">暂无数据</span> */}
                {photos.length > 0 && (
                    <Radix.Dialog>
                        <Radix.DialogTrigger asChild>
                            <section className="pointer-events-none mt-12 grid h-140 w-full lg:grid-cols-4 gap-x-4">
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
                        <Radix.DialogContent showCloseButton={false} className="w-9/10 lg:w-1/2">
                            <Mc521.ImageShow {...current!} />
                        </Radix.DialogContent>
                    </Radix.Dialog>
                )}
            </div>
            <Mc521.HomeButton text="查看更多" theme="primary" className="absolute! bottom-24" onClick={() => $router.push("/photos")}>
                <SquareArrowOutUpRightIcon />
            </Mc521.HomeButton>
        </Mc521.Section>
    );
}
