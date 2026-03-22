"use client";

import { Radix } from "@/components";
import { openCentered } from "@/lib/utils";
import { ZhengbanSlice } from "@/views";
import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function ToolboxZhengban() {
    const [playername, setPlayername] = useState("");
    const [terms, setTerms] = useState(false);
    const [loading, setLoading] = useState(false);

    const codeRef = useRef<string>("");
    const [finished, setFinished] = useState(false);
    const [successful, setSuccessful] = useState(false);
    const [attemptRecordId, setAttemptRecordId] = useState<string | null>(null);
    const [successRecordId, setSuccessRecordId] = useState<string | null>(null);

    const $env = process.env;
    const LOGIN_URI =
        "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?" +
        new URLSearchParams({
            client_id: $env.NEXT_PUBLIC_MSAUTH_CLIENT_ID as string,
            response_type: "code",
            redirect_uri: $env.NEXT_PUBLIC_MSAUTH_REDIRECT_URI as string,
            response_mode: "query",
            scope: "XboxLive.signin offline_access",
        }).toString();

    function restartVerify() {
        setLoading(false);
        setFinished(false);
        setSuccessful(false);
        setAttemptRecordId(null);
        setSuccessRecordId(null);
    }

    function launchLogin() {
        setLoading(true);
        openCentered(LOGIN_URI, 1024, 768);
    }
    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            const { code, error } = event.data;
            if (code) {
                codeRef.current = code;
                try {
                    // ================== 第一步：调用 verify API 获取 UUID ==================
                    const verifyRes = await fetch("/api/mc-genuine/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ code }),
                    });
                    const verifyData = await verifyRes.json();
                    if (verifyData.success && verifyData.uuid) {
                        // ================== 第二步：调用 submit API 提交验证结果 ==================
                        const submitRes = await fetch("/api/mc-genuine/submit", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                playerName: playername,
                                playerUuid: verifyData.uuid,
                                successful: true,
                            }),
                        });
                        const submitData = await submitRes.json();
                        if (submitData.success) {
                            setAttemptRecordId(submitData.attemptRecordId);
                            setSuccessRecordId(submitData.successRecordId);
                            setFinished(true);
                            setSuccessful(true);
                        } else {
                            console.error("提交验证结果失败:", submitData.error);
                            setFinished(true);
                            setSuccessful(false);
                        }
                    } else {
                        console.error("登录失败:", verifyData.error);
                        const error = JSON.parse(verifyData.error);
                        const errorDict = {
                            4: "PROFILE_NOT_FOUND",
                            5: "NOT_PURCHASED",
                        };
                        // 如果失败，也可以提交失败记录
                        const submitRes = await fetch("/api/mc-genuine/submit", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                playerName: playername,
                                successful: false,
                                failureReason: errorDict[error.step as keyof typeof errorDict] || "UNKNOWN_ERR",
                            }),
                        });
                        const submitData = await submitRes.json();
                        setAttemptRecordId(submitData.attemptRecordId);
                        setFinished(true);
                        setSuccessful(false);
                    }
                } catch (err) {
                    console.error("调用 /api/mc-genuine/verify 或 /submit 出错:", err);
                    setFinished(true);
                    setSuccessful(false);
                } finally {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false);
                console.error("登录失败:", error);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [playername]);

    return (
        <main className="pixel-font flex h-[calc(100vh-61px)] w-full translate-y-15.25 flex-col items-center justify-center">
            <h1 className="text-center text-4xl font-bold">正版称号验证</h1>

            {/* Before Result */}
            {!finished ? (
                <ZhengbanSlice.MinecraftVerifyCard
                    loading={loading}
                    playername={playername}
                    setPlayername={setPlayername}
                    terms={terms}
                    setTerms={setTerms}
                    onLaunchLogin={launchLogin}
                />
            ) : (
                <ZhengbanSlice.MinecraftVerifyResultCard
                    status={successful ? "success" : "failure"}
                    successRecordId={successRecordId || ""}
                    attemptRecordId={attemptRecordId || ""}
                    onRestart={restartVerify}
                />
            )}

            {/* Tip Card (Always Display) */}
            <Radix.Card className="mt-8 w-full max-w-md">
                <Radix.CardHeader>
                    <Radix.CardTitle>友情提示</Radix.CardTitle>
                </Radix.CardHeader>
                <Radix.CardContent>
                    正版账号验证服务由 NEXORA Hub 提供
                    <br />
                    请在验证前确认你已经购买正版账号，且使用了正确的账户登录本平台服务
                    <br />
                    验证步骤开始后，请授权 NEXORA Hub 访问您的 Microsoft 账户
                    <Radix.Separator className="mt-2" />
                    <span>
                        如果您曾经登录了错误的微软账户，请先
                        <Link href="https://login.live.com/logout.srf" target="_blank">
                            <Radix.Button className="-ml-1 cursor-pointer" variant="link">
                                退出当前登录
                                <ExternalLinkIcon className="-ml-px size-3" />
                            </Radix.Button>
                        </Link>
                    </span>
                </Radix.CardContent>
            </Radix.Card>
        </main>
    );
}
