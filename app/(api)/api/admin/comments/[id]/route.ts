import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { deleteComment } from "@/lib/server/feedback-queries";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const DELETE = createHandler(async (request: NextRequest, context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const { id } = await context.params;

    log.debug("Deleting comment", { id });

    await deleteComment(id);
    return success(null);
});
