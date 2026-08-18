"use client";

import { useMemo, useState } from "react";
import { FlaskConical, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { EXPERIMENTAL_FLAGS, useExperimentalFlags } from "@/hooks/use-experimental-flags";
import { Badge } from "@/components/ui/badge";

export function ExperimentalFlagsDialog() {
    const [open, setOpen] = useState(false);
    const { enabledFlags, setEnabledFlags } = useExperimentalFlags();

    const availableFlagIds = useMemo(() => new Set(EXPERIMENTAL_FLAGS.map((flag) => flag.id)), []);
    const selectedFlags = enabledFlags.filter((flag) => availableFlagIds.has(flag));

    const modifyFlag = (flagId: string, state?: boolean) => {
        setEnabledFlags((current) => {
            const enabled = current.includes(flagId);
            if (state !== undefined) {
                if (state && !enabled) return [...current, flagId];
                if (!state && enabled) return current.filter((item) => item !== flagId);
                return current;
            }

            return enabled ? current.filter((item) => item !== flagId) : [...current, flagId];
        });
    };

    const clearFlags = () => {
        setEnabledFlags([]);
    };

    return (
        <>
            <Button
                variant="outline"
                onClick={() => setOpen(true)}
                aria-label="实验性功能开关"
                className="text-foreground/55 hover:bg-foreground/5 hover:text-foreground rounded-full">
                <FlaskConical size={16} />
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>实验性功能开关</DialogTitle>
                        <DialogDescription>
                            这些功能可能改变页面风格或者增加新功能
                            <br />
                            这些特性可能会有 Bug，遇到问题或有建议请及时找 LingyunAwA 反馈
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        {EXPERIMENTAL_FLAGS.length > 0 ? (
                            <div className="flex flex-col gap-2">
                                {EXPERIMENTAL_FLAGS.map((flag) => {
                                    const checked = enabledFlags.includes(flag.id);

                                    return (
                                        <Field key={flag.id} orientation="horizontal">
                                            <FieldContent>
                                                <FieldTitle>
                                                    {flag.label}{" "}
                                                    {flag.disabled &&
                                                        (!!process.env.DEBUGGING_MODE ? (
                                                            <Badge variant="destructive">已被全局禁用</Badge>
                                                        ) : (
                                                            <Badge>仅生产环境禁用</Badge>
                                                        ))}
                                                </FieldTitle>
                                                {flag.description && <FieldDescription>{flag.description}</FieldDescription>}
                                            </FieldContent>
                                            <FieldLabel htmlFor={`switch-${flag.id}`} className="sr-only">
                                                {flag.label}
                                            </FieldLabel>
                                            <Switch
                                                id={`switch-${flag.id}`}
                                                checked={checked}
                                                onCheckedChange={(value) => modifyFlag(flag.id, value)}
                                                disabled={flag.disabled && !!process.env.DEBUGGING_MODE}
                                            />
                                        </Field>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-muted/30 border-muted-foreground/20 text-muted-foreground rounded-lg border border-dashed px-4 py-5 text-sm">
                                目前没有可用的实验性配置，过一阵子再来看看吧！
                            </div>
                        )}

                        <Separator />

                        <div className="text-muted-foreground flex items-center justify-between text-xs">
                            <span>当前启用 {selectedFlags.length} 项</span>
                            <span>关闭弹窗会自动保留修改</span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={clearFlags} disabled={enabledFlags.length === 0}>
                            <RotateCcw className="size-4" />
                            清空本地配置
                        </Button>
                        <Button type="button" onClick={() => setOpen(false)}>
                            关闭
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

