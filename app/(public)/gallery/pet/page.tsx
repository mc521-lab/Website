"use client";

import { useRouter } from "next/navigation";

export default function PetIndexPage() {
    const router = useRouter();
    router.push("/gallery/pet/food");
    return null;
}
