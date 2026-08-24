import { SectionLayout } from "@/components/experimental/components/section-layout";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SectionLayout
            generalProps={{
                navigation: [
                    { title: "反馈管理", href: "/admin/feedbacks", icon: "lucide:clipboard-list" },
                    { title: "正版验证", href: "/admin/mcauth", icon: "lucide:shield-check" },
                ],
                header: {
                    label: "ADMIN",
                    title: "管理后台",
                    description: "MC521 Lab 服务器管理控制台",
                },
            }}>
            {children}
        </SectionLayout>
    );
}

