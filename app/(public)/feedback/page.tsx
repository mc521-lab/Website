"use client";

import { useState, useCallback } from "react";
import { FeedbackForm } from "@/components/mc521/feedback/feedback-form";
import { FeedbackList } from "@/components/mc521/feedback/feedback-list";
import { FeedbackDetail } from "@/components/mc521/feedback/feedback-detail";
import { IconifyIcon } from "@/components/iconify-icon";
import { Plus, ClipboardList, Eye } from "lucide-react";
import type { Feedback } from "@/components/mc521/feedback/types";
import { cn } from "@/lib/utils";

type ViewMode = "board" | "submit" | "detail";

export default function FeedbackPage() {
    const [view, setView] = useState<ViewMode>("board");
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const handleSubmitSuccess = useCallback(() => {
        setRefreshKey((k) => k + 1);
        setView("board");
    }, []);

    const handleSelectFeedback = useCallback((feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setView("detail");
    }, []);

    const handleBackToBoard = useCallback(() => {
        setSelectedFeedback(null);
        setView("board");
        setRefreshKey((k) => k + 1);
    }, []);

    return (
        <div className="feedback-page">
            {/* Page header */}
            <header className="feedback-page-header">
                <div className="feedback-page-header-icon">
                    <IconifyIcon icon="lucide:message-square" width={32} height={32} />
                </div>
                <div>
                    <h1 className="feedback-page-title">反馈中心</h1>
                    <p className="feedback-page-subtitle">提交 Bug、建议新功能，或查看其他玩家的反馈与回复</p>
                </div>
            </header>

            {/* View tabs */}
            <nav className="feedback-view-tabs">
                <button
                    type="button"
                    onClick={() => setView("board")}
                    className={cn("feedback-view-tab", view === "board" && "is-active")}>
                    <ClipboardList size={16} />
                    反馈看板
                </button>
                <button
                    type="button"
                    onClick={() => setView("submit")}
                    className={cn("feedback-view-tab", view === "submit" && "is-active")}>
                    <Plus size={16} />
                    提交反馈
                </button>
                {view === "detail" && (
                    <button type="button" className="feedback-view-tab is-active">
                        <Eye size={16} />
                        反馈详情
                    </button>
                )}
            </nav>

            {/* Main content */}
            <main className="feedback-main">
                {view === "board" && <FeedbackList onSelectFeedback={handleSelectFeedback} refreshKey={refreshKey} />}
                {view === "submit" && <FeedbackForm onSubmitSuccess={handleSubmitSuccess} onCancel={handleBackToBoard} />}
                {view === "detail" && selectedFeedback && (
                    <FeedbackDetail feedbackNumber={selectedFeedback.number} onBack={handleBackToBoard} />
                )}
            </main>
        </div>
    );
}

