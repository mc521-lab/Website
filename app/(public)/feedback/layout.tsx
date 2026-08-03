"use client";

import { FeedbackSidebar } from "@/components/mc521/feedback/feedback-sidebar";
import { FeedbackViewProvider } from "@/components/mc521/feedback/feedback-context";

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
    return (
        <FeedbackViewProvider>
            <div className="island-page">
                <div className="island-layout">
                    <FeedbackSidebar />
                    <main className="island-content better-scroll-bar flex flex-col">
                        <div className="island-content-inner">{children}</div>
                    </main>
                </div>
            </div>
        </FeedbackViewProvider>
    );
}
