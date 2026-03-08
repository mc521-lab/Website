"use client";

import { usePathname } from "next/navigation";
import { Mc521 } from "..";

export function NavigationWrapper({
    children,
    showNavWhen = "/",
}: {
    children: React.ReactNode;
    showNavWhen?: string;
    [key: string]: unknown;
}) {
    const pathname = usePathname();

    return (
        <>
            {pathname === showNavWhen && <Mc521.NavBarHome />}
            {children}
        </>
    );
}
