import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/supabase/supabase-server";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET() {
    const cookieStore = await cookies();
    const cookieJwt = cookieStore.get("portal-jwt");

    if (!cookieJwt) {
        return NextResponse.json({ success: false, error: "未登录" }, { status: 401 });
    }

    let payload: { userId: string; email: string };
    try {
        payload = jwt.verify(cookieJwt.value, JWT_SECRET) as { userId: string; email: string };
    } catch (err) {
        console.warn("JWT 无效或过期", err);
        const res = NextResponse.json({ success: false, error: "登录过期" }, { status: 401 });
        res.cookies.delete("portal-jwt");
        return res;
    }

    // 查询用户信息
    const { data: user, error } = await supabase
        .from("Users")
        .select("id, email, username") // 你想返回的字段
        .eq("email", payload.email)
        .single();

    if (error || !user) {
        return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
}
