"use client";

import { useExperimentalFlags } from "@/hooks/use-experimental-flags";

type ExperimentalWrapperRule = [
    flag: string,
    enabled: React.ElementType,
    disabled: React.ElementType,
    truthyProps?: object,
    falsyProps?: object,
];

interface ExperimentalWrapperProps {
    rulesets: ExperimentalWrapperRule[];
    children: React.ReactNode;
}

export function ExperimentalWrapper({ rulesets, children }: ExperimentalWrapperProps) {
    const { enabledFlags } = useExperimentalFlags();

    return rulesets.reduceRight((content, [flag, Enabled, Disabled, truthyProps, falsyProps]) => {
        const Wrapper = enabledFlags.includes(flag) ? Enabled : Disabled;
        const WrapperProps = enabledFlags.includes(flag) ? truthyProps : falsyProps;

        return <Wrapper {...WrapperProps}>{content}</Wrapper>;
    }, children);
}
