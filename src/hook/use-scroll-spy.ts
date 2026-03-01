import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset = 0) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        if (!ids || ids.length === 0) return;

        const handleScroll = () => {
            let currentId = "";

            for (const id of ids) {
                const el = document.getElementById(id);
                if (!el) continue;

                const rect = el.getBoundingClientRect();
                // 如果元素顶部在视口中且超过 offset，则认为它是当前 section
                if (rect.top - offset <= 0) {
                    currentId = id;
                } else {
                    break; // 元素超出顶部，就不用看后面的了
                }
            }

            if (currentId && currentId !== activeId) {
                setActiveId(currentId);
                // 更新 URL hash 不产生浏览历史
                window.history.replaceState(null, "", `#${currentId}`);
            }
        };

        // 初始执行
        handleScroll();

        // 监听滚动和窗口大小
        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleScroll);
        };
    }, [ids, activeId, offset]);

    return activeId;
}
