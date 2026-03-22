// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import axios, { AxiosError } from "axios";
import * as Msa from "@/types/msa";

/**
 * Microsoft OAuth 登录（Minecraft Java Edition）
 * 使用 Axios 实现，仅返回最终的 UUID
 */
export async function login(
    key: { code?: string; refresh_token?: string },
    grant_type: string,
    updateStepFn: (step: number) => void
): Promise<string> {
    const $env = process.env;

    const payload = key.code ? { code: key.code } : key.refresh_token ? { refresh_token: key.refresh_token } : {};

    let accessToken: string;
    let uhs: string;
    let mcAccessToken: string;

    try {
        // ==================== Step 1: MSA Token ====================
        updateStepFn(1);
        const msaResp = await axios.post(
            "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
            new URLSearchParams({
                client_id: $env.NEXT_PUBLIC_MSAUTH_CLIENT_ID,
                client_secret: $env.MSAUTH_CLIENT_SECRET,
                redirect_uri: $env.NEXT_PUBLIC_MSAUTH_REDIRECT_URI,
                ...payload,
                grant_type,
                scope: "XboxLive.signin offline_access",
            }),
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const msaData = msaResp.data as Msa.MsaTokenSuccess;
        if (msaData.error) {
            throw new Error(msaData.error_description || "MSA token error");
        }

        accessToken = msaData.access_token;

        // ==================== Step 2: XBL Token ====================
        updateStepFn(2);
        const xblResp = await axios
            .post(
                "https://user.auth.xboxlive.com/user/authenticate",
                {
                    Properties: {
                        AuthMethod: "RPS",
                        SiteName: "user.auth.xboxlive.com",
                        RpsTicket: `d=${accessToken}`,
                    },
                    RelyingParty: "http://auth.xboxlive.com",
                    TokenType: "JWT",
                },
                { headers: { "Content-Type": "application/json" } }
            )
            .catch(async () => {
                // 兼容旧版微软行为（不带 d= 前缀）
                return await axios.post(
                    "https://user.auth.xboxlive.com/user/authenticate",
                    {
                        Properties: {
                            AuthMethod: "RPS",
                            SiteName: "user.auth.xboxlive.com",
                            RpsTicket: accessToken,
                        },
                        RelyingParty: "http://auth.xboxlive.com",
                        TokenType: "JWT",
                    },
                    { headers: { "Content-Type": "application/json" } }
                );
            });

        const xblData = xblResp.data as Msa.XblTokenSuccess;
        const XBL_TOKEN = xblData.Token;
        uhs = xblData.DisplayClaims.xui[0].uhs;

        // ==================== Step 3: XSTS Token ====================
        updateStepFn(3);
        const xstsResp = await axios.post(
            "https://xsts.auth.xboxlive.com/xsts/authorize",
            {
                Properties: {
                    SandboxId: "RETAIL",
                    UserTokens: [XBL_TOKEN],
                },
                RelyingParty: "rp://api.minecraftservices.com/",
                TokenType: "JWT",
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const xstsData = xstsResp.data as Msa.XstsTokenSuccess;
        if (xstsData.DisplayClaims.xui[0].uhs !== uhs) {
            throw new Error("UHS mismatch between XBL and XSTS");
        }

        // ==================== Step 4: Minecraft Token ====================
        updateStepFn(4);
        const mcResp = await axios.post(
            "https://api.minecraftservices.com/authentication/login_with_xbox",
            {
                identityToken: `XBL3.0 x=${uhs};${xstsData.Token}`,
            },
            { headers: { "Content-Type": "application/json" } }
        );

        const mcData = mcResp.data as Msa.MinecraftTokenResponse;
        if ("errorMessage" in mcData) {
            throw new Error(mcData.errorMessage);
        }

        mcAccessToken = mcData.access_token;

        // ==================== Step 5: Profile（仅获取 UUID） ====================
        updateStepFn(5);
        const profileResp = await axios.get("https://api.minecraftservices.com/minecraft/profile", {
            headers: {
                Authorization: `Bearer ${mcAccessToken}`,
            },
        });

        const profileData = profileResp.data as Msa.MinecraftProfileSuccess;

        // 将不带横线的 UUID 转为标准格式
        const uuid = profileData.id.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, "$1-$2-$3-$4-$5");

        return uuid;
    } catch (error) {
        const err = error as AxiosError<unknown>;

        let message = "Unknown error";
        let step = 1;

        if (err.response?.data) {
            const data = err.response.data;
            message = data.error_description || data.errorMessage || data.errorType || message;
        } else if (err.message) {
            message = err.message;
        }

        // 根据错误发生的大致阶段推断 step（可根据实际需求进一步细化）
        if (err.config?.url?.includes("xboxlive.com")) step = 2;
        else if (err.config?.url?.includes("xsts.auth")) step = 3;
        else if (err.config?.url?.includes("login_with_xbox")) step = 4;
        else if (err.config?.url?.includes("/minecraft/profile")) step = 5;

        throw new Error(JSON.stringify({ message, err: err.response?.status ?? -1, step }));
    }
}
