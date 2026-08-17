"use client";

import { usePathname } from "next/navigation";

import { IconifyIcon } from "@/components/iconify-icon";
import { SectionLayoutSwitch } from "@/components/mc521/layout/section-layout-switch";
import { PlayerIdDialog } from "@/components/mc521/feedback/player-id-dialog";

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const navItems = [
        {
            href: "/feedback",
            title: "反馈看板",
            icon: "lucide:clipboard-list",
        },
        {
            href: "/feedback/submit",
            title: "提交反馈",
            icon: "lucide:plus",
        },
    ];
    const isDetail = pathname.startsWith("/feedback/") && pathname !== "/feedback" && pathname !== "/feedback/submit";

    return (
        <SectionLayoutSwitch
            navigation={navItems}
            header={{
                label: "FEEDBACK",
                title: "反馈中心",
                description: "提交 Bug、建议新功能，或查看其他玩家的反馈与回复",
            }}
            sidebarClassName="md:w-[286px]"
            contentInnerClassName="flex flex-col"
            mobileToolbar={
                <div className="mb-4 flex justify-end lg:hidden">
                    <PlayerIdDialog />
                </div>
            }
            sidebarFooter={
                isDetail ? (
                    <div className="feedback-nav-group is-detail w-full">
                        <div className="island-nav-item feedback-nav-item is-active w-full">
                            <span className="island-nav-icon">
                                <IconifyIcon icon="lucide:eye" />
                            </span>
                            <span className="island-nav-title">反馈详情</span>
                        </div>
                    </div>
                ) : undefined
            }>
            {children}
        </SectionLayoutSwitch>
    );
}
