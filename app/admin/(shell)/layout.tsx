import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import LogoutButton from "@/components/shared/LogoutButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AdminMetricsProvider, AdminMobileNav, AdminSidebar } from "@/components/admin/AdminNav";
import { ConfirmProvider } from "@/components/admin/ConfirmProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  const email = session.user?.email ?? "";

  const accountFooter = (
    <>
      <div className="mt-2 flex items-center gap-2.5 px-3 py-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-blue-glow-soft text-xs font-semibold text-accent-blue-light">
          {email.charAt(0).toUpperCase()}
        </div>
        <p className="min-w-0 flex-1 truncate text-xs text-text-secondary" title={email}>
          {email}
        </p>
        <ThemeToggle />
      </div>
      <LogoutButton />
    </>
  );

  return (
    <AdminMetricsProvider>
      <ConfirmProvider>
        <div className="flex min-h-screen bg-bg-primary text-text-primary">
          {/* Sidebar */}
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-border-glass bg-bg-secondary md:block">
            <AdminSidebar footer={accountFooter} />
          </aside>

          {/* Main Content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Mobile Header */}
            <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border-glass bg-bg-primary/95 px-3 backdrop-blur md:hidden">
              <div className="flex items-center gap-1">
                <AdminMobileNav footer={accountFooter} />
                <span className="text-sm font-semibold">Techfamz Admin</span>
              </div>
              <ThemeToggle />
            </header>

            <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 md:px-8 md:py-8">
              {children}
            </main>
          </div>
        </div>
        <Toaster position="bottom-right" richColors closeButton />
      </ConfirmProvider>
    </AdminMetricsProvider>
  );
}
