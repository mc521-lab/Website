"use client";

import React, { useEffect, useState } from "react";
import { IconifyIcon } from "@/components/iconify-icon";

const ICONS = ["fluent-emoji-flat:star", "emojione-v1:maple-leaf"] as const;

interface FallingItem {
    id: number;
    icon: (typeof ICONS)[number];
    left: number;
    size: number;
    duration: number;
    delay: number;
    rotate: number;
    sway: number;
}

function createItem(id: number): FallingItem {
    return {
        id,
        icon: ICONS[Math.floor(Math.random() * ICONS.length)],
        left: Math.random() * 100,
        size: 20 + Math.random() * 28,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 2,
        rotate: Math.random() * 360,
        sway: 20 + Math.random() * 40,
    };
}

export const DroppingBackground: React.FC = () => {
    const [items, setItems] = useState<FallingItem[]>(() => {
        let id = 0;
        return Array.from({ length: 12 }, () => createItem(id++));
    });

    useEffect(() => {
        const maxItems = 32;

        const interval = setInterval(() => {
            setItems((prev) => {
                const trimmed = prev.length > maxItems ? prev.slice(prev.length - maxItems) : prev;
                const nextId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 0;
                return [...trimmed, createItem(nextId)];
            });
        }, 900);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            <style>{`
                @keyframes fall {
                    0% {
                        transform: translateY(-120%) translateX(0) rotate(var(--rotate));
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.85;
                    }
                    25% {
                        transform: translateY(25vh) translateX(calc(var(--sway) * -1)) rotate(calc(var(--rotate) + 45deg));
                    }
                    50% {
                        transform: translateY(50vh) translateX(var(--sway)) rotate(calc(var(--rotate) + 90deg));
                    }
                    75% {
                        transform: translateY(75vh) translateX(calc(var(--sway) * -0.5)) rotate(calc(var(--rotate) + 135deg));
                    }
                    90% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(120vh) translateX(0) rotate(calc(var(--rotate) + 180deg));
                        opacity: 0;
                    }
                }
            `}</style>
            {items.map((item) => (
                <div
                    key={item.id}
                    className="absolute top-0 will-change-transform"
                    style={{
                        left: `${item.left}%`,
                        animation: `fall ${item.duration}s linear ${item.delay}s forwards`,
                        ["--rotate" as string]: `${item.rotate}deg`,
                        ["--sway" as string]: `${item.sway}px`,
                    }}>
                    <IconifyIcon icon={item.icon} width={item.size} height={item.size} className="opacity-80" />
                </div>
            ))}
        </div>
    );
};

export default DroppingBackground;
