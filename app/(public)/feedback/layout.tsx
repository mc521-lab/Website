"use client";

import { FeedbackShell } from "@/components/mc521/feedback/feedback-shell";

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
    return <FeedbackShell>{children}</FeedbackShell>;
}
