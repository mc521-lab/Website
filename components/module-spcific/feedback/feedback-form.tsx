"use client";

import { useCallback, useState } from "react";
import { Bug, CircleQuestionMark, FileText, Flag, Lightbulb, Loader2, Send, Server } from "lucide-react";
import { toast } from "sonner";

import { IconifyIcon } from "@/components/iconify-icon";
import { Button } from "@/components/ui/button";
import { createFeedback } from "@/lib/api";
import { ensureSession } from "@/lib/api/client";
import {
    type FeedbackServer,
    type FeedbackType,
    FEEDBACK_SERVER_LABEL,
    FEEDBACK_TYPE_LABEL,
} from "@/components/ui/types";

interface FeedbackFormProps {
    onSubmitSuccess?: () => void;
    onCancel?: () => void;
}

const TYPE_OPTIONS: { value: FeedbackType; icon: React.ElementType; color: string }[] = [
    { value: "bug", icon: Bug, color: "text-red-400" },
    { value: "feature", icon: Lightbulb, color: "text-blue-400" },
    { value: "report", icon: Flag, color: "text-amber-400" },
];

const SERVER_OPTIONS: { value: FeedbackServer; icon: string }[] = [
    { value: "hub", icon: "lucide:building-2" },
    { value: "survival", icon: "lucide:compass" },
    { value: "resource", icon: "lucide:package" },
    { value: "plot", icon: "lucide:book-open" },
];

export function FeedbackForm({ onSubmitSuccess, onCancel }: FeedbackFormProps) {
    const [type, setType] = useState<FeedbackType>("bug");
    const [server, setServer] = useState<FeedbackServer>("hub");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            const playerId = window.localStorage.getItem("mc521_feedback_player_id")?.trim();
            if (!playerId) {
                toast.error("请先在右上角设置玩家 ID");
                return;
            }

            if (!title.trim() || !content.trim()) {
                toast.error("请填写所有必填字段");
                return;
            }

            setSubmitting(true);
            try {
                await ensureSession();
                await createFeedback({
                    type,
                    server,
                    playerName: playerId,
                    title: title.trim(),
                    content: content.trim(),
                });
                toast.success("反馈提交成功！");
                onSubmitSuccess?.();
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "提交失败，请稍后重试");
            } finally {
                setSubmitting(false);
            }
        },
        [type, server, title, content, onSubmitSuccess]
    );

    return (
        <section className="feedback-form-panel flex-1">
            <div className="feedback-form-header">
                <div className="feedback-form-header-icon">
                    <IconifyIcon icon="lucide:message-square-plus" width={18} height={18} />
                </div>
                <div>
                    <strong>提交反馈</strong>
                    <span>遇到问题或有建议？告诉我们吧</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form-body">
                <div className="feedback-form-group">
                    <label className="feedback-form-label">
                        <Bug size={14} />
                        反馈类型
                    </label>
                    <div className="feedback-type-options" role="radiogroup" aria-label="反馈类型">
                        {TYPE_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const isActive = type === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setType(opt.value)}
                                    className={`feedback-type-chip ${isActive ? "is-active" : ""}`}
                                    style={isActive ? { ["--chip-accent" as string]: opt.color } : undefined}>
                                    <Icon size={14} className={isActive ? opt.color : ""} />
                                    {FEEDBACK_TYPE_LABEL[opt.value]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="feedback-form-group">
                    <label className="feedback-form-label">
                        <Server size={14} />
                        涉及服务器
                    </label>
                    <div className="feedback-server-options" role="radiogroup" aria-label="服务器">
                        {SERVER_OPTIONS.map((opt) => {
                            const isActive = server === opt.value;
                            return (
                                <button
                                    key={opt.value}
                                    type="button"
                                    role="radio"
                                    aria-checked={isActive}
                                    onClick={() => setServer(opt.value)}
                                    className={`feedback-server-chip ${isActive ? "is-active" : ""}`}>
                                    <IconifyIcon icon={opt.icon} width={14} height={14} />
                                    {FEEDBACK_SERVER_LABEL[opt.value]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="feedback-form-group border-foreground/15 bg-foreground/5 text-foreground/75 rounded-lg border border-dashed px-4 py-3 text-sm">
                    <span>玩家 ID 将从右上角设置读取；如果还没有设置，请先去右上角填写喔~</span>
                </div>

                <div className="feedback-form-group">
                    <label className="feedback-form-label" htmlFor="feedback-title">
                        <CircleQuestionMark size={14} />
                        反馈标题
                    </label>
                    <input
                        id="feedback-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="一句话概括你的问题或建议"
                        maxLength={200}
                        required
                        className="feedback-form-input"
                    />
                </div>

                <div className="feedback-form-group flex-1">
                    <label className="feedback-form-label" htmlFor="feedback-content">
                        <FileText size={14} />
                        详细描述
                        <span className="feedback-form-counter">{content.length} / 5000</span>
                    </label>
                    <textarea
                        id="feedback-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="详细描述你遇到的问题、复现步骤或你的建议..."
                        maxLength={5000}
                        rows={6}
                        required
                        className="feedback-form-textarea h-full"
                    />
                </div>

                <div className="feedback-form-actions">
                    {onCancel && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onCancel}
                            className="text-foreground/70 hover:text-foreground">
                            取消
                        </Button>
                    )}
                    <Button type="submit" disabled={submitting} className="gap-2">
                        {submitting ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                提交中...
                            </>
                        ) : (
                            <>
                                <Send size={16} />
                                提交反馈
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </section>
    );
}
