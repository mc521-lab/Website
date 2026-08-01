"use client";

import { useFeedbackView } from "./feedback-context";
import { cn } from "@/lib/utils";
import { IconifyIcon } from "@/components/iconify-icon";
import { ChevronLeft } from "lucide-react";

export function FeedbackSidebar() {
    const { view, selectedFeedback, goToBoard, goToSubmit } = useFeedbackView();

    const navItems = [
        {
            key: "board" as const,
            title: "反馈看板",
            iconIfe: "lucide:clipboard-list",
        },
        {
            key: "submit" as const,
            title: "提交反馈",
            iconIfe: "lucide:plus",
        },
    ];

    return (
        <aside className="island-sidebar feedback-sidebar">
            <div className="island-sidebar-header">
                <span className="island-sidebar-label">FEEDBACK</span>
                <h2>反馈中心</h2>
                <p>提交 Bug、建议新功能，或查看其他玩家的反馈与回复</p>
            </div>

            <nav className="island-sidebar-nav">
                {navItems.map((item) => {
                    const isActive = view === item.key;
                    return (
                        <button
                            key={item.key}
                            type="button"
                            onClick={item.key === "board" ? goToBoard : goToSubmit}
                            className={cn("island-nav-item feedback-nav-item", isActive && "is-active")}>
                            <span className="island-nav-icon">
                                <IconifyIcon icon={item.iconIfe} />
                            </span>
                            <span className="island-nav-title">{item.title}</span>
                        </button>
                    );
                })}

                {view === "detail" && (
                    <div className="feedback-nav-group is-detail">
                        <button
                            type="button"
                            className={cn("island-nav-item feedback-nav-item is-active")}>
                            <span className="island-nav-icon">
                                <IconifyIcon icon="lucide:eye" />
                            </span>
                            <span className="island-nav-title">
                                {selectedFeedback ? `#${selectedFeedback.number} ${selectedFeedback.title}` : "反馈详情"}
                            </span>
                        </button>
                        <button type="button" onClick={goToBoard} className="feedback-nav-back">
                            <ChevronLeft size={14} />
                            返回看板
                        </button>
                    </div>
                )}
            </nav>
        </aside>
    );
}
