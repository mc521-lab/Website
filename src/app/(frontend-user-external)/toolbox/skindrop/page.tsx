"use client";

import { Radix } from "@/components";
import { copyToClipboard } from "@/lib/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SkinViewer, WalkingAnimation } from "skinview3d";

export default function SkinDrop() {
    const [step, setStep] = useState(1);

    const [file, setFile] = useState<File | null>(null);
    const [url, setUrl] = useState("");
    const [playerName, setPlayerName] = useState<string>("");

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const skinViewerRef = useRef<SkinViewer | null>(null);
    const skinBlobRef = useRef<Blob | null>(null);

    const [uploadSuccess, setUploadSuccess] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [s3Filename, setS3Filename] = useState<string>("");

    const [copied, setCopied] = useState<boolean>(false);

    const validStep1 = useMemo(() => {
        return !!file || !!url;
    }, [file, url]);

    const validStep2 = useMemo(() => {
        return playerName.length >= 3 && playerName.length <= 16 && /^[a-zA-Z][a-zA-Z0-9_]+$/.test(playerName);
    }, [playerName]);

    const handleFile = (f: File | null) => {
        if (!f) {
            setFile(null); // 清空文件
            return;
        }
        if (!f.type.startsWith("image/")) {
            alert("必须是图片文件");
            return;
        }
        setFile(f);
    };

    const createSkinViewer = useCallback(async () => {
        if (!canvasRef.current) return;
        // 清理旧实例
        if (skinViewerRef.current) {
            skinViewerRef.current.dispose();
            skinViewerRef.current = null;
        }
        let skinUrl: string;
        if (file) {
            skinBlobRef.current = file;
            skinUrl = URL.createObjectURL(file);
        } else if (url) {
            try {
                const res = await fetch(`/api/skindrop/download/${url.split("/").pop()}`);
                const blob = await res.blob();
                skinBlobRef.current = blob;
                skinUrl = URL.createObjectURL(blob);
            } catch (err) {
                console.error("获取 NameMC 皮肤失败", err);
                return;
            }
        } else {
            return;
        }
        skinViewerRef.current = new SkinViewer({
            canvas: canvasRef.current,
            width: 368,
            height: 368,
            skin: skinUrl,
        });
        skinViewerRef.current.animation = new WalkingAnimation();
    }, [file, url]);

    useEffect(() => {
        if (step === 1) {
            if (skinViewerRef.current) {
                skinViewerRef.current.dispose();
                skinViewerRef.current = null;
            }
        }

        if (step === 2) {
            createSkinViewer();
        }

        if (step === 3) {
            const upload = async () => {
                if (!skinBlobRef.current) return;
                const formData = new FormData();
                formData.append("file", skinBlobRef.current as Blob, file?.name || "");
                const extension = file ? file.name.split(".").pop() : "png";
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
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } catch (error: any) {
                    setUploadSuccess(false);
                    setErrorMessage(error?.data?.statusMessage || error?.message || "上传失败");
                } finally {
                    // 跳转到完成页
                    setStep(4);
                }
            };
            upload();
        }

        if (step === 5) {
            setFile(null);
            setUrl("");
            setPlayerName("");
            setUploadSuccess(true);
            setErrorMessage("");
            setS3Filename("");
            setStep(1); // 重置流程
        }
    }, [step, file, url, createSkinViewer, playerName]);

    return (
        <main className="pixel-font flex h-[calc(100vh-61px)] w-full translate-y-15.25 flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">换皮肤工具</h1>

            <div className="mt-12 grid h-84 w-4xl grid-cols-5 gap-x-6">
                {/* 预览 */}
                <Radix.Card className="col-span-2">
                    <Radix.CardHeader>
                        <Radix.CardTitle>预览</Radix.CardTitle>
                    </Radix.CardHeader>
                    <Radix.CardContent className="flex h-full items-center justify-center">
                        {step === 1 ? (
                            <div className="text-muted-foreground text-center">
                                上传皮肤后
                                <br />
                                此处将显示预览
                            </div>
                        ) : (
                            <canvas ref={canvasRef} className="-translate-y-6 bg-transparent" width={256} height={256} />
                        )}
                    </Radix.CardContent>
                </Radix.Card>

                {/* 上传 */}
                <Radix.Card className="col-span-3">
                    <Radix.CardHeader>
                        <Radix.CardTitle>上传</Radix.CardTitle>
                    </Radix.CardHeader>
                    <Radix.CardContent className="h-full">
                        {step === 1 && (
                            <div className="flex h-full flex-col gap-6">
                                <div className="mt-4 mb-auto flex h-full flex-col justify-center gap-4">
                                    {/* 文件 */}
                                    {url.length === 0 && (
                                        <div className="grid gap-2">
                                            <Radix.Label htmlFor="skinblob">上传皮肤文件</Radix.Label>
                                            <Radix.Input
                                                id="skinblob"
                                                type="file"
                                                accept="image/png,.png"
                                                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                                            />
                                        </div>
                                    )}

                                    {/* URL */}
                                    {file === null && (
                                        <div className="grid gap-2">
                                            <Radix.Label htmlFor="skinurl">或者输入图片 URL</Radix.Label>
                                            <Radix.Input
                                                id="skinurl"
                                                type="url"
                                                placeholder="https://namemc.com/skin/... 或 https://zh.namemc.com/skin/..."
                                                value={url}
                                                onChange={(e) => {
                                                    setUrl(e.target.value);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <Radix.Separator className="mt-auto" />

                                <Radix.Button className="ml-auto w-fit px-4" disabled={!validStep1} onClick={() => setStep(2)}>
                                    下一步
                                </Radix.Button>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="flex h-full flex-col gap-6">
                                <div className="my-auto w-full space-y-2 px-2">
                                    <p className="text-base font-medium">这是你要的皮肤吗？</p>
                                    <p className="text-muted-foreground text-sm">如果是，请输入您的游戏 ID</p>
                                    <Radix.Input
                                        placeholder="例如: LingyunAwA"
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        className="w-full text-lg"
                                    />
                                </div>
                                <Radix.Separator className="mt-auto" />

                                <Radix.Button className="ml-auto w-fit px-4" disabled={!validStep2} onClick={() => setStep(3)}>
                                    下一步
                                </Radix.Button>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="flex h-full -translate-x-0.5 flex-col items-center justify-center gap-4">
                                <LoaderCircleIcon className="-translate-x-1.25 animate-spin" />
                                <p className="text-muted-foreground">正在上传...</p>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="flex h-full w-full flex-col justify-center gap-4">
                                {uploadSuccess ? (
                                    <Radix.Alert variant="default" className="my-auto bg-green-500/25">
                                        <Radix.AlertTitle>上传成功！</Radix.AlertTitle>
                                        <Radix.AlertDescription>您的皮肤已成功上传至服务器。</Radix.AlertDescription>
                                    </Radix.Alert>
                                ) : (
                                    <Radix.Alert variant="destructive">
                                        <Radix.AlertTitle>上传失败</Radix.AlertTitle>
                                        <Radix.AlertDescription>
                                            {errorMessage}
                                            <br />
                                            如需帮助，请复制错误信息并发给站点管理员 LingyunAwA
                                        </Radix.AlertDescription>
                                    </Radix.Alert>
                                )}

                                {uploadSuccess && (
                                    <div className="grid grid-cols-5 gap-2">
                                        <Radix.Button
                                            variant="outline"
                                            onClick={() => {
                                                setStep(5);
                                            }}>
                                            再次上传
                                        </Radix.Button>
                                        <Radix.Button
                                            onClick={() => {
                                                setCopied(true);
                                                copyToClipboard(
                                                    `/skin url https://a7zzsqcyurqyggvo.public.blob.vercel-storage.com/SkinDrop/${s3Filename}`
                                                );
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 2000);
                                            }}
                                            className="col-span-4">
                                            {copied ? "已复制" : "复制换肤命令"}
                                        </Radix.Button>
                                    </div>
                                )}

                                {!uploadSuccess && (
                                    <div className="grid grid-cols-5 gap-2">
                                        <Radix.Button
                                            variant="outline"
                                            onClick={() => {
                                                setStep(5);
                                            }}>
                                            再次上传
                                        </Radix.Button>
                                        <Radix.Button
                                            onClick={() => {
                                                setCopied(true);
                                                copyToClipboard(errorMessage);
                                                setTimeout(() => {
                                                    setCopied(false);
                                                }, 2000);
                                            }}
                                            className="col-span-4">
                                            {copied ? "已复制" : "复制错误信息"}
                                        </Radix.Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </Radix.CardContent>
                </Radix.Card>
            </div>
        </main>
    );
}
