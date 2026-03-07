import { Mc521 } from "@/components";

export default function ChangeLogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pixel-font">
            <Mc521.NavBarSubpages name="更新日志" path="/#changelog" />
            {children}
        </div>
    );
}
