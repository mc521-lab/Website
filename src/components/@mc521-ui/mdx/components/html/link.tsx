// 链接
export function A({ href, children }: { href?: string; children: React.ReactNode }) {
    return (
        <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-4">
            {children}
        </a>
    );
}
