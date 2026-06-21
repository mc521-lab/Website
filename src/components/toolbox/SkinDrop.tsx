"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SkinViewer, WalkingAnimation } from "skinview3d";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

async function copyToClipboard(text: string) {
    try {
        await navigator.clipboard.writeText(text);
    } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
    }
}

export default function SkinDrop() {
    const [step, setStep] = useState(1);
    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [step1Loading, setStep1Loading] = useState(false);
    const [step1Error, setStep1Error] = useState("");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinViewerRef = useRef<SkinViewer | null>(null);
    const skinObjectUrlRef = useRef<string | null>(null);
    const skinBlobRef = useRef<Blob | null>(null);

    const [uploadSuccess, setUploadSuccess] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [s3Filename, setS3Filename] = useState("");

    const [copied, setCopied] = useState(false);

    const validStep1 = useMemo(() => {
        return !!file || (!!url && url.trim().length > 0);
    }, [file, url]);

    const validStep2 = useMemo(() => {
        return playerName.length >= 3 && playerName.length <= 16 && /^[a-zA-Z][a-zA-Z0-9_]+$/.test(playerName);
    }, [playerName]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        if (!f) {
            setFile(null);
            return;
        }
        if (!f.type.startsWith("image/")) {
            alert("必须是图片文件");
            e.target.value = "";
            setFile(null);
            return;
        }
        setFile(f);
    };

    const resetAll = useCallback(() => {
        setFile(null);
        setUrl("");
        setPlayerName("");
        setStep1Error("");
        setUploadSuccess(true);
        setErrorMessage("");
        setS3Filename("");
        setCopied(false);
        skinBlobRef.current = null;
        setStep(1);
    }, []);

    useEffect(() => {
        if (step !== 2) {
            if (skinViewerRef.current) {
                skinViewerRef.current.dispose();
                skinViewerRef.current = null;
            }
            if (skinObjectUrlRef.current) {
                URL.revokeObjectURL(skinObjectUrlRef.current);
                skinObjectUrlRef.current = null;
            }
            return;
        }

        if (!canvasRef.current || !skinBlobRef.current) return;

        const timer = setTimeout(() => {
            const skinUrl = URL.createObjectURL(skinBlobRef.current!);
            skinObjectUrlRef.current = skinUrl;

            const viewer = new SkinViewer({
                canvas: canvasRef.current!,
                width: 256,
                height: 256,
                skin: skinUrl,
            });
            viewer.animation = new WalkingAnimation();
            skinViewerRef.current = viewer;
        }, 0);

        return () => {
            clearTimeout(timer);
            if (skinViewerRef.current) {
                skinViewerRef.current.dispose();
                skinViewerRef.current = null;
            }
            if (skinObjectUrlRef.current) {
                URL.revokeObjectURL(skinObjectUrlRef.current);
                skinObjectUrlRef.current = null;
            }
        };
    }, [step]);

    useEffect(() => {
        if (step !== 3) return;

        const upload = async () => {
            if (!skinBlobRef.current) {
                setUploadSuccess(false);
                setErrorMessage("没有可上传的皮肤文件");
                setStep(4);
                return;
            }

            const formData = new FormData();
            formData.append("file", skinBlobRef.current, file?.name || "skin.png");
            const extension = file ? file.name.split(".").pop() || "png" : "png";
            const filename = encodeURIComponent(`${playerName}.${extension}`);
            setS3Filename(filename);

            try {
                const res = await fetch(`/api/skindrop/upload/${filename}`, {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    throw new Error(await res.text());
                }
                setUploadSuccess(true);
                setErrorMessage("");
            } catch (error: any) {
                setUploadSuccess(false);
                setErrorMessage(error?.message || "上传失败");
            } finally {
                setStep(4);
            }
        };

        upload();
    }, [step, file, playerName]);

    useEffect(() => {
        return () => {
            if (skinViewerRef.current) {
                skinViewerRef.current.dispose();
                skinViewerRef.current = null;
            }
            if (skinObjectUrlRef.current) {
                URL.revokeObjectURL(skinObjectUrlRef.current);
                skinObjectUrlRef.current = null;
            }
        };
    }, []);

    const gotoStep2 = async () => {
        setStep1Error("");
        if (file) {
            skinBlobRef.current = file;
            setStep(2);
            return;
        }

        if (url) {
            setStep1Loading(true);
            try {
                const id = url.split("/").pop();
                if (!id) {
                    throw new Error("无效的 URL");
                }
                const res = await fetch(`/api/skindrop/download/${id}`);
                if (!res.ok) {
                    throw new Error(await res.text());
                }
                const blob = await res.blob();
                skinBlobRef.current = blob;
                setStep(2);
            } catch (err: any) {
                setStep1Error(err?.message || "获取 NameMC 皮肤失败");
            } finally {
                setStep1Loading(false);
            }
        }
    };

    const handleCopy = async (text: string) => {
        await copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 flex items-center justify-center gap-3">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={cn(
                            "flex h-8 w-8 items-center justify-center text-sm font-medium transition-colors",
                            step === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        )}>
                        {s}
                    </div>
                ))}
            </div>

            <div className="gufeng-card p-4 sm:p-6">
                {step === 1 && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            {url.length === 0 && (
                                <div className="grid gap-2">
                                    <Label htmlFor="skin-file">上传皮肤文件</Label>
                                    <Input id="skin-file" type="file" accept="image/png,.png" onChange={handleFileChange} />
                                    {file && <p className="text-muted-foreground text-xs">已选择：{file.name}</p>}
                                </div>
                            )}

                            {file === null && (
                                <div className="grid gap-2">
                                    <Label htmlFor="skin-url">或者输入 NameMC URL</Label>
                                    <Input
                                        id="skin-url"
                                        type="url"
                                        placeholder="https://namemc.com/skin/..."
                                        value={url}
                                        onChange={(e) => {
                                            setUrl(e.target.value);
                                            setStep1Error("");
                                        }}
                                    />
                                    <div className="flex flex-wrap gap-3">
                                        <a
                                            href="https://namemc.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline">
                                            打开 NameMC (国际站)
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M15 3h6v6" />
                                                <path d="M10 14 21 3" />
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            </svg>
                                        </a>
                                        <a
                                            href="https://zh.namemc.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary inline-flex items-center gap-1 text-xs underline-offset-4 hover:underline">
                                            打开 NameMC (镜像站)
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="12"
                                                height="12"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round">
                                                <path d="M15 3h6v6" />
                                                <path d="M10 14 21 3" />
                                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>

                        {step1Error && (
                            <Alert variant="destructive">
                                <AlertTitle>获取失败</AlertTitle>
                                <AlertDescription>{step1Error}</AlertDescription>
                            </Alert>
                        )}

                        <Separator />

                        <div className="flex justify-end">
                            <Button disabled={!validStep1 || step1Loading} onClick={gotoStep2}>
                                {step1Loading && (
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                )}
                                下一步
                            </Button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col gap-6 md:flex-row">
                        <div className="flex flex-1 items-center justify-center">
                            <canvas ref={canvasRef} width={256} height={256} className="max-w-full" />
                        </div>
                        <div className="flex flex-1 flex-col gap-4">
                            <div className="space-y-1">
                                <p className="text-sm font-medium">这是你要的皮肤吗？</p>
                                <p className="text-muted-foreground text-xs">如果是，请输入您的游戏 ID</p>
                            </div>
                            <Input
                                placeholder="例如: LingyunAwA"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                            />
                            {!validStep2 && playerName.length > 0 && (
                                <p className="text-destructive text-xs">ID 需 3-16 位，以字母开头，仅含字母、数字、下划线</p>
                            )}
                            <div className="mt-auto flex justify-end pt-2">
                                <Button disabled={!validStep2} onClick={() => setStep(3)}>
                                    下一步
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col items-center justify-center gap-4 py-12">
                        <svg className="text-primary h-8 w-8 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <p className="text-muted-foreground text-sm">正在上传...</p>
                    </div>
                )}

                {step === 4 && (
                    <div className="flex flex-col gap-4">
                        {uploadSuccess ? (
                            <Alert className="border-green-600/30 bg-green-500/10 text-green-700 dark:text-green-400">
                                <AlertTitle>上传成功！</AlertTitle>
                                <AlertDescription>您的皮肤已成功上传至服务器。</AlertDescription>
                            </Alert>
                        ) : (
                            <Alert variant="destructive">
                                <AlertTitle>发生错误</AlertTitle>
                                <AlertDescription className="space-y-2">
                                    <pre className="bg-destructive/5 rounded p-2 text-xs break-all whitespace-pre-wrap">
                                        <code>{errorMessage}</code>
                                    </pre>
                                    <p>如需帮助，请复制错误信息并发给站点管理员</p>
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                            <Button variant="outline" onClick={resetAll} className="sm:col-span-1">
                                再次上传
                            </Button>
                            <Button
                                onClick={() =>
                                    handleCopy(
                                        uploadSuccess
                                            ? `/skin url https://a7zzsqcyurqyggvo.public.blob.vercel-storage.com/SkinDrop/${s3Filename}?t=${Date.now()}`
                                            : errorMessage
                                    )
                                }
                                className="sm:col-span-4">
                                {copied ? "已复制" : uploadSuccess ? "复制换肤命令" : "复制错误信息"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
