"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WikiIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/gallery/equipment/armor");
    }, [router]);

    return null;
}
