import { cn } from "@/lib/utils";

// 标题组件
export interface HeadingProps {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
    id?: string;
}
export function Heading({ level, children, id }: HeadingProps) {
    const Tag = `h${level}` as const;
    const styles = {
        1: "text-3xl font-bold mt-8 mb-4",
        2: "text-2xl font-semibold mt-8 mb-3 border-b border-neutral-800 pb-2",
        3: "text-xl font-semibold mt-6 mb-3",
        4: "text-lg font-medium mt-4 mb-2",
        5: "text-base font-medium mt-4 mb-2",
        6: "text-sm font-medium mt-4 mb-2 text-neutral-400",
    };

    return (
        <Tag id={id} className={cn("text-foreground scroll-mt-20", styles[level])}>
            {children}
        </Tag>
    );
}

// 段落
export function Paragraph({ children }: { children: React.ReactNode }) {
    return <p className="my-4 leading-7 text-neutral-300">{children}</p>;
}
