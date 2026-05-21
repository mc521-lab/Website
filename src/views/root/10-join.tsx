"use client";

import { ServerIcon, CopyIcon, MessageCircleMoreIcon } from "lucide-react";
import { useState } from "react";

export function Join() {
    const [isCopied, setCopied] = useState(false);

    const onCopyServerIp = () => {
        navigator.clipboard.writeText("mc521.cc");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <section className="bg-primary relative flex min-h-96 items-center justify-center py-24" id="join">
            <div className="flex w-full max-w-[80vw] flex-col items-center justify-center">
                <div className="border-background bg-foreground mx-auto w-full border-4 p-8 shadow-[12px_12px_0_rgba(0,0,0,0.8)] md:p-12">
                    <div className="mb-10 text-center">
                        <h2 className="text-background mb-4 text-4xl font-bold">准备好加入了吗？</h2>
                        <p className="text-background/75">加入我们的 QQ 群！获取社区最新活动、下载客户端或寻找搭子！</p>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="space-y-4">
                            <h3 className="text-background flex items-center gap-2 text-xl font-bold">
                                <ServerIcon className="translate-y-px" />
                                社区信息
                            </h3>
                            <div
                                className="group hover:border-background border-background/35 bg-background/5 text-background flex cursor-pointer items-center justify-between border-2 border-dashed p-4"
                                onClick={onCopyServerIp}>
                                <div>
                                    <p className="text-background/50 text-xs uppercase">服务器地址</p>
                                    <p className="text-lg font-bold">mc521.cc</p>
                                </div>
                                {isCopied ? (
                                    // <CopyCheckIcon className="text-background/50 group-hover:text-background" />
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-copy-check-icon lucide-copy-check opacity-50 group-hover:opacity-100">
                                        <path d="m12 15 2 2 4-4" className="text-green-700" />
                                        <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                                        <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                                    </svg>
                                ) : (
                                    <CopyIcon className="text-background/50 group-hover:text-background" />
                                )}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-background flex items-center gap-2 text-xl font-bold">官方社群</h3>
                            <div className="grid gap-3 lg:grid-cols-2">
                                <a
                                    href="https://qm.qq.com/q/nLEPToNgpq"
                                    target="_blank"
                                    className="relative flex items-center justify-center gap-4 border-b-4 border-blue-700 bg-blue-500 p-3 font-bold text-white transition-colors hover:bg-blue-600 active:translate-y-1 active:border-b-0">
                                    <MessageCircleMoreIcon />
                                    玩家交流群
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
