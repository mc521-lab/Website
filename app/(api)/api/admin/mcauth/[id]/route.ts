import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { deleteMcAuth } from "@/lib/server/mc-auth-queries";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const DELETE = createHandler(async (request: NextRequest, context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const { id } = await context.params;

    log.debug("Deleting MC auth record", { id });

    await deleteMcAuth(id);
    return success(null);
});
