"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Shield, Lock, LogIn, Home, Loader2, User2 } from "lucide-react";
import { adminLogin } from "@/lib/api";

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!email || !password) {
                toast.error("请输入邮箱和密码");
                return;
            }
            setSubmitting(true);
            try {
                const result = await adminLogin({ email: `${email}@mc521.local`, password });
                toast.success(result.message ?? "登录成功");
                router.push("/admin/feedbacks");
            } catch (err) {
                toast.error(err instanceof Error ? err.message : "登录失败");
            } finally {
                setSubmitting(false);
            }
        },
        [email, password, router]
    );

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">
                {/* 左侧装饰 */}
                <div className="admin-login-hero">
                    <div className="admin-login-hero-icon">
                        <Shield size={48} />
                    </div>
                    <h1 className="admin-login-hero-title">管理后台</h1>
                    <p className="admin-login-hero-desc">
                        管理员专用入口
                        <br />
                        用于处理玩家反馈与服务器管理
                    </p>
                    <div className="admin-login-hero-features">
                        <div className="admin-login-feature">
                            <span className="admin-login-feature-dot" />
                            <span>反馈审核与处理</span>
                        </div>
                        <div className="admin-login-feature">
                            <span className="admin-login-feature-dot" />
                            <span>用户与权限管理</span>
                        </div>
                        <div className="admin-login-feature">
                            <span className="admin-login-feature-dot" />
                            <span>数据统计与监控</span>
                        </div>
                    </div>
                </div>

                {/* 右侧表单 */}
                <div className="admin-login-form-wrap">
                    <div className="admin-login-form-header">
                        <h2>登录验证</h2>
                        <p>请使用管理员账号登录</p>
                    </div>

                    <form className="admin-login-form" onSubmit={handleSubmit}>
                        <div className="admin-login-form-group">
                            <label className="admin-login-label" htmlFor="email">
                                <User2 size={14} />
                                用户名
                            </label>
                            <input
                                id="email"
                                type="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin"
                                className="admin-login-input"
                                autoComplete="username"
                                disabled={submitting}
                            />
                        </div>

                        <div className="admin-login-form-group">
                            <label className="admin-login-label" htmlFor="password">
                                <Lock size={14} />
                                密码
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="请输入密码"
                                className="admin-login-input"
                                autoComplete="current-password"
                                disabled={submitting}
                            />
                        </div>

                        <button type="submit" className="admin-login-submit" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>登录中...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    <span>登录</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="admin-login-footer">
                        <Link href="/" className="admin-login-back-link">
                            <Home size={14} />
                            返回前台
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
