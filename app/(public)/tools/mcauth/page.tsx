"use client";

import {
    verifyCode,
    submitResult,
    checkExisting,
    requestDeviceCode,
    pollDeviceToken,
    copyToClipboard,
    type DeviceCodeResponse,
} from "@/lib/api";
import Link from "next/link";
import { ExternalLinkIcon, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type VerifyResult = {
    status: "success" | "failure";
    accountXuid?: string;
    accountName?: string;
    hasValidMcje?: boolean;
    illegal?: boolean;
    invalidReason?: string | null;
};

export default function McauthVerifyPage() {
    const [accountName, setAccountName] = useState("");
    const [hasAgreed, setHasAgreed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checkingExisting, setCheckingExisting] = useState(false);
    const [finished, setFinished] = useState(false);
    const [result, setResult] = useState<VerifyResult | null>(null);

    const [deviceCode, setDeviceCode] = useState<DeviceCodeResponse | null>(null);
    const [authorizing, setAuthorizing] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [copied, setCopied] = useState(false);
    const pollingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const authorizingRef = useRef(false);

    const stopAllTimers = useCallback(() => {
        if (pollingTimerRef.current) {
            clearTimeout(pollingTimerRef.current);
            pollingTimerRef.current = null;
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
    }, []);

    const restart = useCallback(() => {
        stopAllTimers();
        setLoading(false);
        setCheckingExisting(false);
        setFinished(false);
        setResult(null);
        setAccountName("");
        setHasAgreed(false);
        setDeviceCode(null);
        setAuthorizing(false);
        setCountdown(0);
        setCopied(false);
        authorizingRef.current = false;
    }, [stopAllTimers]);

    const handleFailure = useCallback(
        (reason: string) => {
            stopAllTimers();
            setAuthorizing(false);
            authorizingRef.current = false;
            setResult({ status: "failure", invalidReason: reason });
            setFinished(true);
            setLoading(false);
        },
        [stopAllTimers]
    );

    const handleAuthorized = useCallback(
        async (msAccessToken: string) => {
            stopAllTimers();
            setAuthorizing(false);
            authorizingRef.current = false;
            setLoading(true);

            try {
                const verifyRes = await verifyCode({ msAccessToken });
                if (verifyRes.success && verifyRes.accountXuid) {
                    const isValid = !!verifyRes.hasValidMcje;

                    if (verifyRes.error === "HEIMDALL_FAILURE") {
                        setResult({
                            status: "failure",
                            accountXuid: verifyRes.accountXuid,
                            accountName: verifyRes.accountName ?? accountName,
                            hasValidMcje: false,
                            illegal: true,
                            invalidReason: "HEIMDALL_FAILURE",
                        });
                        setFinished(true);
                    } else {
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
                    }
                } else {
                    toast.error("登录验证失败");
                    const errCode = verifyRes.error;
                    const reasonMap: Record<string, string> = {
                        PROFILE_NOT_FOUND: "PROFILE_NOT_FOUND",
                        NOT_PURCHASED: "NOT_PURCHASED",
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
        },
        [accountName, stopAllTimers]
    );

    const startPolling = useCallback(
        (deviceCodeValue: string, interval: number) => {
            const pollOnce = async () => {
                if (!authorizingRef.current) return;

                try {
                    const pollResult = await pollDeviceToken(deviceCodeValue);

                    if (pollResult.status === "success" && pollResult.access_token) {
                        authorizingRef.current = false;
                        handleAuthorized(pollResult.access_token);
                        return;
                    }

                    if (pollResult.status === "pending" || pollResult.status === "slow_down") {
                        const nextDelay = pollResult.status === "slow_down" ? interval + 5 : interval;
                        pollingTimerRef.current = setTimeout(pollOnce, nextDelay * 1000);
                        return;
                    }
                } catch (err) {
                    const msg = err instanceof Error ? err.message : String(err);
                    if (msg.includes("授权被拒绝")) {
                        handleFailure("AUTHORIZATION_DECLINED");
                        return;
                    }
                    if (msg.includes("过期")) {
                        handleFailure("CODE_EXPIRED");
                        return;
                    }
                    if (msg.includes("无效")) {
                        handleFailure("INVALID_CODE");
                        return;
                    }
                    pollingTimerRef.current = setTimeout(pollOnce, interval * 1000);
                }
            };

            pollingTimerRef.current = setTimeout(pollOnce, interval * 1000);
        },
        [handleAuthorized, handleFailure]
    );

    const launchDeviceCodeFlow = useCallback(async () => {
        try {
            const dc = await requestDeviceCode();
            setDeviceCode(dc);
            setCountdown(dc.expires_in);
            setAuthorizing(true);
            authorizingRef.current = true;

            countdownTimerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        if (countdownTimerRef.current) {
                            clearInterval(countdownTimerRef.current);
                            countdownTimerRef.current = null;
                        }
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            startPolling(dc.device_code, dc.interval);
        } catch {
            toast.error("获取设备码失败");
            setLoading(false);
        }
    }, [startPolling]);

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
        } catch (err) {
            toast.warning("检查玩家称号失败:" + (err instanceof Error ? err.message : String(err)));
            // ignore errors for check-existing, proceed with login
        }

        setCheckingExisting(false);
        setLoading(true);
        launchDeviceCodeFlow();
    }

    const handleCopyCode = async () => {
        if (!deviceCode) return;
        await copyToClipboard(deviceCode.user_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    useEffect(() => {
        return () => {
            stopAllTimers();
        };
    }, [stopAllTimers]);

    useEffect(() => {
        if (countdown === 0 && authorizing) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            handleFailure("CODE_EXPIRED");
        }
    }, [countdown, authorizing, handleFailure]);

    return (
        <div className="flex h-full flex-1 flex-col items-center justify-center gap-6 px-4">
            <h1 className="font-heading text-foreground text-center text-3xl font-bold">正版称号验证</h1>

            {!finished ? (
                authorizing && deviceCode ? (
                    <DeviceCodeCard
                        deviceCode={deviceCode}
                        countdown={countdown}
                        copied={copied}
                        onCopyCode={handleCopyCode}
                        onCancel={restart}
                    />
                ) : (
                    <VerifyCard
                        loading={loading}
                        checkingExisting={checkingExisting}
                        accountName={accountName}
                        setAccountName={setAccountName}
                        hasAgreed={hasAgreed}
                        setHasAgreed={setHasAgreed}
                        onLaunchLogin={launchLogin}
                    />
                )
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
                    验证步骤开始后，请在浏览器中打开授权页面并输入显示的代码
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
                        {checkingExisting ? "正在检查已有验证..." : "正在准备设备码..."}
                    </p>
                    {!checkingExisting && <p className="text-foreground/50 text-xs">即将生成授权码，请稍候</p>}
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

function DeviceCodeCard({
    deviceCode,
    countdown,
    copied,
    onCopyCode,
    onCancel,
}: {
    deviceCode: DeviceCodeResponse;
    countdown: number;
    copied: boolean;
    onCopyCode: () => void;
    onCancel: () => void;
}) {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;

    return (
        <div className="border-foreground/8 bg-background/25 w-full max-w-lg rounded-xl border p-6 shadow-sm">
            <div className="flex flex-col items-center gap-5 py-2">
                <CheckCircle2 size={32} className="text-primary" />
                <h2 className="font-heading text-xl font-bold">请在浏览器中完成授权</h2>

                <div className="text-foreground/70 text-center text-sm">
                    请在另一个浏览器窗口中访问以下地址，并输入下方代码：
                </div>

                <a
                    href={deviceCode.verification_uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary border-primary flex items-center gap-1 border-b text-sm hover:opacity-80">
                    {deviceCode.verification_uri}
                    <ExternalLinkIcon className="size-3" />
                </a>

                <div
                    className="border-foreground/8 bg-background/40 flex w-full max-w-xs cursor-pointer items-center justify-between rounded-lg border p-4"
                    onClick={onCopyCode}>
                    <span className="text-foreground font-mono text-2xl font-bold tracking-widest">{deviceCode.user_code}</span>
                    <button className="text-foreground/60 hover:text-foreground transition-colors" title="复制代码">
                        {copied ? <CheckCircle2 size={20} className="text-green-400" /> : <Copy size={20} />}
                    </button>
                </div>

                <div className="text-foreground/50 flex items-center gap-2 text-xs">
                    <Loader2 size={14} className="text-primary animate-spin" />
                    <span>
                        等待授权中... 代码有效期 {minutes}:{String(seconds).padStart(2, "0")}
                    </span>
                </div>

                <Button variant="outline" onClick={onCancel} className="mt-2">
                    取消
                </Button>
            </div>
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
        AUTHORIZATION_DECLINED: "授权被拒绝",
        CODE_EXPIRED: "授权码已过期，请重新验证",
        INVALID_CODE: "无效的授权码",
        VERIFICATION_FAILED: "验证失败",
        SUBMIT_FAILED: "提交结果失败",
        NETWORK_ERROR: "网络连接错误",
        HEIMDALL_FAILURE: "未通过 Minecraft 反黑卡验证",
    };
    return map[reason] ?? reason;
}
