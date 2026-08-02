import { NextRequest, NextResponse } from "next/server";
import { createHandler } from "@/lib/server/with-logger";
import { put } from "@vercel/blob";

export const POST = createHandler(async (request: NextRequest, context, log) => {
    const { filename } = await context.params;
    const decodedFilename = decodeURIComponent(filename);

    log.debug("Uploading skin file", { filename: decodedFilename });

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
        log.warn("Missing file field");
        return NextResponse.json({ error: "missing file field" }, { status: 400 });
    }

    const blob = await put(`SkinDrop/${decodedFilename}`, file, {
        access: "public",
        addRandomSuffix: false,
    });

    log.info("Skin uploaded", { url: blob.url });

    return NextResponse.json({ success: true, url: blob.url });
});

export const runtime = "nodejs";
