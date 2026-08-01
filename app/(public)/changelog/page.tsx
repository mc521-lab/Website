"use client";

import { useRouter } from "next/navigation";

export default function ChangelogIndexPage() {
    const router = useRouter();
    router.push("/changelog/latest/v1-2-0");
    return null;
}