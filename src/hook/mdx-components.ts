import { useMDXComponents as getThemeComponents } from "nextra-theme-docs"; // nextra-theme-blog

const themeComponents = getThemeComponents();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useMDXThemeComponents(components?: any) {
    return {
        ...themeComponents,
        ...components,
    };
}

export const useMDXComponents = useMDXThemeComponents;