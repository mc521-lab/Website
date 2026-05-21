// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/supabase/supabase-server";
import { withApiLog } from "@/lib/pretty-log";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

async function handler(req: NextRequest) {
    const supabase = getSupabaseClient();
    
    const { email, password } = await req.json();

    const { data, error } = await supabase.from("Users").select().eq("email", email).single();
    if (error) return NextResponse.json({ success: false, error: error.message }, { status: 401 });

    const passwordHash = crypto.createHash("sha256").update(password, "utf-8").digest("hex");
    if (passwordHash !== data.password) return NextResponse.json({ success: false, error: "密码错误" }, { status: 401 });

    const payload = {
        userId: data.id,
        email: data.email,
    };
    const signedJwt = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "6h" });

    const { error: error2 } = await supabase.from("Users").update({ jwt: signedJwt }).eq("id", data.id).single();
    if (error2) return NextResponse.json({ success: false, error: error2.message }, { status: 401 });

    const res = NextResponse.json({ success: true });
    res.cookies.set({
        name: "portal-jwt",
        value: signedJwt,
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 6, // 6 小时
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
    });
    return res;
}

export const POST = withApiLog(handler, { logBody: true }, "POST /api/portal/login");
