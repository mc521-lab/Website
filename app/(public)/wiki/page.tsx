"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WikiIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/wiki/beginner/common-commands");
    }, [router]);

    return null;
}
