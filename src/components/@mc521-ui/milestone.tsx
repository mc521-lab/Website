"use client";

import { useRef, useEffect, PointerEvent } from "react";
import { Fragment } from "react";

interface MilestoneItemProps {
    date: string; // e.g. "2026.01.01"
    title: string;
    description: string[];
    version: string; // e.g. "v26.1.0"
    className?: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export function Milestone({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        isDragging.current = true;
        startX.current = e.pageX - ref.current.offsetLeft;
        scrollLeft.current = ref.current.scrollLeft;
        e.preventDefault();
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        if (!isDragging.current || !ref.current) return;
        e.preventDefault();

        const x = e.pageX - ref.current.offsetLeft;
        const walk = (x - startX.current) * 1.5; // *1.5 是拖曳靈敏度，可調
        ref.current.scrollLeft = scrollLeft.current - walk;
    };

    const onPointerUpOrLeave = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        el.addEventListener("pointerdown", onPointerDown as unknown as EventListener);
        window.addEventListener("pointermove", onPointerMove as unknown as EventListener);
        window.addEventListener("pointerup", onPointerUpOrLeave);
        window.addEventListener("pointerleave", onPointerUpOrLeave); // 滑出視窗也要停止

        return () => {
            el.removeEventListener("pointerdown", onPointerDown as unknown as EventListener);
            window.removeEventListener("pointermove", onPointerMove as unknown as EventListener);
            window.removeEventListener("pointerup", onPointerUpOrLeave);
            window.removeEventListener("pointerleave", onPointerUpOrLeave);
        };
    }, []);

    return (
        <section className="relative w-full">
            <div className="bg-foreground/10 absolute top-1/2 h-1 w-full -translate-y-1/2"></div>
            <div className="absolute bottom-0 h-1 w-full -translate-y-9 text-center text-sm opacity-50">&lt; 可左右拖动查看 &gt;</div>
            <div
                ref={ref}
                className="scrollbar-none mt-12 flex h-full w-full cursor-grab touch-pan-x snap-x snap-mandatory items-center gap-4 overflow-x-auto mask-[linear-gradient(to_right,transparent_0%,black_25%,black_75%,transparent_100%)] px-[50vw] pb-16 active:cursor-grabbing md:gap-64"
                style={{
                    scrollBehavior: "smooth",
                    overscrollBehaviorX: "contain",
                    pointerEvents: "auto",
                }}>
                {children}
            </div>
        </section>
    );
}

export function MilestoneItem({ date, title, description, version, Icon, className = "" }: MilestoneItemProps) {
    return (
        <div
            className={`group border-primary bg-muted relative z-20 shrink-0 snap-center overflow-hidden border-2 transition-all duration-500 ${className} h-[36vh] w-[75vw] max-w-180`}>
            {/* 左上角图标 */}
            <div className="absolute top-4 left-4 z-20 md:top-6 md:left-6">
                <div className="border-primary/50 bg-background/20 text-primary flex h-10 w-10 scale-110 items-center justify-center border-2 transition-colors duration-300 md:h-12 md:w-12">
                    <Icon className="size-5.5"></Icon>
                </div>
            </div>

            {/* 主要内容 */}
            <div className="relative z-10 flex h-full flex-col p-5 pt-20 md:p-6 md:pt-24">
                <div className="mb-2">
                    <span className="text-primary font-mono text-xs font-bold tracking-wider transition-colors md:text-sm">{date}</span>
                </div>

                <h3 className="text-foreground mb-3 text-xl font-bold transition-all duration-300 md:mb-4 md:text-2xl">{title}</h3>

                <div className="flex-1 overflow-hidden">
                    <div className="bg-primary/50 mb-3 h-1 w-10 rounded-full" />
                    <p className="text-foreground/60 line-clamp-4 text-xs leading-relaxed md:line-clamp-3 md:text-sm">
                        {description.map((item, index) => (
                            <Fragment key={index}>
                                {item}
                                {index < description.length - 1 && <br />}
                            </Fragment>
                        ))}
                    </p>
                </div>

                {/* 版本标签 */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 md:bottom-6 md:left-6">
                    <span className="border-foreground/20 bg-background/10 text-foreground/50 rounded border px-2 py-1 font-mono text-[10px] uppercase">
                        V{version}
                    </span>
                </div>
            </div>

            {/* 右下角大 Icon 装饰 */}
            <div className="pointer-events-none absolute -right-8 -bottom-10 z-0 opacity-5">
                <Icon className="size-40 md:size-40"></Icon>
            </div>
        </div>
    );
}
