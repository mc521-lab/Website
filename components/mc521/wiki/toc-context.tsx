"use client";

import * as React from "react";

export interface TocItem {
    id: string;
    text: string;
    level: 1 | 2 | 3;
}

interface TocContextValue {
    items: TocItem[];
    register: (item: TocItem) => TocItem;
    unregister: (id: string) => void;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

const TocContext = React.createContext<TocContextValue | null>(null);

export function TocProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = React.useState<TocItem[]>([]);
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const [collapsed, setCollapsed] = React.useState(false);
    const idCountsRef = React.useRef<Map<string, number>>(new Map());

    const register = React.useCallback((item: TocItem): TocItem => {
        let uniqueId = item.id;
        const count = idCountsRef.current.get(item.id) ?? 0;
        if (count > 0) {
            uniqueId = `${item.id}-${count}`;
        }
        idCountsRef.current.set(item.id, count + 1);

        const finalItem = { ...item, id: uniqueId };

        setItems((prev) => {
            if (prev.some((i) => i.id === uniqueId)) return prev;
            return [...prev, finalItem];
        });

        return finalItem;
    }, []);

    const unregister = React.useCallback((id: string) => {
        setItems((prev) => prev.filter((i) => i.id !== id));
    }, []);

    return (
        <TocContext.Provider value={{ items, register, unregister, activeId, setActiveId, collapsed, setCollapsed }}>
            {children}
        </TocContext.Provider>
    );
}

export function useToc() {
    const ctx = React.useContext(TocContext);
    if (!ctx) throw new Error("useToc must be used within TocProvider");
    return ctx;
}

function findScrollableParent(el: HTMLElement): HTMLElement {
    let node: HTMLElement | null = el.parentElement;
    while (node) {
        const style = window.getComputedStyle(node);
        const overflowY = style.overflowY;
        if (overflowY === "auto" || overflowY === "scroll") {
            return node;
        }
        node = node.parentElement;
    }
    return document.documentElement;
}

export function useTocActiveSpy(ref: React.RefObject<HTMLElement | null>) {
    const { items, setActiveId } = useToc();

    React.useEffect(() => {
        const rootEl = ref.current;
        if (!rootEl || items.length === 0) return;

        const scrollParent = findScrollableParent(rootEl);
        const headingEls = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => el !== null);

        if (headingEls.length === 0) return;

        const updateActive = () => {
            const scrollTop = scrollParent.scrollTop;
            const viewportTop = scrollTop + 80;

            let bestId: string | null = null;
            let bestTop = -Infinity;

            for (const el of headingEls) {
                const rect = el.getBoundingClientRect();
                const parentRect = scrollParent.getBoundingClientRect();
                const elTop = rect.top - parentRect.top + scrollParent.scrollTop;

                if (elTop <= viewportTop) {
                    if (elTop > bestTop) {
                        bestTop = elTop;
                        bestId = el.id;
                    }
                }
            }

            if (bestId) {
                setActiveId(bestId);
                return;
            }

            if (headingEls.length > 0) {
                setActiveId(headingEls[0].id);
            }
        };

        updateActive();
        scrollParent.addEventListener("scroll", updateActive, { passive: true });
        window.addEventListener("resize", updateActive);
        return () => {
            scrollParent.removeEventListener("scroll", updateActive);
            window.removeEventListener("resize", updateActive);
        };
    }, [items, setActiveId, ref]);
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
}
