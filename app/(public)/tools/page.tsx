"use client";

import { useRouter } from "next/navigation";

export default function ToolsIndexPage() {
    const router = useRouter();
    router.push("/tools/skindrop");
}
