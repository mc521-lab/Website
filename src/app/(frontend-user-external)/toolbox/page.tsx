"use client";

import { Mc521 } from "@/components";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";

const svg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <g fill="#eab308" fill-opacity="0.1">
            <path d="M35.4 32l2.8-2.8-1.4-1.4-2.8 2.8-2.8-2.8-1.4 1.4 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.8 2.8 1.4-1.4-2.8-2.8zm0-30L38.2-.8 36.8-2.2 34 0.6 31.2-2.2 29.8-.8 32.6 2 29.8 4.8 31.2 6.2 34 3.4 36.8 6.2 38.2 4.8 35.4 2zm-30 30l2.8-2.8-1.4-1.4-2.8 2.8-2.8-2.8-1.4 1.4 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.8 2.8 1.4-1.4-2.8-2.8zM5.4 2L8.2-.8 6.8-2.2 4 0.6 1.2-2.2-.2-.8 2.6 2-.2 4.8 1.2 6.2 4 3.4 6.8 6.2 8.2 4.8 5.4 2z"/>
        </g>
    </g>
</svg>`;
const encodedSvg = encodeURIComponent(svg);

const entries = [
    {
        text: "正版验证工具",
        url: "/toolbox/genuine-title",
    },
    {
        text: "工单系统",
        url: "/toolbox/jira",
    },
];

export default function ToolboxHome() {
    const router = useRouter();

    return (
        <main
            className="pixel-font flex h-[calc(100vh-61px)] w-full translate-y-15.25 flex-col items-center justify-center"
            style={{
                backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
                backgroundPosition: "8px 8px",
            }}>
            <h1 className="text-foreground mb-6 translate-x-1 -translate-y-2 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                <span className="text-primary">MC521</span> Toolbox
            </h1>
            <p className="mx-auto mb-10 max-w-2xl -translate-y-2 text-3xl leading-relaxed text-neutral-300 md:text-4xl">玩服必备工具箱</p>
            <div className="flex -translate-y-2 gap-4">
                {entries.map((entry) => (
                    <Mc521.HomeButton key={entry.text} {...entry} onClick={() => router.push(entry.url)} />
                ))}
            </div>
        </main>
    );
}
