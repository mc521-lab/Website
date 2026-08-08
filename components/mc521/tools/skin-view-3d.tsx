"use client";

import { useEffect, useRef } from "react";
import { IdleAnimation, type PlayerAnimation, SkinViewer } from "skinview3d";

interface SkinView3DProps {
    skin: string | null;
    className?: string;
    overrideConfig?: {
        zoom?: number;
        animation?: PlayerAnimation;
        autoRotate?: boolean;
        autoRotateSpeed?: number;
    };
}

export function SkinView3D({ skin, className, overrideConfig = {} }: SkinView3DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<SkinViewer | null>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const viewer = new SkinViewer({
            canvas: canvasRef.current,
            width: canvasRef.current.clientWidth,
            height: canvasRef.current.clientHeight,
        });
        viewer.zoom = overrideConfig.zoom ?? 0.75;
        viewer.animation = overrideConfig.animation ?? new IdleAnimation();
        viewer.autoRotate = overrideConfig.autoRotate ?? true;
        viewer.autoRotateSpeed = overrideConfig.autoRotateSpeed ?? 0.8;
        viewerRef.current = viewer;

        const handleResize = () => {
            if (!canvasRef.current || !viewerRef.current) return;
            const { clientWidth, clientHeight } = canvasRef.current;
            viewerRef.current.setSize(clientWidth, clientHeight);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            viewer.dispose();
            viewerRef.current = null;
        };
    }, [overrideConfig]);

    useEffect(() => {
        const viewer = viewerRef.current;
        if (!viewer) return;

        if (!skin) {
            viewer.loadSkin(null);
            return;
        }

        viewer.loadSkin(skin).catch(() => {
            // 加载失败时清空
            viewer.loadSkin(null);
        });
    }, [skin]);

    return <canvas ref={canvasRef} className={className} />;
}
