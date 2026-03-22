"use client";

import { Radix } from "@/components";
import { useEffect } from "react";

const svg = `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" fill-rule="evenodd">
        <g fill="#eab308" fill-opacity="0.1">
            <path d="M35.4 32l2.8-2.8-1.4-1.4-2.8 2.8-2.8-2.8-1.4 1.4 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.8 2.8 1.4-1.4-2.8-2.8zm0-30L38.2-.8 36.8-2.2 34 0.6 31.2-2.2 29.8-.8 32.6 2 29.8 4.8 31.2 6.2 34 3.4 36.8 6.2 38.2 4.8 35.4 2zm-30 30l2.8-2.8-1.4-1.4-2.8 2.8-2.8-2.8-1.4 1.4 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.8 2.8 1.4-1.4-2.8-2.8zM5.4 2L8.2-.8 6.8-2.2 4 0.6 1.2-2.2-.2-.8 2.6 2-.2 4.8 1.2 6.2 4 3.4 6.8 6.2 8.2 4.8 5.4 2z"/>
        </g>
    </g>
</svg>`;
const encodedSvg = encodeURIComponent(svg);

export default function MicrosoftCallback() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code"); // Microsoft 返回的 code
        const error = params.get("error"); // 如果有错误

        // 发回主窗口
        if (window.opener) {
            window.opener.postMessage({ code, error }, window.origin);
            setTimeout(() => {
                window.close();
            }, 1000);
        }
    }, []);

    return (
        <main
            className="pixel-font flex h-screen w-screen flex-col items-center justify-center"
            style={{
                backgroundImage: `url("data:image/svg+xml,${encodedSvg}")`,
                backgroundPosition: "8px 8px",
            }}>
            <Radix.Card className="w-full max-w-md">
                <Radix.CardHeader>
                    <Radix.CardTitle className="text-xl">NEXORA Hub 正版验证服务</Radix.CardTitle>
                </Radix.CardHeader>
                <Radix.CardContent>
                    <p>已授权登录账户，此页面将自动关闭...</p>
                </Radix.CardContent>
            </Radix.Card>
        </main>
    );
}
