"use client";

import { Mc521 } from "@/components";
import router from "next/router";

const svg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <g fill="#eab308" fill-opacity="0.1">
            <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
        </g>
    </g>
</svg>`;
const encodedSvg = encodeURIComponent(svg);

const entries = [
    {
        text: "⭐ 纯新手必看教程",
        onClick: () => router.push("/wiki/2-beginner/1-common-commands"),
        extraClassName: "-ml-1.5",
    },
];

export default function WikiHome() {
    return (
        <main
            className="pixel-font flex h-[calc(100vh-104px)] w-full flex-col items-center justify-center"
            style={{
                backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
                backgroundPosition: "8px 8px",
            }}>
            <h1 className="text-foreground mb-6 translate-x-1 -translate-y-2 text-6xl font-bold drop-shadow-[6px_6px_0_#000] md:text-8xl">
                <span className="text-primary">MC521</span> Wiki
            </h1>
            <p className="mx-auto mb-10 max-w-2xl -translate-y-2 text-3xl leading-relaxed text-neutral-300 md:text-4xl">无所不知 无所不晓</p>
            <div className="flex -translate-y-2 gap-4">
                {entries.map((entry) => (
                    <Mc521.HomeButton key={entry.text} {...entry} />
                ))}
            </div>
        </main>
    );
}
