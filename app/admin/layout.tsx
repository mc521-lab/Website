import { AdminNavBar } from "@/app/admin/_components/admin-nav-bar";
import { AuthGuard } from "@/app/admin/_components/auth-guard";

export default function AdminLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthGuard>
            <AdminNavBar />
            {children}
        </AuthGuard>
    );
}

