import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, FileText, LogOut, Plus, Briefcase, MessageSquare } from "lucide-react";
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
      <aside className="w-64 border-r border-border-glass  flex flex-col hidden md:flex h-screen sticky top-0" style={{ backgroundColor: "var(--surface-glass)" }}>
        <div className="p-6 border-b border-border-glass">
          <Link href="/admin" className="text-lg font-bold text-text-primary flex items-center gap-2 group">
            <div className="flex items-center justify-center w-[32px] h-[32px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.9)] overflow-hidden bg-[rgba(255,255,255,0.05)] shrink-0 transition-transform group-hover:scale-105">
              <Image src="/logo.png" alt="Techfamz logo" width={28} height={28} className="object-contain" />
            </div>
            <span>Techfamz <span className="text-accent-blue-light">Admin</span></span>
          </Link>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors mb-2"
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-2 px-3 mt-4">
            Blog
          </div>
          <Link
            href="/admin/posts"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <FileText size={18} />
            Posts
          </Link>
          <Link
            href="/admin/editor/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Plus size={18} />
            New Post
          </Link>
          <Link
            href="/admin/comments"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <MessageSquare size={18} />
            Comments
          </Link>

          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-2 px-3 mt-6">
            Jobs
          </div>
          <Link
            href="/admin/jobs"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Briefcase size={18} />
            Tech Jobs
          </Link>
          <Link
            href="/admin/jobs/editor/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Plus size={18} />
            Post Job
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
