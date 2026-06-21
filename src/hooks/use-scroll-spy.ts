import { useEffect, useState } from "react";

// 监听滚动，返回当前处于视口中的 section id
export function useScrollSpy(ids: string[], offset = 100) {
    const [activeId, setActiveId] = useState("");

    useEffect(() => {
        const onScroll = () => {
            let current = "";
            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;
                const rect = el.getBoundingClientRect();
                if (rect.top <= offset && rect.bottom >= offset) {
                    current = id;
                    break;
                }
            }
            if (current) setActiveId(current);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, [ids, offset]);

    return activeId;
}
