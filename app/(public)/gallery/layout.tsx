import { gallery_navigation } from "@/.velite";
import { SectionLayout } from "@/components/experimental/components/section-layout";

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
    return (
        <SectionLayout
            generalProps={{
                navigation: gallery_navigation,
                header: {
                    label: "GALLERY",
                    title: "君庭阁图鉴",
                    description: "服务器物品、装备与图鉴展示",
                },
            }}>
            {children}
        </SectionLayout>
    );
}
