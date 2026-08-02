import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { supabase } from "@/lib/server/supabase";
import { failure, success } from "@/lib/server/response";

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { email?: string; password?: string };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.email || !body.password) {
        const missing: string[] = [];
        if (!body.email) missing.push("email");
        if (!body.password) missing.push("password");
        log.warn("Missing required fields", { missing });
        return failure(`Missing required fields: ${missing.join(", ")}`, 400);
    }

    log.debug("Admin login attempt", { email: body.email });

    const { data, error } = await supabase.auth.signInWithPassword({
        email: body.email,
        password: body.password,
    });

    if (error || !data.session) {
        log.warn("Admin login failed", { email: body.email, error: error?.message });
        return failure(error?.message ?? "Invalid credentials", 401);
    }

    log.info("Admin login success", { email: body.email });

    return success({
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at,
        user: {
            id: data.user.id,
            email: data.user.email,
        },
    });
});
