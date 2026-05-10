import data from "./data.json";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json(data, {
        headers: {
            "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
    });
}
