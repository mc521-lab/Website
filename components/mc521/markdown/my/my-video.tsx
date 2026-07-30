export function MyVideo({ src, asGif = true }: { src: string; asGif?: boolean }) {
    return (
        <video
            muted={asGif}
            autoPlay={asGif}
            loop={asGif}
            style={{ width: "1024px", height: "auto" }}
            src={src}
            className="border-foreground/50 my-6 rounded-lg border-2"
        />
    );
}

