"use client";

import { createContext, useContext, useState, useCallback, useMemo } from "react";
import type { Feedback } from "./types";

export type FeedbackViewMode = "board" | "submit" | "detail";

interface FeedbackViewContextValue {
    view: FeedbackViewMode;
    selectedFeedback: Feedback | null;
    refreshKey: number;
    setView: (view: FeedbackViewMode) => void;
    setSelectedFeedback: (feedback: Feedback | null) => void;
    refreshBoard: () => void;
    selectFeedback: (feedback: Feedback) => void;
    goToBoard: () => void;
    goToSubmit: () => void;
}

const FeedbackViewContext = createContext<FeedbackViewContextValue | null>(null);

export function FeedbackViewProvider({ children }: { children: React.ReactNode }) {
    const [view, setView] = useState<FeedbackViewMode>("board");
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const refreshBoard = useCallback(() => {
        setRefreshKey((k) => k + 1);
    }, []);

    const selectFeedback = useCallback((feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setView("detail");
    }, []);

    const goToBoard = useCallback(() => {
        setSelectedFeedback(null);
        setView("board");
        refreshBoard();
    }, [refreshBoard]);

    const goToSubmit = useCallback(() => {
        setView("submit");
    }, []);

    const value = useMemo<FeedbackViewContextValue>(
        () => ({
            view,
            selectedFeedback,
            refreshKey,
            setView,
            setSelectedFeedback,
            refreshBoard,
            selectFeedback,
            goToBoard,
            goToSubmit,
        }),
        [view, selectedFeedback, refreshKey, refreshBoard, selectFeedback, goToBoard, goToSubmit]
    );

    return <FeedbackViewContext.Provider value={value}>{children}</FeedbackViewContext.Provider>;
}

export function useFeedbackView() {
    const ctx = useContext(FeedbackViewContext);
    if (!ctx) throw new Error("useFeedbackView must be used within FeedbackViewProvider");
    return ctx;
}
