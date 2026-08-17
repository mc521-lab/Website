"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export type ExperimentalFlag = {
    id: string;
    label: string;
    description?: string;
    disabled?: boolean;
};

export const EXPERIMENTAL_NEW_UI_FLAG = "experimental-new-ui-style";
export const EXPERIMENTAL_FLAGS_STORAGE_KEY = "mc521_experimental_flags";
export const EXPERIMENTAL_FLAGS_CHANGE_EVENT = "mc521-experimental-flags-changed";

export const EXPERIMENTAL_FLAGS: ExperimentalFlag[] = [
    {
        id: EXPERIMENTAL_NEW_UI_FLAG,
        label: "实验性功能：新界面风格",
        description: "经过重新组织的全站页面风格",
        disabled: true,
    },
];

/** 根据 id 查找 flag 定义 */
function getFlagDefinition(flagId: string): ExperimentalFlag | undefined {
    return EXPERIMENTAL_FLAGS.find((flag) => flag.id === flagId);
}

/** 判断某 flag 是否在定义中被标记为 disabled */
function isFlagDisabled(flagId: string): boolean {
    return getFlagDefinition(flagId)?.disabled === true;
}

/**
 * 过滤掉当前定义中已 disabled 的 flag，避免本地历史数据继续生效。
 */
function sanitizeFlags(flags: string[]): string[] {
    return flags.filter((flagId) => !isFlagDisabled(flagId));
}

function readStoredFlags(): string[] {
    if (typeof window === "undefined") {
        return [];
    }

    const raw = window.localStorage.getItem(EXPERIMENTAL_FLAGS_STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            const valid = parsed.filter((flag): flag is string => typeof flag === "string");
            return sanitizeFlags(valid);
        }
    } catch {
        return [];
    }

    return [];
}

function writeStoredFlags(flags: string[]) {
    if (typeof window === "undefined") {
        return;
    }

    // 写入前再次过滤，确保 disabled 的 flag 不会被持久化
    const sanitized = sanitizeFlags(flags);
    window.localStorage.setItem(EXPERIMENTAL_FLAGS_STORAGE_KEY, JSON.stringify(sanitized));
    window.dispatchEvent(new Event(EXPERIMENTAL_FLAGS_CHANGE_EVENT));
}

/**
 * 判断 flag 是否启用。
 * 若定义中 disabled 为 true，无论本地是否存有启用记录，均强制返回 false。
 */
export function hasExperimentalFlag(flagId: string, flags: string[]) {
    if (isFlagDisabled(flagId)) {
        return false;
    }
    return flags.includes(flagId);
}

export function useExperimentalFlags() {
    const [enabledFlags, setEnabledFlagsState] = useState<string[]>(() => readStoredFlags());

    const syncFromStorage = useCallback(() => {
        setEnabledFlagsState(readStoredFlags());
    }, []);

    const setEnabledFlags = useCallback((nextFlags: string[] | ((current: string[]) => string[])) => {
        setEnabledFlagsState((current) => {
            const resolved = typeof nextFlags === "function" ? nextFlags(current) : nextFlags;
            // sanitize 会移除 disabled 的 flag，writeStoredFlags 也会再做一次
            const sanitized = sanitizeFlags(resolved);
            writeStoredFlags(sanitized);
            return sanitized;
        });
    }, []);

    useEffect(() => {
        syncFromStorage();

        window.addEventListener("storage", syncFromStorage);
        window.addEventListener(EXPERIMENTAL_FLAGS_CHANGE_EVENT, syncFromStorage);

        return () => {
            window.removeEventListener("storage", syncFromStorage);
            window.removeEventListener(EXPERIMENTAL_FLAGS_CHANGE_EVENT, syncFromStorage);
        };
    }, [syncFromStorage]);

    const isEnabled = useCallback(
        (flagId: string) => {
            if (isFlagDisabled(flagId)) {
                return false;
            }
            return enabledFlags.includes(flagId);
        },
        [enabledFlags]
    );

    return useMemo(
        () => ({
            enabledFlags,
            setEnabledFlags,
            isEnabled,
            refresh: syncFromStorage,
        }),
        [enabledFlags, isEnabled, setEnabledFlags, syncFromStorage]
    );
}
