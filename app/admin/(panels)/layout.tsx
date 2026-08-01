import { IslandSidebar } from "@/components/mc521/layout/island-sidebar";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="island-page">
            <div className="island-layout">
                {/* Sidebar */}
                <IslandSidebar
                    navigation={[{ title: "反馈管理", href: "/admin/feedbacks", icon: "lucide:clipboard-list" }]}
                    header={{
                        label: "ADMIN",
                        title: "管理后台",
                        description: "MC521 Lab 服务器管理控制台",
                    }}
                />

                {/* Content */}
                <main className="island-content better-scroll-bar">{children}</main>
            </div>
        </div>
    );
}
