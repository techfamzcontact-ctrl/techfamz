import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, FileText, LogOut, Plus } from "lucide-react";
import LogoutButton from "@/components/shared/LogoutButton";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileAdminNav } from "@/components/layout/MobileAdminNav";

export const metadata = {
  title: "Admin Dashboard | Techfamz",
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

  return (
    <div className="min-h-screen bg-bg-primary flex text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-glass backdrop-blur-xl flex flex-col hidden md:flex" style={{ backgroundColor: "var(--surface-glass)" }}>
        <div className="p-6 border-b border-border-glass">
          <Link href="/admin" className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-accent-blue-light">
              T
            </span>
            Techfamz <span className="text-accent-blue-light">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-2 px-3">
            Blog
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/admin/editor/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors mt-auto"
          >
            <FileText size={18} />
            View Live Blog
          </Link>
        </nav>

        <div className="p-4 border-t border-border-glass">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-bg-card border border-border-glass flex items-center justify-center text-xs font-bold text-text-muted">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {session?.user?.email}
              </p>
            </div>
            <ThemeToggle />
          </div>
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border-glass bg-bg-primary relative z-50">
          <div className="flex items-center gap-2">
            <MobileAdminNav />
            <Link href="/admin" className="text-lg font-bold text-text-primary">
              Admin
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LogoutButton />
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
