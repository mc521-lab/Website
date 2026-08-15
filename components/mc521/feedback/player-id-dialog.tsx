"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ensureSession, getUrl } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound, RefreshCcw } from "lucide-react";

const STORAGE_KEY = "mc521_feedback_player_id";

async function warmFeedbackSession(playerId: string): Promise<void> {
    await ensureSession();
    const response = await fetch(getUrl("/api/feedbacks/me", { playerId }), {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
        throw new Error(`会话建立失败 (${response.status})`);
    }

    await response.text();
}

export function PlayerIdDialog() {
    const [open, setOpen] = useState(false);
    const [playerId, setPlayerId] = useState("");
    const [savedPlayerId, setSavedPlayerId] = useState("");
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        const stored = window.localStorage.getItem(STORAGE_KEY) ?? "";
        setPlayerId(stored);
        setSavedPlayerId(stored);
    }, []);

    const handleSave = async () => {
        const nextValue = playerId.trim();
        if (!nextValue) {
            toast.error("请输入自己的 ID");
            return;
        }

        setSyncing(true);
        try {
            await warmFeedbackSession(nextValue);
            window.localStorage.setItem(STORAGE_KEY, nextValue);
            setSavedPlayerId(nextValue);
            toast.success("ID 已保存并完成会话交换");
            setOpen(false);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "保存失败，请稍后重试");
        } finally {
            setSyncing(false);
        }
    };

    const hasValue = savedPlayerId.length > 0;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                        "h-9 gap-1.5 rounded-full px-3",
                        hasValue ? "max-w-[14rem]" : "w-9 px-0",
                        hasValue && "text-primary"
                    )}>
                    <KeyRound data-icon="inline-start" />
                    <span className={cn("truncate", !hasValue && "sr-only")}>
                        {hasValue ? `玩家 ID：${savedPlayerId}` : "设置玩家 ID"}
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>设置玩家 ID</DialogTitle>
                    <DialogDescription>
                        仅在反馈页使用。保存后会先和后端节点交换会话信息，以便建立身份 cookie。
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium" htmlFor="feedback-player-id">
                        玩家 ID
                    </label>
                    <Input
                        id="feedback-player-id"
                        value={playerId}
                        onChange={(e) => setPlayerId(e.target.value)}
                        placeholder="输入你的玩家 ID"
                        maxLength={64}
                        autoComplete="off"
                    />
                </div>
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={syncing}>
                        取消
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={syncing} className="gap-2">
                        {syncing ? <RefreshCcw className="animate-spin" /> : <KeyRound data-icon="inline-start" />}
                        保存并交换身份
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
