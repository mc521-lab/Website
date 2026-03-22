import { Mc521 } from "@/components";

export default function ChangeLogLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="pixel-font">
            <Mc521.NavBarSubpages name="光影时刻" path="/#photos" />
            {children}
        </div>
    );
}
