"use client";

import { useRouter } from "next/navigation";

export default function WikiIndexPage() {
    const router = useRouter();
    router.push("/wiki/beginner/common-commands");
    return null;
}

