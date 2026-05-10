// 列表
export function Ul({ children }: { children: React.ReactNode }) {
    return <ul className="my-4 list-disc space-y-1 pl-6 text-neutral-300">{children}</ul>;
}

export function Ol({ children }: { children: React.ReactNode }) {
    return <ol className="my-4 list-decimal space-y-1 pl-6 text-neutral-300">{children}</ol>;
}

export function Li({ children }: { children: React.ReactNode }) {
    return <li>{children}</li>;
}
