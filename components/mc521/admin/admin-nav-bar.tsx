"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Shield, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearAdminAuth, getAdminUser } from "@/lib/admin";

export function AdminNavBar() {
    const router = useRouter();
    const [user, setUser] = useState(getAdminUser());

    const handleLogout = () => {
        clearAdminAuth();
        setUser(null);
        router.push("/");
    };

    return (
        <header className="border-foreground/10 sticky top-0 right-0 left-0 z-50 flex h-16 items-center justify-between border-b bg-black/30 px-6 backdrop-blur-md">
            {/* 品牌 Logo 区 */}
            <Link
                href="/admin/feedbacks"
                className="text-foreground flex items-center gap-3 transition-opacity hover:opacity-90">
                <Image width={32} height={32} src="/images/logo.png" alt="君庭阁" className="h-11 w-auto" />
                <div className="flex flex-col leading-tight">
                    <span className="font-heading text-foreground text-lg font-bold">
                        <span className="text-amber-400">管理后台</span>
                    </span>
                    <span className="text-foreground/80 text-xs">MC521 Lab Admin</span>
                </div>
            </Link>

            {/* 右侧动作区 */}
            <div className="hidden items-center gap-3 lg:flex">
                {user && (
                    <div className="flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-sm">
                        <Shield size={14} className="text-amber-400" />
                        <span className="text-amber-200">{user.name ?? user.email.replace("@mc521.local", "")}</span>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-foreground/70 hover:bg-destructive hover:text-destructive transition-colors duration-150 ease-in-out">
                    <LogOut size={16} />
                    <span>退出</span>
                </Button>
                <Button asChild variant="ghost" size="sm">
                    <Link href="/" className="text-foreground/70 hover:text-foreground">
                        <Home size={16} />
                    </Link>
                </Button>
            </div>
        </header>
    );
}

