export function OnlineIndicator({ online, error, type = "large" }: { online: number; error: boolean; type?: "small" | "large" }) {
    return type === "large" ? (
        <div className={`bg-background/40 mt-8 flex items-center gap-3 border border-neutral-700 px-6 py-4 backdrop-blur-sm`}>
            <span className="relative flex h-3 w-3">
                {!error ? (
                    <>
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                    </>
                ) : (
                    <span className="bg-destructive relative inline-flex h-3 w-3 rounded-full"></span>
                )}
            </span>
            <span className="flex -translate-y-px items-center">
                {error ? (
                    <span className="text-destructive ml-1">服务器离线</span>
                ) : (
                    <>
                        当前在线：<span className="text-primary ml-1 text-xl font-bold">{online}</span>&nbsp;人
                    </>
                )}
            </span>
        </div>
    ) : (
        <div className="border-background/25 bg-background/50 text-foreground/50 -mr-4 hidden items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs xl:flex">
            <span className={`mr-1 h-2 w-2 rounded-full ${!error ? "animate-pulse bg-green-500" : "bg-destructive"}`}></span>
            {error ? <span>离线</span> : <span>{online} 人在线</span>}
        </div>
    );
}
