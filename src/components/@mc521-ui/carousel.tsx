"use client";

import { Children, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useMemo, useRef } from "react";

interface CarouselProps {
    children: ReactNode;
    interval?: number;
    className?: string;
    value: number;
    onChange: (index: number) => void;
}

export const Carousel = ({ children, className = "", value, onChange }: CarouselProps) => {
    const slides = useMemo(() => Children.toArray(children), [children]);

    const containerRef = useRef<HTMLDivElement>(null);
    const isScrolling = useRef(false);

    const [current, setCurrent] = [value, onChange];

    // 获取单个 slide 的偏移宽度（容器宽度）
    const getSlideOffset = useCallback(() => {
        return containerRef.current?.clientWidth ?? 0;
    }, []);

    // 滚动到指定索引（直接控制 scrollLeft）
    const scrollToIndex = useCallback(
        (index: number) => {
            const container = containerRef.current;
            if (!container) return;

            if (isScrolling.current) return;

            isScrolling.current = true;

            const slideWidth = getSlideOffset();
            // snap-mandatory + gap-4 的情况下，直接用容器宽度计算通常就很准
            const targetLeft = index * slideWidth;

            container.scrollTo({
                left: targetLeft,
                behavior: "smooth",
            });

            // smooth 动画一般 400~600ms 完成，可根据实际感觉调整
            setTimeout(() => {
                isScrolling.current = false;
            }, 600);
        },
        [getSlideOffset]
    );

    useEffect(() => {
        scrollToIndex(current);
    }, [current, scrollToIndex]);

    return (
        <div className={`relative mx-auto h-full w-full ${className}`}>
            {/* 轮播容器 */}
            <div ref={containerRef} className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth">
                {slides.map((slide, idx) => (
                    <div key={idx} className="h-full w-full shrink-0 snap-start">
                        {slide}
                    </div>
                ))}
            </div>
        </div>
    );
};
