"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/@radix-ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/@radix-ui/field";
import { Input } from "@/components/@radix-ui/input";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        const res = await fetch("/api/portal/login", {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();
        const token = data.token;
        localStorage.setItem("portal-jwt", token);

        setLoading(false);

        if (!data.success) {
            setError(data.error);
            return;
        }

        // ✅ 登录成功 → 跳转
        router.push("/portal");
        router.refresh(); // 让 middleware / server 立即感知登录态
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <form onSubmit={handleLogin}>
                <FieldGroup>
                    <div className="flex flex-col items-center gap-2 text-center">
                        <div className="flex flex-col items-center gap-2 font-medium">
                            <div className="flex size-8 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-6" />
                            </div>
                            <span className="sr-only">君庭阁</span>
                        </div>
                        <h1 className="text-xl font-bold">君庭阁 管理面板</h1>
                        <FieldDescription>没有帐户或丢失密码？ 请联系站点管理员 LingyunAwA 处理</FieldDescription>
                    </div>

                    <FieldSeparator />

                    <Field>
                        <FieldLabel htmlFor="email">邮箱</FieldLabel>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">密码</FieldLabel>
                        <Input
                            id="password"
                            type="password"
                            placeholder="**************"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Field>

                    {error && <FieldDescription className="text-red-500">{error}</FieldDescription>}

                    <Field>
                        <Button type="submit" disabled={loading}>
                            {loading ? "登录中..." : "登录"}
                        </Button>
                    </Field>
                </FieldGroup>
            </form>
        </div>
    );
}
