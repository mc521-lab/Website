export const metadata = {
    title: {
        absolute: "君庭阁 Wiki",
        template: "%s - 君庭阁 Wiki",
    },
};

export default function WikiLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background min-h-screen">
            <div className="flex">{children}</div>
        </div>
    );
}
