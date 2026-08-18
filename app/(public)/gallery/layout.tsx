import { gallery_navigation } from "@/.velite";
import { SectionLayoutSwitch } from "@/components/mc521/layout/experimental/section-layout-switch";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayoutSwitch
            navigation={gallery_navigation}
            header={{
                label: "GALLERY",
                title: "君庭阁图鉴",
                description: "服务器物品、装备与图鉴展示",
            }}
        >
            {children}
        </SectionLayoutSwitch>
    );
}
