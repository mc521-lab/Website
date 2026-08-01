"use client";

import Image from "next/image";
import { ImageOff } from "lucide-react";
import { useState } from "react";

export function GalleryItemImage({ src, alt, size = 38 }: { src: string; alt: string; size?: number }) {
    const [failed, setFailed] = useState(false);

    return (
        <span className="gallery-item-image-frame" style={{ width: size + 10, height: size + 10 }}>
            {failed ? (
                <ImageOff aria-label={`${alt}图标加载失败`} size={Math.round(size * 0.58)} strokeWidth={1.7} />
            ) : (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    unoptimized
                    className="gallery-item-image"
                    onError={() => setFailed(true)}
                />
            )}
        </span>
    );
}
