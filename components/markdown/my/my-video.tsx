import { cn } from "@/lib/utils";

export function MyVideo({ src, asGif = true, raw }: { src: string; asGif?: boolean; raw?: boolean }) {
    return (
        <video
            muted={asGif}
            autoPlay={asGif}
            loop={asGif}
            style={{ width: raw ? "100%" : "1024px", height: raw ? "100%" : "auto" }}
            src={src}
            className={cn(!raw && "my-6 rounded-lg")}
        />
    );
}
