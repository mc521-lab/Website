import { plogDebug } from "./logger";

const XBOX_AUTH_URL = "https://user.auth.xboxlive.com/user/authenticate";
const XSTS_AUTH_URL = "https://xsts.auth.xboxlive.com/xsts/authorize";
const MC_ACCESS_TOKEN_URL = "https://api.minecraftservices.com/authentication/login_with_xbox";
const MC_ELIGIBILITY_URL = "https://api.minecraftservices.com/entitlements/mcstore";
const MC_PROFILE_URL = "https://api.minecraftservices.com/minecraft/profile";

export interface LoginProgress {
    step: number;
}

export interface LoginResult {
    uuid: string;
    name: string;
}

export interface LoginError extends Error {
    step: number;
    statusCode: number;
    url?: string;
}

async function invokeJsonRaw(
    url: string,
    body: unknown,
    headers?: Record<string, string>,
    method: "GET" | "POST" = "POST"
): Promise<Response> {
    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...headers,
        },
        body: method === "GET" ? undefined : JSON.stringify(body),
    });
}

async function safeJson(resp: Response): Promise<Record<string, unknown>> {
    try {
        const data = await resp.json();
        return (data ?? {}) as Record<string, unknown>;
    } catch {
        return {};
    }
}

function decodeJwtPayload(token: string): Record<string, unknown> {
    try {
        const parts = token.split(".");
        if (parts.length < 2) return {};
        const padded = parts[1] + "=".repeat((4 - (parts[1].length % 4)) % 4);
        const decoded = Buffer.from(padded, "base64url").toString("utf-8");
        return JSON.parse(decoded) as Record<string, unknown>;
    } catch {
        return {};
    }
}

function createError(message: string, step: number, statusCode: number, url?: string): LoginError {
    const err = new Error(message) as LoginError;
    err.step = step;
    err.statusCode = statusCode;
    err.url = url;
    return err;
}

