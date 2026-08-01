"use client";

import { useEffect } from "react";

export default function McauthCallbackPage() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const error = params.get("error");

        if (window.opener && !window.opener.closed) {
            if (code) {
                window.opener.postMessage({ code }, window.location.origin);
            } else if (error) {
                window.opener.postMessage({ error }, window.location.origin);
            }
        }

        window.close();
    }, []);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-black">
            <p className="text-foreground/70 text-sm">正在完成验证，请稍候...</p>
        </div>
    );
}
