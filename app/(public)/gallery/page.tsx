"use client";

import { useRouter } from "next/navigation";

export default function WikiIndexPage() {
    const router = useRouter();
    router.push("/gallery/equipment/armor");
    return null;
}
