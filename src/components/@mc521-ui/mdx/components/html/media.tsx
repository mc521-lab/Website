import { cn } from "@/lib/utils";
import { default as NextImageComponent } from "next/image";

// 媒体文件
export function MyImage({
    src,
    alt,
    width,
    height,
    className,
}: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    className?: string;
}) {
    return (
        <NextImageComponent
            src={src ?? ""}
            alt={alt ?? ""}
            width={width ?? 0}
            height={height ?? 0}
            className={cn("my-6 rounded-lg border border-neutral-800", className)}
        />
    );
}

export function MyVideo({ children, width, height }: { children: React.ReactNode; width?: number; height?: number }) {
    return (
        <video className="my-6 rounded-lg border border-neutral-800" width={width ?? 0} height={height ?? 0} autoPlay muted>
            {children}
        </video>
    );
}
export function MySource({ src, type }: { src?: string; type?: string }) {
    return <source src={src ?? ""} type={type ?? ""} />;
}
