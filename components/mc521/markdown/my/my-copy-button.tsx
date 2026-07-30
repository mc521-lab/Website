"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

export function MyCopyButton({ text, copyText, ...props }: { text: string; copyText?: string }) {
    const textToCopy = copyText || text;
    const onCopy = async () => {
        try {
            // Prefer the modern Clipboard API when available
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(textToCopy);
                toast.success("已复制", { duration: 2000, position: "bottom-right" });
            } else {
                // Fallback for non-secure contexts or older browsers
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed";
                textArea.style.left = "-9999px";
                textArea.style.top = "-9999px";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                const successful = document.execCommand("copy");
                document.body.removeChild(textArea);
                toast.success("已复制", { duration: 2000, position: "bottom-right" });
                if (!successful) {
                    throw new Error("Fallback copy command failed");
                }
            }
        } catch (err) {
            console.error("Failed to copy text:", err);
            toast.error("复制失败", { duration: 2000, position: "bottom-right" });
        }
    };

    return (
        <Button
            variant="default"
            className="inline-flex items-center gap-2 font-mono"
            onClick={onCopy}
            aria-label={"Click to copy command:" + textToCopy}
            {...props}>
            {text}
            <CopyIcon className="size-3 translate-y-px" />
        </Button>
    );
}

