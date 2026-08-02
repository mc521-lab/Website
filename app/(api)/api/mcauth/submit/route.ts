import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { submitMcAuth } from "@/lib/server/mc-auth-queries";
import { failure, success } from "@/lib/server/response";

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { accountXuid?: string; accountName?: string; hasValidMcje?: boolean; invalidReason?: string | null };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.accountXuid || !body.accountName || body.hasValidMcje === undefined) {
        const missing: string[] = [];
        if (!body.accountXuid) missing.push("accountXuid");
        if (!body.accountName) missing.push("accountName");
        if (body.hasValidMcje === undefined) missing.push("hasValidMcje");
        log.warn("Missing required fields", { missing });
        return failure(`Missing required fields: ${missing.join(", ")}`, 400);
    }

    log.debug("Submitting MC auth record", { accountXuid: body.accountXuid, hasValidMcje: body.hasValidMcje });

    const result = await submitMcAuth({
        accountXuid: body.accountXuid,
        accountName: body.accountName,
        hasValidMcje: body.hasValidMcje,
        invalidReason: body.invalidReason ?? null,
    });
    return success(result, { status: 201 });
});
