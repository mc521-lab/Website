import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { addAdminComment } from "@/lib/server/feedback-queries";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const POST = createHandler(async (request: NextRequest, context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const { id } = await context.params;

    let body: { content?: string };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.content || body.content.trim().length === 0) {
        log.warn("Content is required");
        return failure("Content is required", 400);
    }

    log.debug("Adding admin comment", { id, contentLength: body.content.length });

    const comment = await addAdminComment(id, "管理员", body.content);
    return success(comment, { status: 201 });
});
