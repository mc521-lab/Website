import { highlightCode } from "@/lib/mdx";

// 代码块组件 - 服务端组件
export async function Pre({ children, className }: React.ComponentProps<"pre"> & { children: React.ReactNode }) {
    // 提取代码和语言
    const codeElement = children as React.ReactElement;
    const code = (codeElement?.props as { children: unknown })?.children || "";
    const lang = className?.replace("language-", "") || "text";

    const highlighted = await highlightCode(String(code), lang);

    // 使用 pre 标签包裹，保留 Shiki 的 HTML
    return (
        <div className="relative my-6 overflow-hidden rounded-lg border border-neutral-800">
            <div className="flex items-center justify-between bg-neutral-900 px-4 py-2 text-xs text-neutral-400">
                <span>{lang}</span>
            </div>
            <pre className="overflow-x-auto bg-neutral-950 p-4 text-sm" dangerouslySetInnerHTML={{ __html: highlighted }} />
        </div>
    );
}

// 内联代码 - 客户端组件，不使用异步高亮
export function Code({ children, className }: { children: React.ReactNode; className?: string }) {
    // 如果是代码块（有 language- 类名），让 pre 组件处理
    if (className?.startsWith("language-")) {
        return <code className={className}>{children}</code>;
    }

    // 行内代码
    return <code className="rounded bg-neutral-800 px-1.5 py-0.5 font-mono text-sm text-neutral-200">{children}</code>;
}
