import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { listMcAuth } from "@/lib/server/mc-auth-queries";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const GET = createHandler(async (request: NextRequest, _context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const filters = {
        xuid: request.nextUrl.searchParams.get("xuid") ?? undefined,
        hasValidMcje:
            request.nextUrl.searchParams.get("hasValidMcje") === "true"
                ? true
                : request.nextUrl.searchParams.get("hasValidMcje") === "false"
                  ? false
                  : undefined,
        checkedByAdmin:
            request.nextUrl.searchParams.get("checkedByAdmin") === "true"
                ? true
                : request.nextUrl.searchParams.get("checkedByAdmin") === "false"
                  ? false
                  : undefined,
        search: request.nextUrl.searchParams.get("search") ?? undefined,
    };
    const pagination = {
        page: Number(request.nextUrl.searchParams.get("page") ?? 1),
        pageSize: Math.min(Number(request.nextUrl.searchParams.get("pageSize") ?? 20), 100),
    };

    log.debug("Fetching MC auth list", { filters, pagination });

    const result = await listMcAuth(filters, pagination);
    return success(result);
});

