import { ExperimentalWrapper } from "../../wrapper";
import { ExperimentalSectionLayout } from "./experimental";
import { LegacySectionLayout } from "./legacy";

export function SectionLayout({
    children,
    newProps,
    oldProps,
    generalProps,
}: {
    children: React.ReactNode;
    newProps?: object;
    oldProps?: object;
    generalProps?: object;
}) {
    return (
        <ExperimentalWrapper
            rulesets={[
                [
                    "experimental-new-ui-style",
                    ExperimentalSectionLayout,
                    LegacySectionLayout,
                    { ...generalProps, ...newProps },
                    { ...generalProps, ...oldProps },
                ],
            ]}
        >
            {children}
        </ExperimentalWrapper>
    );
}
