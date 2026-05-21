// app/api/verify-mc/route.ts
import { NextRequest, NextResponse } from "next/server";
import { login } from "@/lib/ms-auth/processer";
import { withApiLog } from "@/lib/pretty-log";

async function handler(req: NextRequest) {
    try {
        const body = await req.json();
        const { code, refresh_token } = body;

        if (!code && !refresh_token) {
            return NextResponse.json({ success: false, uuid: null, error: "Missing code or refresh_token" }, { status: 400 });
        }

        let step = 0;

        // 调用你的 login 函数，更新 step
        const uuid = await login({ code, refresh_token }, code ? "authorization_code" : "refresh_token", (s: number) => {
            step = s; // 可选：在开发调试中记录当前步骤
            console.log("Current login step:", step);
        });

        return NextResponse.json({ success: true, uuid });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
        console.error("verify-mc error:", err);

        let errorMsg = "Unknown error";
        let step = 1;
        let statusCode = 500;

        // 尝试按照 AxiosError 格式解析
        const axiosErr = err as import("axios").AxiosError<unknown>;

        if (axiosErr.response?.data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = axiosErr.response.data as any;
            errorMsg = data.error_description || data.errorMessage || data.errorType || errorMsg;
            statusCode = axiosErr.response.status ?? 500;
        } else if (axiosErr.message) {
            errorMsg = axiosErr.message;
        }

        // 根据请求 URL 推断错误阶段 step
        const url = axiosErr.config?.url || "";
        if (url.includes("xboxlive.com")) step = 2;
        else if (url.includes("xsts.auth")) step = 3;
        else if (url.includes("login_with_xbox")) step = 4;
        else if (url.includes("/minecraft/profile")) step = 5;

        return NextResponse.json({ success: false, uuid: null, error: errorMsg, step, code: statusCode }, { status: statusCode });
    }
}

export const POST = withApiLog(handler, { logBody: true }, "POST /api/mc-genuine/verify");
