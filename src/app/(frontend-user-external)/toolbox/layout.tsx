import { Mc521 } from "@/components";

export const metadata = {
    title: {
        absolute: "君庭阁工具箱",
        template: "%s - 君庭阁工具箱",
    },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col">
            <Mc521.NavBarSubpages name="工具箱" path="/" />
            {children}
        </div>
    );
}
