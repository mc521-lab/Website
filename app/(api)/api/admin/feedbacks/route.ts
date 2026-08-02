import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { listAdminFeedbacks } from "@/lib/server/feedback-queries";
import type { FeedbackType, ServerType, FeedbackStatus } from "@/lib/server/types";
import { verifyAdminToken } from "@/lib/server/admin-auth";
import { failure, success } from "@/lib/server/response";

export const GET = createHandler(async (request: NextRequest, _context, log) => {
    const isValid = await verifyAdminToken(request.headers.get("authorization") ?? undefined);
    if (!isValid) {
        log.warn("Unauthorized admin access attempt");
        return failure("Unauthorized", 401);
    }

    const filters = {
        type: request.nextUrl.searchParams.get("type") as FeedbackType | undefined,
        server: request.nextUrl.searchParams.get("server") as ServerType | undefined,
        status: request.nextUrl.searchParams.get("status") as FeedbackStatus | undefined,
        priority: request.nextUrl.searchParams.get("priority")
            ? Number(request.nextUrl.searchParams.get("priority"))
            : undefined,
        isPinned:
            request.nextUrl.searchParams.get("isPinned") === "true"
                ? true
                : request.nextUrl.searchParams.get("isPinned") === "false"
                  ? false
                  : undefined,
        search: request.nextUrl.searchParams.get("search") ?? undefined,
    };
    const pagination = {
        page: Number(request.nextUrl.searchParams.get("page") ?? 1),
        pageSize: Math.min(Number(request.nextUrl.searchParams.get("pageSize") ?? 20), 100),
    };

    log.debug("Fetching admin feedbacks", { filters, pagination });

    const result = await listAdminFeedbacks(filters, pagination);
    return success(result);
});
