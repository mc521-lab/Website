"use client";

import * as React from "react";
import { Radix } from "@/components";
import { ClipboardIcon, CheckCircleIcon, ClipboardCheckIcon, XCircleIcon } from "lucide-react";

interface MinecraftVerifyResultCardProps {
    status: "success" | "failure";
    attemptRecordId: string;
    successRecordId: string; // 成功时才有
    onRestart: () => void;
}

const MinecraftVerifyResultCard: React.FC<MinecraftVerifyResultCardProps> = ({ status, attemptRecordId, successRecordId, onRestart }) => {
    const [copiedAttempt, setCopiedAttempt] = React.useState(false);
    const [copiedSuccess, setCopiedSuccess] = React.useState(false);

    const copyToClipboard = (text: string, type: "attempt" | "success") => {
        navigator.clipboard.writeText(text).then(() => {
            if (type === "attempt") setCopiedAttempt(true);
            if (type === "success") setCopiedSuccess(true);

            // 1.5秒后恢复
            setTimeout(() => {
                if (type === "attempt") setCopiedAttempt(false);
                if (type === "success") setCopiedSuccess(false);
            }, 1500);
        });
    };

    const isSuccess = status === "success";

    return (
        <Radix.Card className="mt-8 w-full max-w-md border">
            <Radix.CardHeader>
                <Radix.CardTitle className="flex items-center gap-2">
                    {isSuccess ? <CheckCircleIcon className="text-green-500" /> : <XCircleIcon className="text-destructive" />}
                    {isSuccess ? "验证成功" : "验证失败"}
                </Radix.CardTitle>
                <Radix.CardDescription>
                    {isSuccess ? "恭喜！你的正版称号资格已验证成功。" : "验证未通过，请确认是否登录了正确的微软账户。"}
                </Radix.CardDescription>
            </Radix.CardHeader>

            <Radix.CardContent className="flex flex-col gap-4">
                <div
                    className="flex cursor-pointer items-center justify-between rounded border p-2"
                    onClick={() => copyToClipboard(attemptRecordId, "attempt")}>
                    <span>尝试记录 ID:</span>
                    <span className="font-mono">{attemptRecordId}</span>
                    {copiedAttempt ? <ClipboardCheckIcon className="size-4" /> : <ClipboardIcon className="size-4" />}
                </div>

                {isSuccess && successRecordId && (
                    <div
                        className="flex cursor-pointer items-center justify-between rounded border p-2"
                        onClick={() => copyToClipboard(successRecordId, "success")}>
                        <span>成功记录 ID:</span>
                        <span className="font-mono">{successRecordId}</span>
                        {copiedSuccess ? <ClipboardCheckIcon className="size-4" /> : <ClipboardIcon className="size-4" />}
                    </div>
                )}

                <p className="text-sm opacity-90">
                    {isSuccess ? "请将成功记录 ID 提供给管理员兑换正版称号。" : "如需咨询为何验证失败，请将尝试记录 ID 提供给管理员。"}
                </p>
            </Radix.CardContent>
            <Radix.CardFooter>
                <Radix.Button onClick={onRestart}>重启验证流程</Radix.Button>
            </Radix.CardFooter>
        </Radix.Card>
    );
};

export { MinecraftVerifyResultCard };
