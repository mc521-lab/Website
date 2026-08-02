import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { failure, success } from "@/lib/server/response";

const MS_TOKEN_URL =
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/token";

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { device_code?: string };
    try {
        body = await request.json();
    } catch {
        return failure("Invalid request body", 400);
    }

    if (!body.device_code) {
        return failure("Missing device_code", 400);
    }

    const clientId = process.env.MS_CLIENT_ID ?? process.env.NEXT_PUBLIC_MSAUTH_CLIENT_ID;
    if (!clientId) {
        return failure("Missing MS_CLIENT_ID / NEXT_PUBLIC_MSAUTH_CLIENT_ID", 500);
    }

    try {
        const msResp = await fetch(MS_TOKEN_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                client_id: clientId,
                device_code: body.device_code,
            }).toString(),
        });

        const data = await msResp.json();

        if (msResp.ok && data.access_token) {
            log.success("Device code authorized", {
                hasAccessToken: true,
                hasRefreshToken: !!data.refresh_token,
            });
            return success({
                status: "success" as const,
                access_token: data.access_token,
                refresh_token: data.refresh_token ?? null,
                expires_in: data.expires_in ?? 3600,
            });
        }

        const errorCode = data.error as string | undefined;

        switch (errorCode) {
            case "authorization_pending":
                return success({ status: "pending" as const });

            case "slow_down":
                return success({ status: "slow_down" as const });

            case "authorization_declined":
                log.warn("User declined authorization");
                return failure("授权被拒绝", 403);

            case "expired_token":
                log.warn("Device code expired");
                return failure("设备码已过期，请重新验证", 410);

            case "bad_verification_code":
                log.error("Bad device code");
                return failure("无效的设备码", 400);

            default:
                log.error("Unexpected token error", {
                    error: errorCode,
                    description: data.error_description,
                });
                return failure(
                    data.error_description ?? data.error ?? "验证出错",
                    msResp.status || 500,
                );
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        log.error("Token request exception", { error: msg });
        return failure("网络请求失败", 502);
    }
});