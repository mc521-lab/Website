// 引用块
export function Blockquote({ children }: { children: React.ReactNode }) {
    return <blockquote className="border-primary my-4 border-l-4 bg-neutral-900/50 py-1 pl-6 text-neutral-400 italic">{children}</blockquote>;
}
