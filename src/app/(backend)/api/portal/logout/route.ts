import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { withApiLog } from "@/lib/pretty-log";

const JWT_SECRET = process.env.JWT_SECRET!; // 你自己的 secret

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
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
        // 同样清除 cookie
        const res = NextResponse.json({ success: false, error: "登录过期" }, { status: 401 });
        res.cookies.delete("portal-jwt");
        return res;
    }

    // 从数据库移除 JWT
    const { error } = await supabase.from("Users").update({ jwt: null }).eq("email", payload.email);
    if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 返回成功，并删除 cookie
    const res = NextResponse.json({ success: true });
    res.cookies.delete("portal-jwt");
    return res;
}

export const POST = withApiLog(handler, { logBody: false }, "POST /api/portal/logout");
