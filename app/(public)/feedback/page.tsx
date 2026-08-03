"use client";

import { useCallback } from "react";
import { useFeedbackView } from "@/components/mc521/feedback/feedback-context";
import { FeedbackForm } from "@/components/mc521/feedback/feedback-form";
import { FeedbackList } from "@/components/mc521/feedback/feedback-list";
import { FeedbackDetail } from "@/components/mc521/feedback/feedback-detail";
import type { Feedback } from "@/components/mc521/feedback/types";

export default function FeedbackPage() {
    const { view, selectedFeedback, refreshKey, selectFeedback, goToBoard, refreshBoard } = useFeedbackView();

    const handleSubmitSuccess = useCallback(() => {
        refreshBoard();
        goToBoard();
    }, [refreshBoard, goToBoard]);

    const handleSelectFeedback = useCallback(
        (feedback: Feedback) => {
            selectFeedback(feedback);
        },
        [selectFeedback]
    );

    return (
        <div className="feedback-page-content">
            {view === "board" && <FeedbackList onSelectFeedback={handleSelectFeedback} refreshKey={refreshKey} />}
            {view === "submit" && <FeedbackForm onSubmitSuccess={handleSubmitSuccess} onCancel={goToBoard} />}
            {view === "detail" && selectedFeedback && (
                <FeedbackDetail feedbackNumber={selectedFeedback.number} onBack={goToBoard} />
            )}
        </div>
    );
}
