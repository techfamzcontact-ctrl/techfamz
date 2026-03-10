import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { LayoutDashboard, FileText, LogOut, Plus } from "lucide-react";
import { headers } from "next/headers";

export const metadata = {
  title: "Admin Dashboard | Techfamz",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're on the login page — if so, render children without the dashboard shell
  const headersList = await headers();
  const pathname = headersList.get("x-nextjs-path") ?? headersList.get("x-invoke-path") ?? "";

  if (pathname.includes("/admin/login")) {
    return <>{children}</>;
  }

  const session = await getServerSession(authOptions);

  // If no session and not on login page, still render children
  // (the proxy/middleware will redirect to login)
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#040810] flex text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border-glass bg-[rgba(10,16,34,0.5)] backdrop-blur-xl flex flex-col hidden md:flex">
        <div className="p-6 border-b border-border-glass">
          <Link href="/admin" className="text-lg font-bold text-text-primary flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-accent-blue-light">
              T
            </span>
            Techfamz<span className="text-accent-blue-light">Admin</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-2 px-3">
            Blog
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link
            href="/admin/editor/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
          <Link
            href="/blog"
            target="_blank"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-[rgba(255,255,255,0.05)] transition-colors mt-auto"
          >
            <FileText size={18} />
            View Live Blog
          </Link>
        </nav>

        <div className="p-4 border-t border-border-glass">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center text-xs font-bold text-text-muted">
              {session?.user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">Admin</p>
              <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
            </div>
          </div>
          <a
            href="/api/auth/signout"
            className="flex items-center gap-3 px-3 py-2 mt-2 rounded-lg text-sm text-red-400 hover:bg-[rgba(248,113,113,0.1)] transition-colors"
          >
            <LogOut size={18} />
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border-glass bg-[#060B18]">
          <Link href="/admin" className="text-lg font-bold text-text-primary">
            Admin
          </Link>
          <a href="/api/auth/signout" className="text-sm text-text-muted">Logout</a>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
