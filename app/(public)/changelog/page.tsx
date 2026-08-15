"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ChangelogIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/changelog/latest/v1-2-0");
    }, [router]);

    return null;
}