export async function login(msAccessToken: string, onProgress?: (step: number) => void): Promise<LoginResult> {
    const steps = {
        XBOX_AUTH: 2,
        XSTS_AUTH: 3,
        MC_ACCESS_TOKEN: 4,
        CHECK_ELIGIBILITY: 5,
        MC_PROFILE: 6,
    };

    onProgress?.(steps.XBOX_AUTH);

    const msJwtPayload = decodeJwtPayload(msAccessToken);
    plogDebug("Microsoft token decoded", {
        aud: msJwtPayload.aud,
        iss: msJwtPayload.iss,
        scp: msJwtPayload.scp,
        roles: msJwtPayload.roles,
        nbf: msJwtPayload.nbf,
        exp: msJwtPayload.exp,
    });

    const tokenPrefix = msAccessToken.slice(0, 16);
    const tokenLen = msAccessToken.length;
    plogDebug("Xbox Live RPS auth starting", { tokenPrefix, tokenLen });

    const xboxResp = await invokeJsonRaw(XBOX_AUTH_URL, {
        Properties: {
            AuthMethod: "RPS",
            SiteName: "user.auth.xboxlive.com",
            RpsTicket: `d=${msAccessToken}`,
        },
        RelyingParty: "http://auth.xboxlive.com",
        TokenType: "JWT",
    });

    const xboxData = await safeJson(xboxResp);

    if (!xboxResp.ok) {
        plogDebug("Xbox Live authentication failed", {
            status: xboxResp.status,
            errorDesc: xboxData.error_description as string | undefined,
            error: xboxData.error as string | undefined,
            message: xboxData.message as string | undefined,
        });
        throw createError(
            (xboxData.error_description as string) || (xboxData.message as string) || "Xbox Live authentication failed",
            steps.XBOX_AUTH,
            xboxResp.status,
            XBOX_AUTH_URL
        );
    }

    const xboxToken: string = xboxData.Token as string;
    const xboxUhs1: string = (xboxData.DisplayClaims as { xui: Array<{ uhs: string }> }).xui[0].uhs;

    plogDebug("Xbox Live token acquired", {
        hasToken: !!xboxToken,
        uhs: xboxUhs1.slice(0, 12),
        tokenLen: xboxToken.length,
    });

    onProgress?.(steps.XSTS_AUTH);

    const xstsResp = await invokeJsonRaw(XSTS_AUTH_URL, {
        Properties: {
            SandboxId: "RETAIL",
            UserTokens: [xboxToken],
        },
        RelyingParty: "rp://api.minecraftservices.com/",
        TokenType: "JWT",
    });

    const xstsData = await safeJson(xstsResp);

    if (!xstsResp.ok) {
        plogDebug("XSTS authentication failed", {
            status: xstsResp.status,
            errorDesc: xstsData.error_description as string | undefined,
            error: xstsData.error as string | undefined,
            message: xstsData.message as string | undefined,
            xErr: xstsData.XErr as number | undefined,
        });
        throw createError(
            (xstsData.error_description as string) || (xstsData.message as string) || "XSTS token acquisition failed",
            steps.XSTS_AUTH,
            xstsResp.status,
            XSTS_AUTH_URL
        );
    }

    const xstsToken: string = xstsData.Token as string;
    const xboxUhs2: string = (xstsData.DisplayClaims as { xui: Array<{ uhs: string }> }).xui[0].uhs;

    if (xboxUhs1 !== xboxUhs2) {
        throw createError("Invalid UHS is responded from Xbox Service", steps.XSTS_AUTH, xstsResp.status, XSTS_AUTH_URL);
    }

    plogDebug("XSTS token acquired", {
        hasToken: !!xstsToken,
        uhs: xboxUhs2.slice(0, 12),
        tokenLen: xstsToken.length,
    });

    onProgress?.(steps.MC_ACCESS_TOKEN);

    // 关键修复：正确构造 identityToken
    const identityToken = `XBL3.0 x=${xboxUhs1};${xstsToken}`;

    plogDebug("Minecraft login_with_xbox request", {
        url: MC_ACCESS_TOKEN_URL,
        identityTokenLen: identityToken.length,
        identityTokenPrefix: identityToken.slice(0, 40),
    });

    const accessTokenResp = await invokeJsonRaw(MC_ACCESS_TOKEN_URL, {
        identityToken,
    });

    const accessTokenText = await accessTokenResp.text();
    let accessTokenData: Record<string, unknown> = {};
    try {
        if (accessTokenText) {
            accessTokenData = JSON.parse(accessTokenText) as Record<string, unknown>;
        }
    } catch {
        accessTokenData = {};
    }

    if (!accessTokenResp.ok) {
        const responseHeaders: Record<string, string> = {};
        accessTokenResp.headers.forEach((val, key) => {
            responseHeaders[key] = val;
        });
        plogDebug("Minecraft login_with_xbox failed", {
            status: accessTokenResp.status,
            error: accessTokenData.error as string | undefined,
            errorDesc: accessTokenData.error_description as string | undefined,
            message: accessTokenData.message as string | undefined,
            responseHeaders,
            raw: accessTokenText.slice(0, 500),
        });
        throw createError(
            (accessTokenData.error_description as string) ||
                (accessTokenData.message as string) ||
                "Minecraft Access Token acquisition failed",
            steps.MC_ACCESS_TOKEN,
            accessTokenResp.status,
            MC_ACCESS_TOKEN_URL
        );
    }

    const mcAccessToken: string = accessTokenData.access_token as string;

    if (!mcAccessToken) {
        plogDebug("Minecraft login_with_xbox missing access_token", {
            keys: Object.keys(accessTokenData),
            raw: accessTokenText.slice(0, 500),
        });
        throw createError("Minecraft Access Token missing in response", steps.MC_ACCESS_TOKEN, 502, MC_ACCESS_TOKEN_URL);
    }

    plogDebug("Minecraft access token acquired", {
        tokenLen: mcAccessToken.length,
        tokenPrefix: mcAccessToken.slice(0, 16),
    });

    onProgress?.(steps.CHECK_ELIGIBILITY);

    const eligibilityResp = await invokeJsonRaw(
        MC_ELIGIBILITY_URL,
        {},
        {
            Authorization: `Bearer ${mcAccessToken}`,
        },
        "GET"
    );

    const eligibilityData = await safeJson(eligibilityResp);

    // 修复：应检查 Response 的 ok 属性
    if (!eligibilityResp.ok) {
        throw createError(
            "Minecraft entitlement check failed",
            steps.CHECK_ELIGIBILITY,
            eligibilityResp.status,
            MC_ELIGIBILITY_URL
        );
    }

    type Items = Array<{ name: string; signature: string }>;
    const eligibleItems: Items = (eligibilityData.items as Items) ?? [];

    let hasProduct = false;
    let hasGame = false;

    eligibleItems.forEach((item) => {
        if (item.name === "product_minecraft") hasProduct = true;
        if (item.name === "game_minecraft") hasGame = true;
    });

    if (!hasProduct || !hasGame) {
        throw createError(
            "Minecraft entitlement check failed: no valid purchased minecraft",
            steps.CHECK_ELIGIBILITY,
            eligibilityResp.status,
            MC_ELIGIBILITY_URL
        );
    }

    onProgress?.(steps.MC_PROFILE);

    const mcResp = await fetch(MC_PROFILE_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${mcAccessToken}`,
        },
    });

    const mcData = await safeJson(mcResp);

    if (!mcResp.ok) {
        throw createError(
            (mcData.error_description as string) || (mcData.message as string) || "Minecraft profile acquisition failed",
            steps.MC_PROFILE,
            mcResp.status,
            MC_PROFILE_URL
        );
    }

    const uuid: string = mcData.id as string;
    const name: string = mcData.name as string;

    if (!uuid || !name) {
        throw createError("Minecraft profile missing id or name", steps.MC_PROFILE, 502, MC_PROFILE_URL);
    }

    return { uuid, name };
}
