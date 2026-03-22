import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export const runtime = "nodejs";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // ✅ 放行 login 页面
    if (pathname.startsWith("/portal/login")) {
        console.log("[Middleware] Passed (login page)", pathname);
        return NextResponse.next();
    }

    // ✅ 保护 /portal/*
    if (pathname.startsWith("/portal")) {
        const token = req.cookies.get("portal-jwt")?.value;
        console.log("[Middleware] Received token:", token);

        if (!token) {
            console.log("[Middleware] Failed (no token)", pathname);
            const url = req.nextUrl.clone();
            url.pathname = "/portal/login";
            url.searchParams.set("redirect", pathname);
            return NextResponse.redirect(url);
        }

        try {
            // 验证 JWT
            jwt.verify(token, JWT_SECRET);
            console.log("[Middleware] Passed (JWT valid)", pathname);
            return NextResponse.next();
        } catch (err) {
            console.warn("[Middleware] Failed (JWT invalid/expired)", err);
            const url = req.nextUrl.clone();
            url.pathname = "/portal/login";
            url.searchParams.set("redirect", pathname);
            const res = NextResponse.redirect(url);
            // 同时清除无效 cookie
            res.cookies.delete("portal-jwt");
            return res;
        }
    }

    // 非 /portal 路径，放行
    return NextResponse.next();
}
