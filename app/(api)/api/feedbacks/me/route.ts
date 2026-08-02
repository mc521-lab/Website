import { NextRequest, NextResponse } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { listPublicFeedbacks } from "@/lib/server/feedback-queries";

export const GET = createHandler(async (request: NextRequest, _context, log) => {
    const identity = request.cookies.get("feedback_identity")?.value;
    if (!identity) {
        log.debug("No identity cookie, returning empty list");
        return NextResponse.json({ success: true as const, data: { items: [], total: 0 }, message: null });
    }

    log.debug("Fetching my feedbacks", { identity });

    const result = await listPublicFeedbacks({ identity }, { page: 1, pageSize: 100 }, identity);
    return NextResponse.json({ success: true as const, data: result, message: null });
});
