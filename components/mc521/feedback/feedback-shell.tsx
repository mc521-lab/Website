"use client";

import { usePathname } from "next/navigation";
import { FeedbackSidebar } from "@/components/mc521/feedback/feedback-sidebar";
import { PlayerIdDialog } from "@/components/mc521/feedback/player-id-dialog";

export function FeedbackShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="island-page">
            <div className="island-layout">
                <FeedbackSidebar pathname={pathname} />
                <main className="island-content better-scroll-bar flex flex-col">
                    <div className="island-content-inner">
                        <div className="mb-4 flex justify-end lg:hidden">
                            <PlayerIdDialog />
                        </div>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
