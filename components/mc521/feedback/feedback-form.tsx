"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Send, Bug, Lightbulb, Flag, Server, User, FileText, Loader2 } from "lucide-react";
import { IconifyIcon } from "@/components/iconify-icon";
import { createFeedback } from "@/lib/feedback";
import {
    type FeedbackType,
    type FeedbackServer,
    FEEDBACK_TYPE_LABEL,
    FEEDBACK_SERVER_LABEL,
} from "./types";

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
    const [playerName, setPlayerName] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!playerName.trim() || !title.trim() || !content.trim()) {
                toast.error("请填写所有必填字段");
                return;
            }
            setSubmitting(true);
            try {
                await createFeedback({
                    type,
                    server,
                    playerName: playerName.trim(),
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
        [type, server, playerName, title, content, onSubmitSuccess]
    );

    return (
        <section className="feedback-form-panel">
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
                {/* Type selector */}
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
                                    style={isActive ? ({ ["--chip-accent" as string]: opt.color }) : undefined}>
                                    <Icon size={14} className={isActive ? opt.color : ""} />
                                    {FEEDBACK_TYPE_LABEL[opt.value]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Server selector */}
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

                {/* Player name */}
                <div className="feedback-form-group">
                    <label className="feedback-form-label" htmlFor="feedback-player-name">
                        <User size={14} />
                        玩家名称
                    </label>
                    <input
                        id="feedback-player-name"
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="你的游戏 ID"
                        maxLength={64}
                        required
                        className="feedback-form-input"
                    />
                </div>

                {/* Title */}
                <div className="feedback-form-group">
                    <label className="feedback-form-label" htmlFor="feedback-title">
                        <FileText size={14} />
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

                {/* Content */}
                <div className="feedback-form-group">
                    <label className="feedback-form-label" htmlFor="feedback-content">
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
                        className="feedback-form-textarea"
                    />
                </div>

                {/* Actions */}
                <div className="feedback-form-actions">
                    {onCancel && (
                        <Button type="button" variant="ghost" onClick={onCancel} className="text-foreground/70 hover:text-foreground">
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
