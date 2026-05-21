"use client";

import * as React from "react";
import { Radix } from "@/components";
import { LoaderCircleIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

interface MinecraftVerifyCardProps {
    playername: string;
    setPlayername: (name: string) => void;
    terms: boolean;
    setTerms: (val: boolean) => void;
    loading?: boolean;
    checkingExisting?: boolean;
    onLaunchLogin: () => void;
}

const MinecraftVerifyCard = React.forwardRef<HTMLDivElement, MinecraftVerifyCardProps>(
    ({ playername, setPlayername, terms, setTerms, loading = false, checkingExisting = false, onLaunchLogin }, ref) => {
        return (
            <Radix.Card ref={ref} className="mt-16 w-full max-w-md">
                <Radix.CardHeader>
                    <Radix.CardTitle>验证正版称号账号</Radix.CardTitle>
                    <Radix.CardDescription>输入你的玩家名开始验证</Radix.CardDescription>
                    <Radix.CardAction>
                        <Link href="https://www.xbox.com/games/store/minecraft-java-bedrock-edition-for-pc/9nxp44l49shj" target="_blank">
                            <Radix.Button className="cursor-pointer" variant="link">
                                购买正版
                                <ExternalLinkIcon className="size-3" />
                            </Radix.Button>
                        </Link>
                    </Radix.CardAction>
                </Radix.CardHeader>

                <Radix.CardContent>
                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Radix.Label htmlFor="playername">服务器内玩家名</Radix.Label>
                            <Radix.Input
                                id="playername"
                                type="text"
                                placeholder="Steve"
                                minLength={3}
                                maxLength={16}
                                required
                                value={playername}
                                onChange={(e) => setPlayername(e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Radix.Field orientation="horizontal">
                                <Radix.Checkbox
                                    id="terms-checkbox"
                                    name="terms-checkbox"
                                    className="cursor-pointer"
                                    checked={terms}
                                    onCheckedChange={(val: boolean) => setTerms(val)}
                                />
                                <Radix.FieldContent>
                                    <Radix.FieldLabel htmlFor="terms-checkbox" className="cursor-pointer">
                                        我授权 NEXORA Hub 验证我的 Minecraft 正版账号资格
                                    </Radix.FieldLabel>
                                </Radix.FieldContent>
                            </Radix.Field>
                        </div>
                    </div>
                </Radix.CardContent>

                <Radix.CardFooter className="flex-col gap-2">
                    <Radix.Button
                        type="submit"
                        className="w-full cursor-pointer"
                        disabled={!playername || playername.length < 3 || playername.length > 16 || !terms || loading || checkingExisting}
                        onClick={onLaunchLogin}>
                        {(loading || checkingExisting) && <LoaderCircleIcon className="size-3 animate-spin" />}
                        {checkingExisting ? "查询中" : loading ? "验证中" : "开始验证"}
                    </Radix.Button>
                </Radix.CardFooter>
            </Radix.Card>
        );
    }
);

MinecraftVerifyCard.displayName = "MinecraftVerifyCard";

export { MinecraftVerifyCard };
