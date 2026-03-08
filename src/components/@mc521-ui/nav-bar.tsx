// components/Header.tsx
"use client";

import { usePathname } from "next/navigation";
import { Mc521, Radix } from "@/components";
import { ChevronLeftIcon, ChevronLeftCircleIcon, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { useScrollSpy } from "@/hook/use-scroll-spy";
import { useMcStatus } from "@/hook/use-server-status";
import { navigateTo } from "@/lib/utils";
import { Navbar as NextraNavbar } from "nextra-theme-docs";
import Link from "next/link";
import Image from "next/image";

const NAV_ITEMS = [
    { label: "首页", href: "#home" },
    { label: "介绍", href: "#about" },
    { label: "配置", href: "#device" },
    { label: "生态", href: "#ecosystem" },
    { label: "成员", href: "#team" },
    { label: "照片", href: "#photos" },
    { label: "活动", href: "#events" },
    { label: "事件", href: "#milestones" },
    { label: "日志", href: "#changelog" },
];

type NavBar_ItemProps = {
    label: string;
    current: boolean;
    onClick: () => void;
};
function NavBar_Item({ label, current, onClick }: NavBar_ItemProps) {
    return (
        <button
            onClick={onClick}
            className={`group hover:text-foreground relative cursor-pointer py-2 text-sm font-medium text-neutral-400 transition-colors ${current && "text-foreground!"}`}>
            {label}
            <span
                className={`bg-primary absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 transition-all duration-300 group-hover:w-full ${current && "w-full"}`}></span>
        </button>
    );
}

function NavBar_BigButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    return (
        <Radix.Button
            onClick={onClick}
            variant="default"
            size="lg"
            className="group text-background relative cursor-pointer overflow-hidden px-6 py-5 text-sm font-bold transition-all active:scale-95">
            <span className="relative z-10 flex items-center gap-2">{children}</span>
            <div className="pointer-events-none absolute inset-0 translate-y-full bg-white/20 transition-transform duration-300 group-hover:translate-y-0"></div>
        </Radix.Button>
    );
}

export function NavBarHome() {
    const pathname = usePathname();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 50); // 滚动超过 50px
        };
        onScroll();
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const activeId = useScrollSpy([...NAV_ITEMS.map((item) => item.href.slice(1)), "join"], 100);

    const { status, loading, fetchStatus } = useMcStatus("mc521.cc");
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return (
        <header
            className={`fixed top-0 right-0 left-0 z-50 border-b transition-all duration-300 ${scrolled ? "border-neutral-800 bg-[#1a1a1a]/95 py-3 shadow-lg backdrop-blur-md" : "border-transparent bg-transparent py-6"}`}>
            <div className="container mx-auto flex h-12 items-center justify-center gap-10 px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/images/logo.png" alt="君庭阁" className="mr-1 rounded-xs" width={36} height={36} />
                    <span className="no-font hover:text-primary text-xl font-bold transition-colors duration-300">
                        <span className="text-primary">君庭阁</span> 我的世界
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden items-center gap-10 md:flex">
                    {NAV_ITEMS.map((item) => (
                        <NavBar_Item
                            key={item.href}
                            label={item.label}
                            onClick={() => navigateTo(item.href)}
                            current={activeId === item.href.slice(1)}
                        />
                    ))}
                    {!loading && <Mc521.OnlineIndicator online={status.online ?? 0} error={status?.error} type="small" />}
                    <NavBar_BigButton onClick={() => navigateTo("#join")}>加入我们</NavBar_BigButton>
                </nav>

                {/* Mobile Navigation */}
                <Radix.Sheet>
                    <Radix.SheetTrigger className="md:hidden">
                        <Menu className="h-6 w-6" />
                    </Radix.SheetTrigger>
                    <Radix.SheetContent side="right" className="w-64 p-4">
                        <nav className="flex flex-col gap-4">
                            {NAV_ITEMS.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`hover:text-yellow-400 ${pathname === item.href ? "text-yellow-400" : "text-gray-700"}`}>
                                    {item.label}
                                </Link>
                            ))}
                            <div className="mt-4 flex flex-col gap-2">
                                <Radix.Button variant="default" size="lg">
                                    加入我们
                                </Radix.Button>
                            </div>
                        </nav>
                    </Radix.SheetContent>
                </Radix.Sheet>
            </div>
        </header>
    );
}

export function NavBarSubpages({ name, path = "/" }: { name: string; path?: string }) {
    return (
        <header className={`bg-muted fixed top-0 right-0 left-0 z-50 border-b border-transparent py-4 shadow-lg transition-all duration-300`}>
            <div className="mx-auto max-w-3/5">
                <span onClick={() => (window.location.href = path)} className="flex cursor-pointer items-center gap-2">
                    <ChevronLeftIcon className="translate-y-px opacity-50" />
                    <span className="text-xl font-bold transition-colors duration-300">
                        君庭阁 <span className="text-primary">{name}</span>
                    </span>
                </span>
            </div>
        </header>
    );
}

function Logo({ showBackToHome }: { showBackToHome: boolean }) {
    return (
        <>
            {showBackToHome && (
                <div className="mr-4">
                    <Link className="flex items-center gap-2" href="/">
                        <ChevronLeftCircleIcon />
                    </Link>
                </div>
            )}
            <Link className="flex items-center gap-2" href="/wiki">
                <Image src="/images/logo.png" alt="君庭阁" className="mr-1 rounded-xs" width={36} height={36} />
                <span className="text-xl font-bold transition-colors duration-300">
                    <span className="text-primary">君庭阁</span> Wiki
                </span>
            </Link>
        </>
    );
}
export function NavBarWiki() {
    const pathname = usePathname();
    const showBackToHome = pathname === "/wiki";

    return (
        <NextraNavbar
            logo={<Logo showBackToHome={showBackToHome} />}
            logoLink={false}
            projectLink="https://github.com/mc521-lab/Website/tree/v4/content/wiki"
        />
    );
}
