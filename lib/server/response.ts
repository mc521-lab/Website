import { NextRequest, NextResponse } from "next/server";

export function success<T>(data: T, init?: ResponseInit) {
    return NextResponse.json({ success: true as const, data, message: null as string | null }, init);
}

export function failure(message: string, status: number = 400) {
    return NextResponse.json({ success: false as const, message }, { status });
}

export type { NextRequest };
