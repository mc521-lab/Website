"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FeedbackDetail } from "../_components/feedback-detail";

export default function FeedbackDetailPage({ params }: { params: Promise<{ number: string }> }) {
    const router = useRouter();
    const [number, setNumber] = useState<number | null>(null);

    useEffect(() => {
        void params.then((value) => {
            const parsed = Number(value.number);
            setNumber(Number.isFinite(parsed) ? parsed : null);
        });
    }, [params]);

    if (number === null) {
        return <div className="feedback-page-content" />;
    }

    return (
        <div className="feedback-page-content">
            <FeedbackDetail feedbackNumber={number} onBack={() => router.push("/feedback")} />
        </div>
    );
}
