import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { failure, success } from "@/lib/server/response";

const MS_DEVICE_CODE_URL = "https://login.microsoftonline.com/consumers/oauth2/v2.0/devicecode";

export const POST = createHandler(async (_request: NextRequest, _context, log) => {
    const clientId = process.env.MS_CLIENT_ID ?? process.env.NEXT_PUBLIC_MSAUTH_CLIENT_ID;
    if (!clientId) {
        return failure("Missing MS_CLIENT_ID / NEXT_PUBLIC_MSAUTH_CLIENT_ID", 500);
    }

    try {
        const msResp = await fetch(MS_DEVICE_CODE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: clientId,
                scope: "XboxLive.signin offline_access",
            }).toString(),
        });

        const data = await msResp.json();

        if (!msResp.ok) {
            log.error("Microsoft devicecode request failed", {
                status: msResp.status,
                error: data.error,
                description: data.error_description,
            });
            return failure(data.error_description ?? data.error ?? "获取设备码失败", msResp.status);
        }

        log.success("Device code obtained", {
            expiresIn: data.expires_in,
            interval: data.interval,
        });

        return success({
            device_code: data.device_code,
            user_code: data.user_code,
            verification_uri: data.verification_uri,
            expires_in: data.expires_in,
            interval: data.interval,
            message: data.message,
        });
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.error("Device code request exception", { error: msg });
        return failure("网络请求失败", 502);
    }
});
