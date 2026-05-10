"use client";

import { Mc521 } from "@/components";
import { transformTo } from "@/lib/utils";

import { Gamepad2Icon, ChevronDownIcon, BookOpenIcon, ToolboxIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, lazy } from "react";

// 懒加载视频组件
const VideoBackground = lazy(() => import("./video-background"));

export function Home() {
    const $router = useRouter();

    return (
        <section className="relative h-screen" id="home">
            <div className="absolute top-0 left-0 z-3 flex h-full w-full flex-col items-center justify-center">
                <h1 className="text-foreground mb-6 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                    <span className="text-primary">MC</span>521
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-3xl leading-relaxed text-neutral-300 md:text-4xl">二十余年，同在一片方块天</p>
                <Mc521.HomeButton text="开始游戏" onClick={() => transformTo("#join")}>
                    <Gamepad2Icon />
                </Mc521.HomeButton>
                <div className="mt-4 flex scale-80 gap-4 pl-1">
                    <Mc521.HomeButton theme="light" text="查看百科" className="flex w-50 justify-center" onClick={() => $router.push("/wiki")}>
                        <BookOpenIcon />
                    </Mc521.HomeButton>
                    <Mc521.HomeButton
                        theme="light"
                        text="打开工具箱"
                        className="flex w-50 justify-center"
                        onClick={() => $router.push("/toolbox")}>
                        <ToolboxIcon />
                    </Mc521.HomeButton>
                </div>
            </div>
            <ChevronDownIcon className="animate-float-y absolute bottom-16 left-1/2 z-3 size-10 -translate-x-1/2 opacity-50" />
            <div className="from-background/75 via-background/50 to-background absolute z-2 h-full w-full bg-linear-to-b via-50% backdrop-blur-xs"></div>

            {/* 视频背景使用 Suspense 和懒加载 */}
            <Suspense fallback={<div className="absolute top-0 left-0 h-full w-full bg-gradient-to-b from-neutral-900 to-neutral-800" />}>
                <VideoBackground />
            </Suspense>
        </section>
    );
}
