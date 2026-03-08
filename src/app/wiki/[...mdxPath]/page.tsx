import { generateStaticParamsFor, importPage } from "nextra/pages";
import { useMDXThemeComponents as getMDXComponents } from "@/hook/mdx-components";

export const generateStaticParams = generateStaticParamsFor("mdxPath");

type Params = { mdxPath?: string[] };
type Props = { params: Promise<Params> };

export async function generateMetadata(props: Props) {
    const { mdxPath = [] } = await props.params;
    const { metadata } = await importPage(["wiki", ...mdxPath]);
    return metadata;
}

const Wrapper = getMDXComponents().wrapper;

export default async function Page(props: Props) {
    const { mdxPath = [] } = await props.params;
    const { default: MDXContent, toc, metadata, sourceCode } = await importPage(["wiki", ...mdxPath]);

    return (
        <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
            <MDXContent params={{ mdxPath }} />
        </Wrapper>
    );
}
