import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { addPlayerComment, getFeedbackByNumber } from "@/lib/server/feedback-queries";
import { failure, success } from "@/lib/server/response";

export const POST = createHandler(async (request: NextRequest, context, log) => {
    const { number: numberStr } = await context.params;
    const number = Number(numberStr);
    if (!Number.isInteger(number) || number <= 0) {
        log.warn("Invalid feedback number", { numberStr });
        return failure("Invalid feedback number", 400);
    }

    const identity = request.cookies.get("feedback_identity")?.value;
    if (!identity) {
        log.warn("Missing identity cookie");
        return failure("Missing identity cookie", 403);
    }

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

    log.debug("Adding comment to feedback", { number, contentLength: body.content.length });

    const feedback = await getFeedbackByNumber(number);
    if (!feedback) {
        log.warn("Feedback not found", { number });
        return failure("Feedback not found", 404);
    }

    if (feedback.identity !== identity) {
        log.warn("User cannot comment on others' feedback", { number });
        return failure("You can only comment on your own feedback", 403);
    }

    const comment = await addPlayerComment(feedback.id, feedback.player_name, body.content);
    return success(comment, { status: 201 });
});
