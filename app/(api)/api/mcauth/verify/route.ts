import { NextRequest } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { login, type LoginError } from "@/lib/server/ms-auth";
import { failure, success } from "@/lib/server/response";

const PROFILE_NOT_FOUND_STEPS = [6];
const NOT_PURCHASED_STEPS = [5];

export const POST = createHandler(async (request: NextRequest, _context, log) => {
    let body: { msAccessToken?: string };
    try {
        body = await request.json();
    } catch {
        log.warn("Invalid request body");
        return failure("Invalid request body", 400);
    }

    if (!body.msAccessToken) {
        log.warn("Missing msAccessToken");
        return failure("Missing msAccessToken", 400);
    }

    log.debug("Starting MC auth verification", { hasToken: true });

    try {
        const result = await login(body.msAccessToken);
        log.success("MC auth verification succeeded", { uuid: result.uuid });
        return success({
            accountXuid: result.uuid,
            accountName: result.name,
            hasValidMcje: true,
        });
    } catch (err) {
        const loginErr = err as LoginError;

        if (loginErr && "step" in loginErr) {
            log.warn("MC auth verification failed", {
                step: loginErr.step,
                statusCode: loginErr.statusCode,
                error: loginErr.message,
            });

            if (PROFILE_NOT_FOUND_STEPS.includes(loginErr.step)) {
                return success({
                    accountXuid: "",
                    accountName: "",
                    hasValidMcje: false,
                    error: "PROFILE_NOT_FOUND",
                });
            }

            if (NOT_PURCHASED_STEPS.includes(loginErr.step)) {
                return success({
                    accountXuid: "",
                    accountName: "",
                    hasValidMcje: false,
                    error: "NOT_PURCHASED",
                });
            }

            return success({
                accountXuid: "",
                accountName: "",
                hasValidMcje: false,
                error: "VERIFICATION_FAILED",
            });
        }

        const msg = err instanceof Error ? err.message : String(err);
        log.error("MC auth verification exception", { error: msg });
        return failure("验证流程出错", 500);
    }
});