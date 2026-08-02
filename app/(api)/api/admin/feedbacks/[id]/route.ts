import { NextRequest, type NextResponse } from "next/server";
import { createHandler, type HandlerLogger } from "@/lib/server/with-logger";
import { getAdminFeedbackDetail, updateFeedback, deleteFeedback } from "@/lib/server/feedback-queries";
import type { FeedbackType, ServerType, FeedbackStatus } from "@/lib/server/types";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

async function requireAuth(request: NextRequest, log: HandlerLogger): Promise<NextResponse | null> {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }
    return null;
}

export const GET = createHandler(async (request: NextRequest, context, log) => {
    const authError = await requireAuth(request, log);
    if (authError) return authError;

    const { id } = await context.params;

    log.debug("Fetching admin feedback detail", { id });

    const detail = await getAdminFeedbackDetail(id);
    if (!detail) {
        log.warn("Feedback not found", { id });
        return failure("Feedback not found", 404);
    }
    return success(detail);
});

export const PATCH = createHandler(async (request: NextRequest, context, log) => {
    const authError = await requireAuth(request, log);
    if (authError) return authError;

    const { id } = await context.params;

    let body: {
        type?: FeedbackType;
        server?: ServerType;
        playerName?: string;
        title?: string;
        content?: string;
        status?: FeedbackStatus;
        priority?: number;
        isPinned?: boolean;
        adminOnly?: boolean;
        closedAt?: string | null;
    };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    const patch: Partial<{
        type: FeedbackType;
        server: ServerType;
        playerName: string;
        title: string;
        content: string;
        status: FeedbackStatus;
        priority: number;
        isPinned: boolean;
        adminOnly: boolean;
        closedAt: string | null;
    }> = {};

    if (body.type !== undefined) patch.type = body.type;
    if (body.server !== undefined) patch.server = body.server;
    if (body.playerName !== undefined) patch.playerName = body.playerName;
    if (body.title !== undefined) patch.title = body.title;
    if (body.content !== undefined) patch.content = body.content;
    if (body.status !== undefined) patch.status = body.status;
    if (body.priority !== undefined) patch.priority = body.priority;
    if (body.isPinned !== undefined) patch.isPinned = body.isPinned;
    if (body.adminOnly !== undefined) patch.adminOnly = body.adminOnly;
    if (body.closedAt !== undefined) patch.closedAt = body.closedAt;

    if (Object.keys(patch).length === 0) {
        log.warn("No fields to update", { id });
        return failure("No fields to update", 400);
    }

    log.debug("Updating feedback", { id, fields: Object.keys(patch) });

    await updateFeedback(id, patch);
    return success(null);
});

export const DELETE = createHandler(async (request: NextRequest, context, log) => {
    const authError = await requireAuth(request, log);
    if (authError) return authError;

    const { id } = await context.params;

    log.debug("Deleting feedback", { id });

    await deleteFeedback(id);
    return success(null);
});
