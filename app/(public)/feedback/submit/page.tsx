"use client";

import { useRouter } from "next/navigation";
import { FeedbackForm } from "@/components/mc521/feedback/feedback-form";

export default function FeedbackSubmitPage() {
    const router = useRouter();

    return (
        <div className="feedback-page-content">
            <FeedbackForm onSubmitSuccess={() => router.push("/feedback")} onCancel={() => router.push("/feedback")} />
        </div>
    );
}

