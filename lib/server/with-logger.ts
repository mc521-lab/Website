import { NextRequest, NextResponse } from "next/server";
import {
    plogDebug,
    plogInfo,
    plogSuccess,
    plogWarn,
    plogError,
    getClientIp,
    getPathname,
    getQueryParams,
} from "./logger";
import { failure } from "./response";

export interface HandlerLogger {
    debug: (message: string, extra?: Record<string, unknown>) => void;
    info: (message: string, extra?: Record<string, unknown>) => void;
    success: (message: string, extra?: Record<string, unknown>) => void;
    warn: (message: string, extra?: Record<string, unknown>) => void;
    error: (message: string, extra?: Record<string, unknown>) => void;
}

export function createHandler<
    TParams extends Record<string, string> = Record<string, string>,
>(
    handler: (
        request: NextRequest,
        context: { params: Promise<TParams> },
        log: HandlerLogger,
    ) => Promise<NextResponse>,
): (request: NextRequest, context: { params: Promise<TParams> }) => Promise<NextResponse> {
    return async (request: NextRequest, context: { params: Promise<TParams> }) => {
        const startTime = performance.now();
        const method = request.method;
        const path = getPathname(request.url);
        const ip = getClientIp(request.headers);
        const userAgent = request.headers.get("user-agent") ?? undefined;
        const query = getQueryParams(request.url);

        let loggedBody: unknown = undefined;

        const log: HandlerLogger = {
            debug(message: string, extra?: Record<string, unknown>) {
                plogDebug(message, { method, path, query, ip, userAgent, ...extra });
            },
            info(message: string, extra?: Record<string, unknown>) {
                plogInfo(message, { method, path, ip, userAgent, ...extra });
            },
            success(message: string, extra?: Record<string, unknown>) {
                const duration = performance.now() - startTime;
                plogSuccess(message, { method, path, status: 200, duration, ip, ...extra });
            },
            warn(message: string, extra?: Record<string, unknown>) {
                const duration = performance.now() - startTime;
                plogWarn(message, { method, path, status: 400, duration, ip, query, body: loggedBody, ...extra });
            },
            error(message: string, extra?: Record<string, unknown>) {
                const duration = performance.now() - startTime;
                plogError(message, { method, path, status: 500, duration, ip, query, body: loggedBody, ...extra });
            },
        };

        try {
            const isPostLike = ["POST", "PUT", "PATCH", "DELETE"].includes(method);
            if (isPostLike) {
                try {
                    const cloned = request.clone();
                    loggedBody = await cloned.json();
                } catch {
                    // body is not JSON or not readable
                }
            }

            plogDebug("→ API Request", {
                method,
                path,
                query: Object.keys(query).length > 0 ? query : undefined,
                body: loggedBody,
                ip,
                userAgent,
            });

            const response = await handler(request, context, log);

            const duration = performance.now() - startTime;
            const status = response.status;

            if (status >= 400) {
                const tryMsg = tryExtractError(response);
                plogError(`✕ API Error (response)`, {
                    method,
                    path,
                    status,
                    duration,
                    ip,
                    error: tryMsg,
                });
            } else {
                plogSuccess("← API Response", {
                    method,
                    path,
                    status,
                    duration,
                    ip,
                });
            }

            return response;
        } catch (err) {
            const duration = performance.now() - startTime;
            const message = err instanceof Error ? err.message : String(err);

            plogError("✕ API Error (thrown)", {
                method,
                path,
                status: 500,
                duration,
                ip,
                error: message,
                query,
                body: loggedBody,
            });

            return failure(message, 500);
        }
    };
}

function tryExtractError(response: NextResponse): string | undefined {
    try {
        // We can't read response body without consuming it, so we just skip
        return undefined;
    } catch {
        return undefined;
    }
}
