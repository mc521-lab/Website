"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { GuiButtonConfig, GuiConfig } from "@/types/iagui";

const DEBUG_MODE = false;

interface InteractiveGuiProps {
    ui: GuiConfig[];
    className?: string;
    onGuiUpdate?: (arg0: GuiConfig) => void;
    initialPageId: string | null;
}

export function InteractiveGui({ ui, className, onGuiUpdate, initialPageId }: InteractiveGuiProps) {
    const router = useRouter();
    const sectionRef = useRef<HTMLElement>(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [currentGuiId, setCurrentGuiId] = useState(initialPageId ?? ui[0]?.id);
    const currentGui = ui.find((gui) => gui.id === currentGuiId);

    useEffect(() => {
        const element = sectionRef.current;
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width * (1 - 0.796));
            setHeight(entry.contentRect.height * (1 - 0.585) + 48);
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // 如果外部传入的 ui 发生变化，
        // 且当前 GUI 已经不存在，则回到第一个 GUI
        if (!currentGui && ui.length > 0) {
            setCurrentGuiId(ui[0].id);
        }
    }, [currentGui, ui]);

    const handleClick = (button: GuiButtonConfig, index: number) => {
        const event = button.onClick;
        if (!event) return;
        switch (event.action) {
            case "navigate": {
                const target = ui.find((gui) => gui.id === event.to);
                if (!target) {
                    toast.warning(`[InteractiveGui] GUI "${event.to}" does not exist.`);
                    return;
                }
                setCurrentGuiId(target.id);
                onGuiUpdate?.(target);
                break;
            }
            case "redirect":
                router.push(event.href);
                break;
            case "custom":
                event.fn(index);
                break;
        }
    };

    if (!currentGui) {
        return null;
    }

    return (
        <section
            ref={sectionRef}
            className={cn("relative mt-3 origin-top-left scale-113 overflow-hidden", className)}
            style={{ marginBottom: `-${height * 1.13}px`, marginRight: `-${width * 1.13}px` }}>
            <img
                src="/wiki/menu/generic_54.png"
                className="raw-image pixelated absolute top-0 left-0 aspect-square w-full translate-x-[-0.5%] translate-y-[3%]"
            />
            <section className="relative" style={currentGui.overlapStyle}>
                <img
                    src={currentGui.image ? currentGui.image : `/wiki/menu/${currentGui.id}.webp`}
                    className="raw-image pixelated aspect-square w-full translate-x-[-11.2%] translate-y-[-3.58%]"
                    style={{ clipPath: "polygon(11.2% 3.58%, 79.6% 3.58%, 79.6% 58.5%, 11.2% 58.5%)" }}
                />
                <div className="absolute top-[10%] left-[2.8%] grid aspect-9/6 w-[63%] grid-cols-9 grid-rows-6">
                    {Array.from({ length: 9 * 6 }).map((_, i) => {
                        const button = currentGui.buttons[i];
                        return (
                            <button
                                key={i}
                                type="button"
                                disabled={!button}
                                onClick={() => {
                                    if (button) {
                                        handleClick(button, i);
                                    }
                                }}
                                className={cn(
                                    "flex items-center justify-center h-full w-full",
                                    button?.onClick && "cursor-pointer",
                                    DEBUG_MODE && (i % 2 === 0 ? "bg-red-400/50" : "bg-lime-400/50"),
                                    DEBUG_MODE && "font-bold text-blue-900"
                                )}>
                                {button?.content ?? (DEBUG_MODE && i)}
                            </button>
                        );
                    })}
                </div>
            </section>
        </section>
    );
}
