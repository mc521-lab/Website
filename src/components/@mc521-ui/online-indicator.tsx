"use client";

import { useMcStatus } from "@/hooks/use-server-status";
import { useEffect } from "react";

export function OnlineIndicator({ type = "large" }: { type?: "small" | "large" }) {
    const { status, loading, fetchStatus } = useMcStatus("mc521.cc");
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    return (
        !loading &&
        (type === "large" ? (
            <div className={`bg-background/40 mt-8 flex items-center gap-3 border border-neutral-700 px-6 py-4 backdrop-blur-sm`}>
                <span className="relative flex h-3 w-3">
                    {!status.error ? (
                        <>
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                        </>
                    ) : (
                        <span className="bg-destructive relative inline-flex h-3 w-3 rounded-full"></span>
                    )}
                </span>
                <span className="flex -translate-y-px items-center">
                    {status.error ? (
                        <span className="text-destructive ml-1">服务器离线</span>
                    ) : (
                        <>
                            当前在线：<span className="text-primary ml-1 text-xl font-bold">{status.online}</span>&nbsp;人
                        </>
                    )}
                </span>
            </div>
        ) : (
            <div className="border-background/25 bg-background/50 text-foreground/50 -mr-4 hidden items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs xl:flex">
                <span className={`mr-1 h-2 w-2 rounded-full ${!status.error ? "animate-pulse bg-green-500" : "bg-destructive"}`}></span>
                {status.error ? <span>离线</span> : <span>{status.online} 人在线</span>}
            </div>
        ))
    );
}
