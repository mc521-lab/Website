export type LogLevel = "info" | "success" | "warn" | "error" | "debug";

export interface LogContext {
    method?: string;
    path?: string;
    status?: number;
    duration?: number;
    ip?: string;
    userAgent?: string;
    query?: Record<string, string>;
    body?: unknown;
    error?: string;
    [key: string]: unknown;
}

const LEVEL_STYLES: Record<LogLevel, { emoji: string; label: string; color: string }> = {
    info: { emoji: "🟦", label: "INFO", color: "\x1b[36m" },
    success: { emoji: "🟩", label: "SUCCESS", color: "\x1b[32m" },
    warn: { emoji: "🟨", label: "WARN", color: "\x1b[33m" },
    error: { emoji: "🟥", label: "ERROR", color: "\x1b[31m" },
    debug: { emoji: "⬜", label: "DEBUG", color: "\x1b[90m" },
};

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function isColorSupported(): boolean {
    if (typeof process === "undefined") return false;
    if (process.env.NO_COLOR) return false;
    if (process.env.FORCE_COLOR) return true;
    return process.stdout?.isTTY ?? false;
}

const colorEnabled = isColorSupported();

function colorize(text: string, color: string): string {
    return colorEnabled ? `${color}${text}${RESET}` : text;
}

function dim(text: string): string {
    return colorEnabled ? `${DIM}${text}${RESET}` : text;
}

function bold(text: string): string {
    return colorEnabled ? `${BOLD}${text}${RESET}` : text;
}

function formatTimestamp(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}.${ms}`;
}

function formatDuration(ms: number): string {
    if (ms < 1) return `${(ms * 1000).toFixed(0)}μs`;
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

function statusColor(status: number): string {
    if (status >= 200 && status < 300) return "\x1b[32m";
    if (status >= 300 && status < 400) return "\x1b[36m";
    if (status >= 400 && status < 500) return "\x1b[33m";
    if (status >= 500) return "\x1b[31m";
    return "\x1b[90m";
}

function methodColor(method: string): string {
    const map: Record<string, string> = {
        GET: "\x1b[32m",
        POST: "\x1b[34m",
        PUT: "\x1b[33m",
        PATCH: "\x1b[36m",
        DELETE: "\x1b[31m",
        HEAD: "\x1b[35m",
        OPTIONS: "\x1b[90m",
    };
    return map[method.toUpperCase()] ?? "\x1b[90m";
}

function sanitizeBody(body: unknown): unknown {
    if (!body || typeof body !== "object") return body;
    const sensitive = ["password", "token", "jwt", "secret", "authorization", "cookie"];
    const clone = JSON.parse(JSON.stringify(body));
    for (const key of Object.keys(clone)) {
        if (sensitive.some((s) => key.toLowerCase().includes(s))) {
            clone[key] = "***REDACTED***";
        }
    }
    return clone;
}

function buildLogLine(level: LogLevel, message: string, ctx?: LogContext): string {
    const style = LEVEL_STYLES[level];
    const parts: string[] = [
        dim(`[${formatTimestamp()}]`),
        `${style.emoji} ${colorize(`[${style.label}]`, style.color)}`,
        bold(message),
    ];

    if (ctx?.method && ctx?.path) {
        const mColor = methodColor(ctx.method);
        const sColor = ctx.status ? statusColor(ctx.status) : "";
        parts.push(
            `${colorize(ctx.method, mColor)} ${ctx.path}` + (ctx.status ? ` ${colorize(String(ctx.status), sColor)}` : "")
        );
    }

    if (ctx?.duration !== undefined) {
        const dColor = ctx.duration > 1000 ? "\x1b[31m" : ctx.duration > 300 ? "\x1b[33m" : "\x1b[32m";
        parts.push(colorize(`(${formatDuration(ctx.duration)})`, dColor));
    }

    if (ctx?.ip) parts.push(dim(`ip=${ctx.ip}`));
    if (ctx?.error) parts.push(colorize(`err="${ctx.error}"`, "\x1b[31m"));

    const extra: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(ctx ?? {})) {
        if (!["method", "path", "status", "duration", "ip", "userAgent", "query", "body", "error"].includes(k)) {
            extra[k] = v;
        }
    }

    const line = parts.join(" ");
    const details: string[] = [];

    if (ctx?.query && Object.keys(ctx.query).length > 0) {
        details.push(dim(`  query: ${JSON.stringify(ctx.query)}`));
    }
    if (ctx?.body) {
        details.push(dim(`  body: ${JSON.stringify(sanitizeBody(ctx.body))}`));
    }
    if (Object.keys(extra).length > 0) {
        details.push(dim(`  extra: ${JSON.stringify(extra)}`));
    }

    return details.length > 0 ? `${line}\n${details.join("\n")}` : line;
}

export class PrettyLogger {
    log(level: LogLevel, message: string, ctx?: LogContext): void {
        const line = buildLogLine(level, message, ctx);
        if (level === "error") {
            console.error(line);
        } else if (level === "warn") {
            console.warn(line);
        } else {
            console.log(line);
        }
    }

    info(message: string, ctx?: LogContext): void {
        this.log("info", message, ctx);
    }

    success(message: string, ctx?: LogContext): void {
        this.log("success", message, ctx);
    }

    warn(message: string, ctx?: LogContext): void {
        this.log("warn", message, ctx);
    }

    error(message: string, ctx?: LogContext): void {
        this.log("error", message, ctx);
    }

    debug(message: string, ctx?: LogContext): void {
        if (process.env.DEBUG || process.env.NODE_ENV === "development") {
            this.log("debug", message, ctx);
        }
    }
}

const defaultLogger = new PrettyLogger();

export function plog(level: LogLevel, message: string, ctx?: LogContext): void {
    defaultLogger.log(level, message, ctx);
}

export function plogInfo(message: string, ctx?: LogContext): void {
    defaultLogger.info(message, ctx);
}

export function plogSuccess(message: string, ctx?: LogContext): void {
    defaultLogger.success(message, ctx);
}

export function plogWarn(message: string, ctx?: LogContext): void {
    defaultLogger.warn(message, ctx);
}

export function plogError(message: string, ctx?: LogContext): void {
    defaultLogger.error(message, ctx);
}

export function plogDebug(message: string, ctx?: LogContext): void {
    defaultLogger.debug(message, ctx);
}

export function getClientIp(headers: Headers | undefined): string {
    if (!headers) return "unknown";
    const fwd = headers.get("x-forwarded-for");
    if (fwd) return fwd.split(",")[0]?.trim() ?? "unknown";
    const real = headers.get("x-real-ip");
    if (real) return real;
    return "unknown";
}

export function getStatusCode(response: Response): number {
    return response.status;
}

export function getPathname(url: string): string {
    try {
        const u = new URL(url);
        return u.pathname;
    } catch {
        return url;
    }
}

export function getQueryParams(url: string): Record<string, string> {
    try {
        const u = new URL(url);
        return Object.fromEntries(u.searchParams.entries());
    } catch {
        return {};
    }
}

