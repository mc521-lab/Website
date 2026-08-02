import { NextRequest, NextResponse } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { listPublicFeedbacks, createFeedback } from "@/lib/server/feedback-queries";
import type { FeedbackType, ServerType, FeedbackStatus } from "@/lib/server/types";
import { failure, success } from "@/lib/server/response";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const COOKIE_NAME = "feedback_identity";

function getOrCreateIdentity(request: NextRequest): { identity: string; isNew: boolean } {
    const existing = request.cookies.get(COOKIE_NAME)?.value;
    if (existing) {
        return { identity: existing, isNew: false };
    }
    return { identity: crypto.randomUUID(), isNew: true };
}

export const GET = createHandler(async (request: NextRequest, _context, log) => {
    const identity = request.cookies.get(COOKIE_NAME)?.value;

    const statusParam = request.nextUrl.searchParams.get("status");
    const parsedStatus = statusParam ? (statusParam.split(",") as FeedbackStatus[]) : undefined;

    const filters = {
        type: request.nextUrl.searchParams.get("type") as FeedbackType | undefined,
        server: request.nextUrl.searchParams.get("server") as ServerType | undefined,
        status: parsedStatus,
        search: request.nextUrl.searchParams.get("search") ?? undefined,
        identity: request.nextUrl.searchParams.get("mine") === "true" ? identity : undefined,
    };
    const pagination = {
        page: Number(request.nextUrl.searchParams.get("page") ?? 1),
        pageSize: Math.min(Number(request.nextUrl.searchParams.get("pageSize") ?? 20), 100),
    };

    log.debug("Fetching feedback list", { ...filters, pagination });

    const result = await listPublicFeedbacks(filters, pagination, identity);
    return success(result);
});

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { type?: FeedbackType; server?: ServerType; playerName?: string; title?: string; content?: string };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.type || !body.server || !body.playerName || !body.title || !body.content) {
        const missing: string[] = [];
        if (!body.type) missing.push("type");
        if (!body.server) missing.push("server");
        if (!body.playerName) missing.push("playerName");
        if (!body.title) missing.push("title");
        if (!body.content) missing.push("content");
        log.warn("Missing required fields", { missing });
        return failure(`Missing required fields: ${missing.join(", ")}`, 400);
    }

    const { identity, isNew } = getOrCreateIdentity(request);

    log.debug("Creating feedback", { type: body.type, server: body.server, title: body.title });

    const result = await createFeedback({
        type: body.type,
        server: body.server,
        playerName: body.playerName,
        identity,
        title: body.title,
        content: body.content,
    });

    const response = NextResponse.json({ success: true as const, data: result, message: null }, { status: 201 });

    if (isNew) {
        response.cookies.set(COOKIE_NAME, identity, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: ONE_YEAR_SECONDS,
        });
    }

    return response;
});
