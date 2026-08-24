"use client";

import { useRouter } from "next/navigation";
import { FeedbackForm } from "../_components/feedback-form";

export default function FeedbackSubmitPage() {
    const router = useRouter();

    return (
        <div className="feedback-page-content">
            <FeedbackForm onSubmitSuccess={() => router.push("/feedback")} onCancel={() => router.push("/feedback")} />
        </div>
    );
}
