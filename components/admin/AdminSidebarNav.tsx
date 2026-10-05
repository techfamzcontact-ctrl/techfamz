"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  Plus,
  MessageSquare,
  Briefcase,
  Settings,
  ExternalLink,
} from "lucide-react";
import { getAdminSidebarMetrics } from "@/app/admin/actions";

export function AdminSidebarNav() {
  const pathname = usePathname();
  const [metrics, setMetrics] = useState<{
    pendingComments: number;
    draftPosts: number;
    draftJobs: number;
  }>({
    pendingComments: 0,
    draftPosts: 0,
    draftJobs: 0,
  });

  useEffect(() => {
    getAdminSidebarMetrics()
      .then(setMetrics)
      .catch(() => {});
  }, [pathname]);

  const isActive = (path: string, exact = false) => {
    if (exact) return pathname === path;
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const navLinkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-accent-blue/15 text-accent-blue-light border border-accent-blue-glow/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]"
        : "text-text-secondary hover:text-text-primary hover:bg-bg-card border border-transparent"
    }`;

  return (
    <nav className="flex-1 p-4 flex flex-col gap-1 overflow-y-auto">
      {/* Overview */}
      <Link
        href="/admin"
        className={navLinkClass(isActive("/admin", true))}
      >
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>

      {/* Community */}
      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1 px-3 mt-4">
        Community
      </div>
      <Link
        href="/admin/developers"
        className={navLinkClass(isActive("/admin/developers"))}
      >
        <Users size={18} />
        <span>Developers / TIDs</span>
      </Link>

      {/* Blog */}
      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1 px-3 mt-4">
        Blog
      </div>
      <Link
        href="/admin/posts"
        className={navLinkClass(isActive("/admin/posts"))}
      >
        <FileText size={18} />
        <span className="flex-1">Posts</span>
        {metrics.draftPosts > 0 && (
          <span className="text-[0.65rem] px-1.5 py-0.2 rounded bg-bg-card text-text-muted border border-border-glass">
            {metrics.draftPosts} draft
          </span>
        )}
      </Link>
      <Link
        href="/admin/editor/new"
        className={navLinkClass(isActive("/admin/editor/new", true))}
      >
        <Plus size={18} />
        <span>New Post</span>
      </Link>
      <Link
        href="/admin/comments"
        className={navLinkClass(isActive("/admin/comments"))}
      >
        <MessageSquare size={18} />
        <span className="flex-1">Comments</span>
        {metrics.pendingComments > 0 && (
          <span className="text-[0.65rem] font-bold px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-400 border border-amber-400/30">
            {metrics.pendingComments}
          </span>
        )}
      </Link>

      {/* Jobs */}
      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1 px-3 mt-4">
        Jobs
      </div>
      <Link
        href="/admin/jobs"
        className={navLinkClass(isActive("/admin/jobs"))}
      >
        <Briefcase size={18} />
        <span className="flex-1">Tech Jobs</span>
        {metrics.draftJobs > 0 && (
          <span className="text-[0.65rem] px-1.5 py-0.2 rounded bg-bg-card text-text-muted border border-border-glass">
            {metrics.draftJobs} draft
          </span>
        )}
      </Link>
      <Link
        href="/admin/jobs/editor/new"
        className={navLinkClass(isActive("/admin/jobs/editor/new", true))}
      >
        <Plus size={18} />
        <span>Post Job</span>
      </Link>

      {/* System */}
      <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1 px-3 mt-4">
        System
      </div>
      <Link
        href="/admin/settings"
        className={navLinkClass(isActive("/admin/settings"))}
      >
        <Settings size={18} />
        <span>Settings</span>
      </Link>

      {/* Live links */}
      <div className="mt-auto pt-4 border-t border-border-glass">
        <Link
          href="/blog"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
        >
          <span className="flex items-center gap-2">
            <FileText size={15} />
            Live Blog
          </span>
          <ExternalLink size={13} />
        </Link>
      </div>
    </nav>
  );
}
