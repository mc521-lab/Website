import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { checkMcAuth } from "@/lib/server/mc-auth-queries";
import { failure, success } from "@/lib/server/response";

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { accountXuid?: string };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.accountXuid) {
        log.warn("Missing accountXuid");
        return failure("Missing accountXuid", 400);
    }

    log.debug("Checking existing MC auth", { accountXuid: body.accountXuid });

    const result = await checkMcAuth(body.accountXuid);
    return success(result);
});
