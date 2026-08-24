"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { blobToDataUrl } from "@/lib/data-url";
import { useSkindrop, type ResolvedSkin } from "@/hooks/use-skindrop";
import PlayerRender, { type PlayerRenderRef } from "@/app/(public)/tools/_components/skindrop/player";
import { FieldLabel, Field, FieldContent, FieldTitle, FieldDescription } from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";

type Tab = "upload" | "namemc";
type Step = "select" | "preview" | "result";

export default function SkindropPage() {
    const [step, setStep] = useState<Step>("select");
    const [activeTab, setActiveTab] = useState<Tab>("upload");
    const { loading, error, lastError, resolve, upload } = useSkindrop();

    const [skinSource, setSkinSource] = useState<(ResolvedSkin & { filename: string }) | null>(null);
    const [skinType, setSkinType] = useState<"classic" | "slim">("classic");
    const [playerName, setPlayerName] = useState("");
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [nameMcInput, setNameMcInput] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [isPreparingPreview, setIsPreparingPreview] = useState(false);
    const [copied, setCopied] = useState(false);
    const [debugCopied, setDebugCopied] = useState(false);
    const [skinCommand, setSkinCommand] = useState<string>("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadTokenRef = useRef(0);
    const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const debugCopiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const playerRenderRef = useRef<PlayerRenderRef | null>(null);

    const resetAll = useCallback(() => {
        uploadTokenRef.current += 1;
        setStep("select");
        setActiveTab("upload");
        setSkinSource(null);
        setPlayerName("");
        setUploadedUrl(null);
        setSelectedFile(null);
        setNameMcInput("");
        setIsPreparingPreview(false);
    }, []);

    const switchTab = useCallback((tab: Tab) => {
        uploadTokenRef.current += 1;
        setActiveTab(tab);
        setSkinSource(null);
        setUploadedUrl(null);
        setPlayerName("");
        setSelectedFile(null);
        setNameMcInput("");
        setStep("select");
        setIsPreparingPreview(false);
    }, []);

    useEffect(() => {
        return () => {
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            if (debugCopiedTimeoutRef.current) clearTimeout(debugCopiedTimeoutRef.current);
        };
    }, []);

    const setUploadFile = useCallback(async (file: File | null) => {
        uploadTokenRef.current += 1;
        const token = uploadTokenRef.current;
        setSelectedFile(file);
        setSkinSource(null);

        if (!file) {
            setIsPreparingPreview(false);
            return;
        }

        if (file.type !== "image/png") {
            setSelectedFile(null);
            setIsPreparingPreview(false);
            toast.error("只支持 PNG 皮肤，请重新选择 .png 文件");
            return;
        }

        setIsPreparingPreview(true);
        try {
            const url = await blobToDataUrl(file);
            if (uploadTokenRef.current !== token) return;
            setSkinSource({
                id: file.name.replace(/\.png$/i, ""),
                url,
                blob: file,
                filename: file.name,
            });
        } catch {
            if (uploadTokenRef.current !== token) return;
            setSelectedFile(null);
        } finally {
            if (uploadTokenRef.current === token) {
                setIsPreparingPreview(false);
            }
        }
    }, []);

    const acceptDroppedFile = useCallback(
        (file: File | null) => {
            if (!file) return;

            void setUploadFile(file);
            setActiveTab("upload");
        },
        [setUploadFile]
    );

    const onFileChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0] ?? null;
            void setUploadFile(file);
        },
        [setUploadFile]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(true);
    }, []);

    const onDragLeave = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        setIsDragOver(false);
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();
            setIsDragOver(false);
            acceptDroppedFile(event.dataTransfer.files?.[0] ?? null);
        },
        [acceptDroppedFile]
    );

    const openFilePicker = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    useEffect(() => {
        const onWindowDragOver = (event: DragEvent) => {
            if (!event.dataTransfer?.types.includes("Files")) return;
            event.preventDefault();
            if (activeTab === "upload") {
                setIsDragOver(true);
            }
        };

        const onWindowDragLeave = (event: DragEvent) => {
            if (!event.dataTransfer?.types.includes("Files")) return;
            if (event.relatedTarget) return;
            setIsDragOver(false);
        };

        const onWindowDrop = (event: DragEvent) => {
            if (!event.dataTransfer?.types.includes("Files")) return;
            event.preventDefault();
            setIsDragOver(false);
            acceptDroppedFile(event.dataTransfer.files?.[0] ?? null);
        };

        window.addEventListener("dragover", onWindowDragOver, true);
        window.addEventListener("dragleave", onWindowDragLeave, true);
        window.addEventListener("drop", onWindowDrop, true);

        return () => {
            window.removeEventListener("dragover", onWindowDragOver, true);
            window.removeEventListener("dragleave", onWindowDragLeave, true);
            window.removeEventListener("drop", onWindowDrop, true);
        };
    }, [acceptDroppedFile, activeTab]);

    const proceedFromUpload = useCallback(() => {
        if (!selectedFile || !skinSource) return;
        setStep("preview");
    }, [selectedFile, skinSource]);

    const proceedFromNameMc = useCallback(async () => {
        const input = nameMcInput;
        if (!input.trim()) return;
        const result = await resolve(input);
        if (!result) return;
        setSkinSource({ ...result, filename: `${result.id}.png` });
        setStep("preview");
    }, [nameMcInput, resolve]);

    const confirmUpload = useCallback(async () => {
        if (!skinSource) return;
        const filename = `${playerName.trim()}.png`;
        const file = new File([skinSource.blob], filename, { type: "image/png" });
        const url = await upload(filename, file);
        if (url) {
            setUploadedUrl(url);
            setStep("result");

            const playerRender = playerRenderRef.current;
            if (playerRender) {
                await playerRender.onFaceFront();
                playerRender.onStartWave();
            }
        }
    }, [skinSource, playerName, upload]);

    useEffect(() => {
        setSkinCommand(uploadedUrl ? `/skin url ${uploadedUrl}?t=${new Date().getTime()} ${skinType}` : "");
    }, [uploadedUrl]);

    const copyCommand = useCallback(async () => {
        if (!skinCommand) return;
        try {
            await navigator.clipboard.writeText(skinCommand);
            setCopied(true);
            if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
            copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            // ignore
        }
    }, [skinCommand]);

    const getDebugInfo = () => {
        const raw = lastError.current;
        const errorStack = raw instanceof Error ? raw.stack || "(no stack)" : "(no stack available)";
        return [
            "Diagnostic Report (Skindrop Module)",
            "------------------",
            `Time: ${new Date().toISOString()}`,
            `Current Step: ${step}`,
            `Current Tab: ${activeTab}`,
            `Player Name: ${playerName || "(Empty)"}`,
            `Source: ${skinSource?.filename || "(Unknown)"}`,
            `Upload URL: ${uploadedUrl || "(Empty)"}`,
            `User Agent: ${navigator.userAgent}`,
            "------------------",
            `Error:\n${errorStack}`,
        ].join("\n");
    };

    const copyDebugInfo = async () => {
        try {
            await navigator.clipboard.writeText(getDebugInfo());
            setDebugCopied(true);
            if (debugCopiedTimeoutRef.current) clearTimeout(debugCopiedTimeoutRef.current);
            debugCopiedTimeoutRef.current = setTimeout(() => setDebugCopied(false), 2000);
        } catch {
            // ignore
        }
    };

    const currentSourceLabel = skinSource ? skinSource.filename : "尚未选择";
    const canProceedFromUpload = selectedFile !== null && skinSource !== null && !isPreparingPreview && !loading;
    const canProceedFromNameMc = nameMcInput.trim().length > 0 && !loading;
    const canConfirm = playerName.trim().length > 0 && skinSource !== null && !loading;

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
            <header className="text-center">
                <h1 className="font-heading text-foreground mb-2 text-2xl font-bold">皮肤驿站</h1>
                <p className="text-muted-foreground text-sm">上传皮肤、确认角色、复制指令，三步完成换装。</p>
            </header>

            <nav className="border-foreground/8 bg-background/35 flex flex-wrap items-center justify-center gap-3 rounded-xl border p-4">
                <Step step={step} target="select" label="选择皮肤" completed={step === "preview" || step === "result"} />
                <div className="bg-foreground/12 hidden h-px w-12 sm:block" />
                <Step step={step} target="preview" label="预览确认" completed={step === "result"} />
                <div className="bg-foreground/12 hidden h-px w-12 sm:block" />
                <Step step={step} target="result" label="复制指令" completed={false} />
            </nav>

            <main className="grid min-h-0 w-full flex-1 gap-6 overflow-hidden lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
                {/* Preview panel */}
                <section className="border-foreground/8 bg-background/25 flex min-h-0 w-full min-w-0 flex-col gap-4 overflow-hidden rounded-xl border p-5">
                    <div className="border-foreground/8 border-b pb-3">
                        <span className="text-foreground/50 font-mono text-[11px] tracking-widest">SKIN PREVIEW</span>
                        <h2 className="font-heading text-foreground text-lg font-bold">皮肤预览</h2>
                    </div>

                    <div className="border-foreground/12 bg-background/35 relative flex min-h-105 min-w-0 flex-1 items-center justify-center overflow-hidden rounded-lg border border-dashed">
                        <PlayerRender
                            ref={playerRenderRef}
                            type={skinType.replace("classic", "wide") as "wide" | "slim"}
                            skinUrl={skinSource?.url ?? "/images/a0fe6e818c766c181db01a8022ba7d40.png"}
                        />
                    </div>

                    <div className="border-foreground/8 bg-background/25 flex items-center justify-between gap-3 rounded-lg border p-3">
                        <span className="text-foreground/60 text-xs font-medium">当前来源</span>
                        <span className="text-foreground max-w-[60%] truncate text-sm">{currentSourceLabel}</span>
                    </div>
                </section>

                {/* Control panel */}
                <section className="border-foreground/8 bg-background/25 flex min-h-0 min-w-0 flex-col gap-4 rounded-xl border p-5">
                    {step === "select" && (
                        <div className="flex min-h-0 flex-1 flex-col gap-4">
                            <div className="border-foreground/8 border-b pb-2">
                                <h2 className="font-heading text-foreground text-lg font-bold">从哪里获取皮肤？</h2>
                            </div>

                            <div className="bg-background/35 flex gap-1 rounded-xl p-1">
                                <TabButton active={activeTab === "upload"} onClick={() => switchTab("upload")}>
                                    本地上传
                                </TabButton>
                                <TabButton active={activeTab === "namemc"} onClick={() => switchTab("namemc")}>
                                    NameMC / 图片地址
                                </TabButton>
                            </div>

                            {activeTab === "upload" ? (
                                <div className="flex flex-1 flex-col gap-4">
                                    <div
                                        className={cn(
                                            "hover:border-primary hover:bg-primary/6 border-foreground/15 bg-background/25 relative flex min-h-45 flex-1 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
                                            isDragOver && "border-primary bg-primary/6",
                                            selectedFile && "border-solid border-green-400/35 bg-green-400/6"
                                        )}
                                        onClick={openFilePicker}
                                        onDragOver={onDragOver}
                                        onDragLeave={onDragLeave}
                                        onDrop={onDrop}>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png"
                                            className="pointer-events-none absolute inset-0 opacity-0"
                                            onChange={onFileChange}
                                        />
                                        <div className="pointer-events-none flex flex-1 flex-col items-center gap-2 text-center">
                                            <span className="text-foreground/40 text-[32px] leading-none">+</span>
                                            <p className="text-foreground m-0 text-sm font-medium">
                                                {selectedFile?.name || "把 PNG 拖到这里"}
                                            </p>
                                            <p className="text-foreground/55 m-0 text-xs">或点击选择文件，仅支持 .png 格式</p>
                                        </div>
                                    </div>

                                    <Button onClick={proceedFromUpload} disabled={!canProceedFromUpload} className="w-full">
                                        下一步：预览并确认 →
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-4">
                                    <p className="m-0 text-sm text-[rgba(255,250,242,0.85)]">
                                        粘贴 NameMC 皮肤页面链接或皮肤图片直链。
                                    </p>
                                    <input
                                        value={nameMcInput}
                                        onChange={(e) => setNameMcInput(e.target.value)}
                                        type="text"
                                        placeholder="https://zh.namemc.com/skin/4f0932f4d85b1609"
                                        className="focus:border-primary border-foreground/15 bg-background/45 text-foreground placeholder:text-foreground/50 hover:border-foreground/30 w-full rounded-md border px-4 py-3 text-sm transition-colors outline-none"
                                    />
                                    <Button onClick={proceedFromNameMc} disabled={!canProceedFromNameMc} className="w-full">
                                        下一步：预览并确认 →
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}

                    {step === "preview" && (
                        <div className="flex min-h-0 flex-1 flex-col gap-4">
                            <div className="border-foreground/8 border-b pb-2">
                                <h2 className="font-heading text-foreground text-lg font-bold">确认使用这张图？</h2>
                            </div>
                            <p className="m-0 text-sm text-[rgba(255,250,242,0.85)]">这是一个什么类型的皮肤？</p>
                            <RadioGroup
                                value={skinType}
                                onValueChange={(v: "classic" | "slim") => setSkinType(v)}
                                className="grid grid-cols-2">
                                <FieldLabel htmlFor="type-steve">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Classic</FieldTitle>
                                            <FieldDescription>经典皮肤类型，即 Steve 模型 (粗手臂)</FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="classic" id="type-steve" />
                                    </Field>
                                </FieldLabel>
                                <FieldLabel htmlFor="type-slim">
                                    <Field orientation="horizontal">
                                        <FieldContent>
                                            <FieldTitle>Slim</FieldTitle>
                                            <FieldDescription>即 Alex 模型 (细手臂)</FieldDescription>
                                        </FieldContent>
                                        <RadioGroupItem value="slim" id="type-slim" />
                                    </Field>
                                </FieldLabel>
                            </RadioGroup>
                            <p className="m-0 text-sm text-[rgba(255,250,242,0.85)]">
                                * 我不知道这是一个什么类型的皮肤？
                                <br />
                                <br />
                                保持类型为 Classic，然后拖动左侧预览模型，看看是否有模型的面缺失了贴图或在闪烁。
                                <br />
                                如果有，则尝试切换到 Slim 类型，这应该能解决贴图面缺失的问题。
                            </p>
                            <Separator className="mt-auto" />
                            <p className="m-0 text-sm text-[rgba(255,250,242,0.85)]">
                                确认无误后输入你的玩家名，我们将把皮肤上传到你的账户。
                            </p>
                            <input
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                type="text"
                                placeholder="例如：Steve"
                                maxLength={32}
                                className="focus:border-primary border-foreground/15 bg-background/45 text-foreground placeholder:text-foreground/50 hover:border-foreground/30 w-full rounded-md border px-4 py-3 text-sm transition-colors outline-none"
                            />
                            <Button onClick={confirmUpload} disabled={!canConfirm} className="w-full">
                                确认上传
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setStep("select")}
                                className="text-foreground/72 hover:text-foreground w-full">
                                返回重新选择
                            </Button>
                        </div>
                    )}

                    {step === "result" && (
                        <div className="flex min-h-0 flex-1 flex-col gap-4">
                            <div className="border-foreground/8 border-b pb-2">
                                <h2 className="font-heading text-foreground text-lg font-bold">上传成功</h2>
                            </div>
                            <div>
                                <h2 className="font-heading text-foreground text-base font-bold">如何使用？</h2>
                                <div className="mt-1 ml-4 flex flex-col gap-1">
                                    <span>1. 点击下方按钮复制换皮肤命令</span>
                                    <span>
                                        2. 在游戏中按{" "}
                                        <kbd className="border-foreground/15 bg-background/45 text-foreground inline-block rounded border px-1.5 py-0.5 font-mono text-xs leading-relaxed shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                                            T
                                        </kbd>{" "}
                                        打开对话栏
                                    </span>
                                    <span>
                                        3. 按下{" "}
                                        <kbd className="border-foreground/15 bg-background/45 text-foreground inline-block rounded border px-1.5 py-0.5 font-mono text-xs leading-relaxed shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                                            Ctrl
                                        </kbd>{" "}
                                        +{" "}
                                        <kbd className="border-foreground/15 bg-background/45 text-foreground inline-block rounded border px-1.5 py-0.5 font-mono text-xs leading-relaxed shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                                            V
                                        </kbd>{" "}
                                        粘贴复制好的命令
                                    </span>
                                    <span>
                                        4. 按{" "}
                                        <kbd className="border-foreground/15 bg-background/45 text-foreground inline-block rounded border px-1.5 py-0.5 font-mono text-xs leading-relaxed shadow-[0_2px_0_rgba(0,0,0,0.35)]">
                                            Enter
                                        </kbd>{" "}
                                        以更换皮肤。
                                    </span>
                                </div>
                            </div>
                            <p>如有问题请联系服务器技术 @LingyunAwA (QQ 1913532130)</p>
                            <div className="mt-auto flex flex-col gap-3 rounded-lg border border-green-400/25 bg-green-400/8 p-4">
                                <code className="bg-background/35 text-foreground block rounded-lg p-3 font-mono text-sm break-all">
                                    {skinCommand}
                                </code>
                            </div>
                            <Button onClick={copyCommand} className="w-full">
                                {copied ? "已复制" : "复制命令"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={resetAll}
                                className="text-foreground/72 hover:text-foreground w-full">
                                再换一张
                            </Button>
                        </div>
                    )}

                    <div className="border-primary/15 bg-primary/6 flex flex-col gap-2 rounded-lg border p-3">
                        <span className="text-primary bg-primary/12 self-start rounded px-2 py-0.5 text-xs font-medium">
                            隐私提示
                        </span>
                        <p className="text-foreground/70 m-0 text-xs leading-relaxed">
                            皮肤图片会上传至服务器并生成公开可访问链接，请勿上传包含个人隐私信息的图片。
                        </p>
                    </div>

                    {error && (
                        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/12 p-3 text-sm text-red-400">
                            <span className="leading-relaxed">{error}</span>
                            <button
                                type="button"
                                onClick={copyDebugInfo}
                                className="shrink-0 rounded-md border border-red-500/45 bg-red-500/15 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:border-red-500/60 hover:bg-red-500/25">
                                {debugCopied ? "已复制" : "复制调试信息"}
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function Step({ step, target, label, completed }: { step: Step; target: Step; label: string; completed: boolean }) {
    const active = step === target;
    return (
        <div
            className={cn(
                "flex items-center gap-2 font-medium transition-colors",
                active ? "text-foreground" : completed ? "text-muted-foreground" : "text-foreground/55"
            )}>
            <span
                className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                    active && "bg-primary text-foreground",
                    completed && !active && "bg-green-400/25 text-green-400",
                    !active && !completed && "bg-foreground/10"
                )}>
                {target === "select" ? 1 : target === "preview" ? 2 : 3}
            </span>
            <span className="text-sm">{label}</span>
        </div>
    );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "bg-foreground/12 text-foreground" : "hover:text-foreground text-muted-foreground"
            )}>
            {children}
        </button>
    );
}

