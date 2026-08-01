"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { isAdminLoggedIn } from "@/lib/admin";

interface AuthGuardProps {
    children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const loggedIn = isAdminLoggedIn();
        if (!loggedIn && pathname !== "/admin/login") {
            router.replace("/admin/login");
            return;
        }
        if (loggedIn && pathname === "/admin/login") {
            router.replace("/admin/feedbacks");
            return;
        }
        setIsChecking(false);
    }, [router, pathname]);

    if (isChecking) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-black/60">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-400/30 border-t-amber-400" />
                    <p className="text-sm text-amber-200/60">验证身份中...</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}