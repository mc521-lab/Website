import * as runtime from "react/jsx-runtime";
import * as MyComponents from "./my";

// 全局共享组件
const sharedComponents = {
    ...MyComponents,
};

// 将 Velite 生成的 code 解析为 React 组件
const useMDXComponent = (code: string) => {
    const fn = new Function(code);
    return fn({ ...runtime }).default;
};

interface MDXProps {
    code: string;
    components?: Record<string, React.ComponentType<unknown>>;
}

export function MDXContent({ code, components }: MDXProps) {
    const Component = useMDXComponent(code);
    // eslint-disable-next-line react-hooks/static-components
    return <Component components={{ ...sharedComponents, ...components }} />;
}

