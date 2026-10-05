import Link from "next/link";
import {
  Plus,
  FileText,
  Briefcase,
  ChevronRight,
  CheckCircle,
  Clock,
  Users,
  Eye,
  MessageSquare,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow, format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalPosts,
    publishedPosts,
    totalJobs,
    publishedJobs,
    totalDevelopers,
    totalViewsResult,
    pendingComments,
    recentDevelopers,
    topPosts,
    recentComments,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { published: true } }),
    prisma.developer.count(),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.comment.count({ where: { isHidden: true } }),
    prisma.developer.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        tid: true,
        role: true,
        country: true,
        createdAt: true,
      },
    }),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { views: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        views: true,
        category: true,
        createdAt: true,
      },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 4,
      include: {
        post: {
          select: { title: true, slug: true },
        },
      },
    }),
  ]);

  const totalViews = totalViewsResult._sum.views || 0;
  const draftPosts = totalPosts - publishedPosts;
  const draftJobs = totalJobs - publishedJobs;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">
            Dashboard
          </h1>
          <p className="text-sm text-text-muted">
            Techfamz operations center & platform performance overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/developers"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-bg-card border border-border-glass text-xs font-semibold text-text-secondary hover:text-text-primary hover:border-accent-blue-glow transition-all"
          >
            <Users size={14} className="text-accent-blue-light" />
            <span>View All TIDs</span>
          </Link>
          <Link
            href="/admin/editor/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-blue text-white text-xs font-semibold hover:bg-blue-600 transition-all shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
          >
            <Plus size={14} />
            <span>New Post</span>
          </Link>
        </div>
      </div>

      {/* Platform Overview Metric Cards */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-3">
          Platform Overview
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Developers */}
          <Link
            href="/admin/developers"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-accent-blue-light/5 group-hover:text-accent-blue-light/10 transition-colors">
              <Users size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Verified Devs
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {totalDevelopers}
            </div>
            <div className="text-[0.7rem] text-accent-blue-light flex items-center gap-1 relative z-10">
              <CheckCircle size={11} /> Community TIDs
            </div>
          </Link>

          {/* Total Blog Views */}
          <Link
            href="/admin/posts"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-cyan-400/5 group-hover:text-cyan-400/10 transition-colors">
              <Eye size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Total Blog Views
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {totalViews.toLocaleString()}
            </div>
            <div className="text-[0.7rem] text-cyan-400 flex items-center gap-1 relative z-10">
              <Sparkles size={11} /> Article reads
            </div>
          </Link>

          {/* Published Posts */}
          <Link
            href="/admin/posts"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-green-400/5 group-hover:text-green-400/10 transition-colors">
              <FileText size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Live Articles
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {publishedPosts}
            </div>
            <div className="text-[0.7rem] text-green-400 flex items-center gap-1 relative z-10">
              <CheckCircle size={11} />
              {draftPosts > 0 ? `${draftPosts} drafts` : "All published"}
            </div>
          </Link>

          {/* Active Jobs */}
          <Link
            href="/admin/jobs"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-emerald-400/5 group-hover:text-emerald-400/10 transition-colors">
              <Briefcase size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Active Jobs
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {publishedJobs}
            </div>
            <div className="text-[0.7rem] text-emerald-400 flex items-center gap-1 relative z-10">
              <CheckCircle size={11} />
              {draftJobs > 0 ? `${draftJobs} unpublished` : "Open listings"}
            </div>
          </Link>

          {/* Comments Moderation */}
          <Link
            href="/admin/comments"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-purple-400/5 group-hover:text-purple-400/10 transition-colors">
              <MessageSquare size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Hidden Comments
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {pendingComments}
            </div>
            <div
              className={`text-[0.7rem] flex items-center gap-1 relative z-10 ${
                pendingComments > 0 ? "text-amber-400" : "text-text-muted"
              }`}
            >
              {pendingComments > 0 ? (
                <>
                  <ShieldAlert size={11} /> Needs review
                </>
              ) : (
                <>
                  <CheckCircle size={11} /> Moderated
                </>
              )}
            </div>
          </Link>

          {/* Drafts Summary */}
          <Link
            href="/admin/posts"
            className="bg-bg-card border border-border-glass rounded-xl p-4.5 relative overflow-hidden group hover:border-accent-blue-glow transition-all"
          >
            <div className="absolute -right-3 -top-3 text-amber-400/5 group-hover:text-amber-400/10 transition-colors">
              <Clock size={65} />
            </div>
            <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-1 relative z-10">
              Total Drafts
            </div>
            <div className="text-2xl font-bold text-text-primary mb-1 relative z-10">
              {draftPosts + draftJobs}
            </div>
            <div className="text-[0.7rem] text-amber-400 flex items-center gap-1 relative z-10">
              <Clock size={11} /> Posts & jobs
            </div>
          </Link>
        </div>
      </div>

      {/* Main Two-Column Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent TID Registrations */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-border-glass mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent-blue/10 text-accent-blue-light flex items-center justify-center">
                <Users size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Recent TID Claims
                </h3>
                <p className="text-[0.7rem] text-text-muted">
                  Latest developers to claim Techfamz Identity
                </p>
              </div>
            </div>
            <Link
              href="/admin/developers"
              className="text-xs font-medium text-accent-blue-light hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {recentDevelopers.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No developer registrations yet.
              </div>
            ) : (
              recentDevelopers.map((dev) => (
                <div
                  key={dev.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-bg-primary/40 hover:bg-bg-primary/70 transition-colors border border-transparent hover:border-border-glass"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-text-primary truncate">
                        {dev.fullName}
                      </span>
                      <span className="font-mono text-[0.65rem] px-1.5 py-0.2 rounded bg-accent-blue-glow-soft text-accent-blue-light border border-accent-blue-glow/30 shrink-0">
                        {dev.tid}
                      </span>
                    </div>
                    <div className="text-[0.7rem] text-text-muted truncate mt-0.5">
                      {dev.role} {dev.country ? `· ${dev.country}` : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[0.68rem] text-text-muted whitespace-nowrap">
                      {dev.createdAt
                        ? formatDistanceToNow(new Date(dev.createdAt), {
                            addSuffix: true,
                          })
                        : ""}
                    </span>
                    <Link
                      href={`/tid/${dev.tid}`}
                      target="_blank"
                      className="p-1 text-text-muted hover:text-accent-blue-light transition-colors"
                      title="View TID Card"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Read Articles */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 flex flex-col shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-border-glass mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/10 text-cyan-400 flex items-center justify-center">
                <Eye size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Top Performing Articles
                </h3>
                <p className="text-[0.7rem] text-text-muted">
                  Highest engagement on the Techfamz blog
                </p>
              </div>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-accent-blue-light hover:underline flex items-center gap-1"
            >
              <span>Manage Posts</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="flex-1 space-y-2.5">
            {topPosts.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                No published articles yet.
              </div>
            ) : (
              topPosts.map((post, idx) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-bg-primary/40 hover:bg-bg-primary/70 transition-colors border border-transparent hover:border-border-glass"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[0.68rem] font-bold text-text-muted w-4 shrink-0">
                        #{idx + 1}
                      </span>
                      <Link
                        href={`/admin/editor/${post.id}`}
                        className="font-medium text-xs text-text-primary hover:text-accent-blue-light transition-colors truncate"
                      >
                        {post.title}
                      </Link>
                    </div>
                    {post.category && (
                      <div className="text-[0.68rem] text-text-muted mt-0.5 ml-6">
                        {post.category}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-cyan-400 flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-400/10 border border-cyan-400/20">
                      <Eye size={12} />
                      {post.views.toLocaleString()}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="p-1 text-text-muted hover:text-accent-blue-light transition-colors"
                      title="View Live Article"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Moderation & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Comments Feed */}
        <div className="lg:col-span-2 bg-bg-card border border-border-glass rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3.5 border-b border-border-glass mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-400/10 text-purple-400 flex items-center justify-center">
                <MessageSquare size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-text-primary">
                  Recent Discussions & Comments
                </h3>
                <p className="text-[0.7rem] text-text-muted">
                  Community interactions on blog articles
                </p>
              </div>
            </div>
            <Link
              href="/admin/comments"
              className="text-xs font-medium text-accent-blue-light hover:underline flex items-center gap-1"
            >
              <span>Moderation Queue</span>
              <ChevronRight size={13} />
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentComments.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">
                No comments submitted yet.
              </div>
            ) : (
              recentComments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 rounded-lg bg-bg-primary/40 border border-border-glass/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-text-primary">
                        {comment.name || "Anonymous"}
                      </span>
                      <span className="text-[0.7rem] text-text-muted">on</span>
                      <span className="text-xs text-accent-blue-light truncate max-w-xs">
                        {comment.post.title}
                      </span>
                      {comment.isHidden && (
                        <span className="text-[0.62rem] px-1.5 py-0.2 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 uppercase font-bold">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-1 italic">
                      &ldquo;{comment.content}&rdquo;
                    </p>
                  </div>
                  <div className="text-[0.68rem] text-text-muted whitespace-nowrap self-end sm:self-center">
                    {comment.createdAt
                      ? format(new Date(comment.createdAt), "MMM d, HH:mm")
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Launchpad */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 flex flex-col shadow-sm">
          <h3 className="text-sm font-bold text-text-primary mb-1">
            Quick Launchpad
          </h3>
          <p className="text-[0.7rem] text-text-muted mb-4">
            Direct shortcuts to key administration tools
          </p>

          <div className="space-y-2.5 flex-1">
            <Link
              href="/admin/editor/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 hover:bg-bg-primary border border-border-glass hover:border-accent-blue-glow transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent-blue/10 text-accent-blue-light group-hover:bg-accent-blue group-hover:text-white flex items-center justify-center transition-colors">
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary">
                  Draft New Article
                </div>
                <div className="text-[0.68rem] text-text-muted">
                  Rich-text blog authoring
                </div>
              </div>
              <ChevronRight size={14} className="text-text-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/jobs/editor/new"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 hover:bg-bg-primary border border-border-glass hover:border-emerald-400/40 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-400/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center transition-colors">
                <Briefcase size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary">
                  Post Tech Job
                </div>
                <div className="text-[0.68rem] text-text-muted">
                  Publish career opportunities
                </div>
              </div>
              <ChevronRight size={14} className="text-text-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>

            <Link
              href="/admin/developers"
              className="flex items-center gap-3 p-3 rounded-lg bg-bg-primary/50 hover:bg-bg-primary border border-border-glass hover:border-accent-blue-glow transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-400/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white flex items-center justify-center transition-colors">
                <Users size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-text-primary">
                  Export Talent CSV
                </div>
                <div className="text-[0.68rem] text-text-muted">
                  Download developer directory
                </div>
              </div>
              <ChevronRight size={14} className="text-text-muted group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
