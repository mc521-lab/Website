"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoBackground() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // 使用 Intersection Observer 检测视频是否在视口内
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0 }
        );

        if (videoRef.current) {
            observer.observe(videoRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <video
            ref={videoRef}
            className="absolute top-0 left-0 h-full w-full object-cover"
            src={isVisible ? "/videos/mc-background-video.webm" : undefined}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
        />
    );
}
