"use client";

import { useRef, useEffect, useMemo, useCallback, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PlayerAnimator, glTFDatasets, PlayerPose, PlayerGltfBuilder, CapeAnimator, CapeGltfBuilder } from "@/lib/gltf";

export interface PlayerRenderProps {
    /** 预期的类型："wide" 或 "slim" */
    type?: "wide" | "slim";
    skinUrl?: string;
    capeUrl?: string;
    waveOnLoad?: boolean;
}

export interface PlayerRenderRef {
    onFaceFront: () => Promise<void>;
    onStartWave: () => void;
}

const PlayerRender = forwardRef<PlayerRenderRef, PlayerRenderProps>(
    ({ type = "wide", skinUrl = "https://minotar.net/skin/MHF_Steve", capeUrl, waveOnLoad }, ref) => {
        const containerRef = useRef<HTMLDivElement>(null);

        const sceneRef = useRef<THREE.Scene>(new THREE.Scene());
        const cameraRef = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera(75, 1, 0.1, 1000));
        const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
        const controlsRef = useRef<OrbitControls | null>(null);
        const playerAnimatorRef = useRef<PlayerAnimator | null>(null);
        const capeAnimatorRef = useRef<CapeAnimator | null>(null);
        const isWavingSequenceRef = useRef(false);
        const faceFrontTargetRef = useRef<number | null>(null);
        const faceFrontResolveRef = useRef<(() => void) | null>(null);
        const faceFrontPromiseRef = useRef<Promise<void> | null>(null);
        const loadQueueRef = useRef(Promise.resolve());
        const didInitLoadRef = useRef(false);
        const frameRef = useRef(0);
        const animationFrameIdRef = useRef<number | null>(null);

        // 预先计算挥手骨骼动画插值
        const wavePose = useMemo(
            () =>
                PlayerPose.diff(
                    type === "wide" ? new glTFDatasets.WideIdleDataset().getNodes() : new glTFDatasets.SlimIdleDataset().getNodes(),
                    type === "wide" ? new glTFDatasets.WideActionDataset().getNodes() : new glTFDatasets.SlimActionDataset().getNodes()
                ),
            [type]
        );
        const idlePose = useMemo(() => new PlayerPose("idle", []), []);

        const sleep = useCallback((ms: number): Promise<void> => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        }, []);

        const randInt = useCallback((min: number, max: number): number => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }, []);

        const cleanScene = useCallback(async () => {
            playerAnimatorRef.current = null;
            const scene = sceneRef.current;
            const children = [...scene.children];
            scene.remove(...children);
        }, []);

        const loadScene = useCallback(async () => {
            const scene = sceneRef.current;
            const camera = cameraRef.current;
            const controls = controlsRef.current;

            const brightness = 1;
            scene.add(new THREE.AmbientLight(0xffffff, brightness));

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.intensity = 2;
            directionalLight.position.set(3, 5, 3);
            scene.add(directionalLight);

            const dataset = type === "wide" ? new glTFDatasets.WideIdleDataset() : new glTFDatasets.SlimIdleDataset();

            const playerBuilder = new PlayerGltfBuilder().customUrl(skinUrl).dataset(dataset);
            playerAnimatorRef.current = await playerBuilder.loadIntoScene(scene);

            let hasCape = false;
            if (capeUrl) {
                const capeBuilder = new CapeGltfBuilder().customUrl(capeUrl);
                capeAnimatorRef.current = await capeBuilder.loadIntoScene(scene);
                hasCape = true;
            }

            const player =
                scene.children.find((c) => c.type === "Group" && c.children.length > 10) ||
                scene.children[scene.children.length - (hasCape ? 2 : 1)];

            if (!player) {
                console.error({ category: "Player Render", message: "未找到玩家模型" });
                return;
            }

            const box = new THREE.Box3().setFromObject(player);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            player.position.sub(center);
            player.rotation.y = Math.PI;

            const scale = 0.4;
            player.scale.set(scale, scale, scale);
            player.position.y -= size.y * scale * 3.75;

            camera.position.set(0, size.y * scale * 0.75, size.z * scale * 3);
            camera.lookAt(0, size.y * scale * 0.5, 0);

            if (controls) {
                controls.target.set(0, size.y * scale * 0.5, 0);
                controls.update();
            }
        }, [type, skinUrl, capeUrl]);

        const reload = useCallback(async () => {
            await cleanScene();
            await loadScene();
        }, [cleanScene, loadScene]);

        const startWaveSequence = useCallback(async () => {
            if (isWavingSequenceRef.current || !playerAnimatorRef.current) return;

            isWavingSequenceRef.current = true;

            const doOneWave = async () => {
                playerAnimatorRef.current!.transitionTo(wavePose, 400);
                await sleep(400 + 1000);

                playerAnimatorRef.current!.transitionTo(idlePose, 400);
                await sleep(400 + 300);

                isWavingSequenceRef.current = false;
            };

            doOneWave();
        }, [wavePose, idlePose, sleep]);

        const enqueueReload = useCallback(
            (playWave = false) => {
                const task = async () => {
                    await reload();
                    if (playWave) {
                        startWaveSequence();
                    }
                };

                const next = loadQueueRef.current.then(task, task);
                loadQueueRef.current = next.catch(() => undefined);
                return next;
            },
            [reload, startWaveSequence]
        );

        const onFaceFront = useCallback(() => {
            if (faceFrontPromiseRef.current) {
                return faceFrontPromiseRef.current;
            }

            const promise = new Promise<void>((resolve) => {
                faceFrontResolveRef.current = resolve;
            });

            faceFrontTargetRef.current = 0;
            faceFrontPromiseRef.current = promise;
            return promise;
        }, []);

        const onStartWave = useCallback(() => {
            if (!playerAnimatorRef.current) return;
            startWaveSequence();
        }, [startWaveSequence]);

        useImperativeHandle(ref, () => ({
            onFaceFront,
            onStartWave,
        }), [onFaceFront, onStartWave]);

        const onResize = useCallback(() => {
            const container = containerRef.current;
            if (!container) return;

            const width = container.clientWidth;
            const height = container.clientHeight;

            if (width === 0 || height === 0) return;

            const camera = cameraRef.current;
            const renderer = rendererRef.current;
            if (!renderer) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        }, []);

        // 初始化
        useEffect(() => {
            const container = containerRef.current;
            if (!container) return;

            const camera = cameraRef.current;
            const scene = sceneRef.current;

            if (!rendererRef.current) {
                rendererRef.current = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            }

            const renderer = rendererRef.current;
            if (!renderer) return;

            const width = container.clientWidth;
            const height = container.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            const resizeObserver = new ResizeObserver(() => {
                onResize();
            });
            resizeObserver.observe(container);

            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.domElement.style.display = "block";
            renderer.domElement.style.maxWidth = "100%";
            renderer.domElement.style.maxHeight = "100%";
            container.appendChild(renderer.domElement);

            const controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.enablePan = false;
            controls.minDistance = 1;
            controls.maxDistance = 10;
            controlsRef.current = controls;

            let cancelled = false;

            void enqueueReload(Boolean(waveOnLoad));

            const animate = () => {
                animationFrameIdRef.current = requestAnimationFrame(animate);

                controls.update();
                playerAnimatorRef.current?.update();
                capeAnimatorRef.current?.update();

                if (faceFrontTargetRef.current !== null) {
                    const target = faceFrontTargetRef.current;
                    const current = scene.rotation.y;
                    const delta = THREE.MathUtils.euclideanModulo(target - current + Math.PI, Math.PI * 2) - Math.PI;
                    scene.rotation.y = current + delta * 0.18;

                    if (Math.abs(delta) < 0.01) {
                        scene.rotation.y = target;
                        faceFrontTargetRef.current = null;
                        faceFrontResolveRef.current?.();
                        faceFrontResolveRef.current = null;
                        faceFrontPromiseRef.current = null;
                    }
                } else if (!isWavingSequenceRef.current) {
                    scene.rotation.y += 0.005;
                }

                if (frameRef.current % 100 === 0) {
                    capeAnimatorRef.current?.transitionTo(randInt(0, 4), 400);
                }

                renderer.render(scene, camera);
                frameRef.current += 1;
            };
            animate();

            onResize();
            window.addEventListener("resize", onResize);

            return () => {
                cancelled = true;
                if (animationFrameIdRef.current !== null) {
                    cancelAnimationFrame(animationFrameIdRef.current);
                }
                resizeObserver.disconnect();
                // window.removeEventListener("resize", onResize);
                controls.dispose();
                renderer.dispose();
                rendererRef.current = null;
                if (renderer.domElement.parentNode === container) {
                    container.removeChild(renderer.domElement);
                }
            };
        }, [enqueueReload, onResize, waveOnLoad]); // 仅挂载时执行

        useEffect(() => {
            if (!didInitLoadRef.current) {
                didInitLoadRef.current = true;
                return;
            }

            void enqueueReload();
        }, [type, skinUrl, capeUrl, enqueueReload]);

        return (
            <div
                ref={containerRef}
                className="relative h-full w-full max-w-full min-w-0 overflow-hidden"
                style={{ width: "100%", height: "100%", minWidth: 0, maxWidth: "100%" }}
            />
        );
    }
);

PlayerRender.displayName = "PlayerRender";

export default PlayerRender;
