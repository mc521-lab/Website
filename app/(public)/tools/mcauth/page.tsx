"use client";

import { verifyCode, submitResult, checkExisting, openCentered } from "@/lib/mcauth";
import Link from "next/link";
import { ExternalLinkIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const LOGIN_URI =
    "https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?" +
    new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_MSAUTH_CLIENT_ID as string,
        response_type: "code",
        redirect_uri: process.env.NEXT_PUBLIC_MSAUTH_REDIRECT_URI as string,
        response_mode: "query",
        scope: "XboxLive.signin offline_access",
    }).toString();

type VerifyResult = {
    status: "success" | "failure";
    accountXuid?: string;
    accountName?: string;
    hasValidMcje?: boolean;
    invalidReason?: string | null;
};

export default function McauthVerifyPage() {
    const [accountName, setAccountName] = useState("");
    const [hasAgreed, setHasAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(false);
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState<VerifyResult | null>(null);

    function restart() {
        setLoading(false);
        setCheckingExisting(false);
        setFinished(false);
        setResult(null);
        setAccountName("");
        setHasAgreed(false);
    }

    async function launchLogin() {
        if (!accountName.trim()) {
            toast.error("请输入玩家名称");
            return;
        }
        if (!hasAgreed) {
            toast.error("请先同意服务条款");
            return;
        }

        setCheckingExisting(true);

        try {
            const checkRes = await checkExisting({ accountXuid: accountName.trim() });
            if (checkRes.success && checkRes.exists && checkRes.record) {
                setResult({
                    status: checkRes.record.hasValidMcje ? "success" : "failure",
                    accountXuid: checkRes.record.accountXuid,
                    accountName: checkRes.record.accountName,
                    hasValidMcje: checkRes.record.hasValidMcje,
                    invalidReason: checkRes.record.invalidReason,
                });
                setFinished(true);
                setCheckingExisting(false);
                return;
            }
        } catch {
            // ignore errors for check-existing, proceed with login
        }

        setCheckingExisting(false);
        setLoading(true);
        openCentered(LOGIN_URI, 1024, 768);
    }

    useEffect(() => {
        const handleMessage = async (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            const { code, error } = event.data;
            if (code) {
                try {
                    const verifyRes = await verifyCode({ code });
                    if (verifyRes.success && verifyRes.accountXuid) {
                        const isValid = !!verifyRes.hasValidMcje;
                        const submitRes = await submitResult({
                            accountXuid: verifyRes.accountXuid,
                            accountName: accountName.trim(),
                            hasValidMcje: isValid,
                            invalidReason: isValid ? null : (verifyRes.error ?? null),
                        });
                        if (submitRes.success) {
                            setResult({
                                status: isValid ? "success" : "failure",
                                accountXuid: verifyRes.accountXuid,
                                accountName: verifyRes.accountName ?? accountName,
                                hasValidMcje: isValid,
                                invalidReason: isValid ? null : (verifyRes.error ?? null),
                            });
                            setFinished(true);
                        } else {
                            toast.error("提交验证结果失败");
                            setResult({ status: "failure", invalidReason: "SUBMIT_FAILED" });
                            setFinished(true);
                        }
                    } else {
                        toast.error("登录验证失败");
                        const errCode = verifyRes.error;
                        const reasonMap: Record<string, string> = {
                            "4": "PROFILE_NOT_FOUND",
                            "5": "NOT_PURCHASED",
                        };
                        setResult({
                            status: "failure",
                            invalidReason: errCode ? (reasonMap[errCode] ?? errCode) : "UNKNOWN_ERR",
                        });
                        setFinished(true);
                    }
                } catch {
                    toast.error("验证流程出错");
                    setResult({ status: "failure", invalidReason: "NETWORK_ERROR" });
                    setFinished(true);
                } finally {
                    setLoading(false);
                }
            } else if (error) {
                setLoading(false);
                toast.error("登录被取消或失败");
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [accountName]);

    return (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 px-4">
            <h1 className="font-heading text-foreground text-center text-3xl font-bold">正版称号验证</h1>

            {!finished ? (
                <VerifyCard
                    loading={loading}
                    checkingExisting={checkingExisting}
                    accountName={accountName}
                    setAccountName={setAccountName}
                    hasAgreed={hasAgreed}
                    setHasAgreed={setHasAgreed}
                    onLaunchLogin={launchLogin}
                />
            ) : (
                <ResultCard result={result!} onRestart={restart} />
            )}

            <div className="border-foreground/8 bg-background/25 w-full max-w-lg rounded-xl border p-5 text-sm">
                <h2 className="font-heading text-foreground mb-2 text-base font-bold">友情提示</h2>
                <p className="text-foreground/70 space-y-1">
                    正版账号验证服务由 NEXORA Hub 提供
                    <br />
                    请在验证前确认你已经购买正版账号，且使用了正确的账户登录本平台服务
                    <br />
                    验证步骤开始后，请授权 NEXORA Hub 访问您的 Microsoft 账户
                </p>
                <div className="border-foreground/8 my-3 border-t" />
                <span className="text-foreground/70 flex gap-[0.5ch]">
                    如果您曾经登录了错误的微软账户，请先
                    <div className="text-primary border-primary flex border-b hover:opacity-80">
                        <Link href="https://login.live.com/logout.srf" target="_blank">
                            退出当前登录
                        </Link>
                        <ExternalLinkIcon className="text-primary size-3 translate-y-0.5" />
                    </div>
                </span>
            </div>
        </div>
    );
}

function VerifyCard({
    loading,
    checkingExisting,
    accountName,
    setAccountName,
    hasAgreed,
    setHasAgreed,
    onLaunchLogin,
}: {
    loading: boolean;
    checkingExisting: boolean;
    accountName: string;
    setAccountName: (v: string) => void;
    hasAgreed: boolean;
    setHasAgreed: (v: boolean) => void;
    onLaunchLogin: () => void;
}) {
    return (
        <div className="border-foreground/8 bg-background/25 w-full max-w-lg rounded-xl border p-6 shadow-sm">
            {loading || checkingExisting ? (
                <div className="flex flex-col items-center gap-4 py-8">
                    <Loader2 size={32} className="text-primary animate-spin" />
                    <p className="text-foreground/70 text-sm">
                        {checkingExisting ? "正在检查已有验证..." : "正在打开 Microsoft 登录窗口..."}
                    </p>
                    <p className="text-foreground/50 text-xs">{loading ? "请在弹出的窗口中完成登录" : ""}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="accountName" className="text-foreground/80 text-sm font-medium">
                            玩家名称
                        </label>
                        <input
                            id="accountName"
                            type="text"
                            value={accountName}
                            onChange={(e) => setAccountName(e.target.value)}
                            placeholder="输入你的 Minecraft 玩家名称"
                            className="border-input bg-background/50 text-foreground placeholder:text-foreground/40 focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 py-1 text-sm outline-none focus-visible:ring-2"
                        />
                    </div>

                    <label className="text-foreground/70 flex items-start gap-2 text-sm">
                        <input
                            type="checkbox"
                            checked={hasAgreed}
                            onChange={(e) => setHasAgreed(e.target.checked)}
                            className="border-input bg-background accent-primary mt-0.5 size-4 rounded"
                        />
                        <span>
                            我已确认此账号为本人所有，且已购买 Minecraft 正版。
                            <br />
                            <span className="text-foreground/50">验证过程将获取你的 Microsoft 账户信息用于验证。</span>
                        </span>
                    </label>

                    <Button onClick={onLaunchLogin} className="w-full">
                        开始验证
                    </Button>
                </div>
            )}
        </div>
    );
}

function ResultCard({ result, onRestart }: { result: VerifyResult; onRestart: () => void }) {
    const isSuccess = result.status === "success";

    return (
        <div
            className={`w-full max-w-lg rounded-xl border p-6 shadow-sm ${
                isSuccess ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
            }`}>
            <div className="flex flex-col items-center gap-4 py-2">
                <div
                    className={`flex size-16 items-center justify-center rounded-full ${
                        isSuccess ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                    {isSuccess ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-8">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-8">
                            <circle cx="12" cy="12" r="10" />
                            <path d="m15 9-6 6" />
                            <path d="m9 9 6 6" />
                        </svg>
                    )}
                </div>

                <h2 className={`font-heading text-xl font-bold ${isSuccess ? "text-green-400" : "text-red-400"}`}>
                    {isSuccess ? "验证成功" : "验证失败"}
                </h2>

                <div className="text-foreground/70 space-y-2 text-center text-sm">
                    {result.accountName && (
                        <p>
                            玩家名称: <strong className="text-foreground">{result.accountName}</strong>
                        </p>
                    )}
                    {result.accountXuid && <p className="text-foreground/60 font-mono text-xs">XUID: {result.accountXuid}</p>}
                    {!isSuccess && result.invalidReason && (
                        <p className="text-red-400">失败原因: {getFailureReasonText(result.invalidReason)}</p>
                    )}
                    {isSuccess && <p className="text-foreground/60">你已成功获得正版玩家身份！</p>}
                </div>

                <Button variant="outline" onClick={onRestart} className="mt-2">
                    重新验证
                </Button>
            </div>
        </div>
    );
}

function getFailureReasonText(reason: string): string {
    const map: Record<string, string> = {
        PROFILE_NOT_FOUND: "未找到玩家档案",
        NOT_PURCHASED: "此账户未购买 Minecraft",
        SUBMIT_FAILED: "提交结果失败",
        NETWORK_ERROR: "网络连接错误",
    };
    return map[reason] ?? reason;
}

