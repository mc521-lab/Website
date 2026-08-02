import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { markMcAuthChecked } from "@/lib/server/mc-auth-queries";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const PATCH = createHandler(async (request: NextRequest, context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const { id } = await context.params;

    log.debug("Marking MC auth as checked", { id });

    await markMcAuthChecked(id);
    return success(null);
});
