import { Mc521 } from "@/components";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return <Mc521.NavigationWrapper suppressHydrationWarning>{children}</Mc521.NavigationWrapper>;
}
