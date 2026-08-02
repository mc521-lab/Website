import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { getPublicFeedbackDetail } from "@/lib/server/feedback-queries";
import { failure, success } from "@/lib/server/response";

export const GET = createHandler(async (request: NextRequest, context, log) => {
    const { number: numberStr } = await context.params;
    const number = Number(numberStr);
    if (!Number.isInteger(number) || number <= 0) {
        log.warn("Invalid feedback number", { numberStr });
        return failure("Invalid feedback number", 400);
    }

    const identity = request.cookies.get("feedback_identity")?.value;

    log.debug("Fetching feedback detail", { number });

    const detail = await getPublicFeedbackDetail(number, identity);
    if (!detail) {
        log.warn("Feedback not found", { number });
        return failure("Feedback not found", 404);
    }
    return success(detail);
});
