import Link from "next/link";
import { Plus, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { PageHeader, StatCard, Panel, StatusBadge, EmptyState } from "@/components/admin/AdminUI";
import BarChart from "@/components/animata/graphs/bar-chart";
import DonutChart from "@/components/animata/graphs/donut-chart";
import Counter from "@/components/animata/text/counter";
import { countByMonth, percent, startOfMonthUTC } from "@/lib/analytics";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalPosts,
    publishedPosts,
    totalJobs,
    publishedJobs,
    totalDevelopers,
    totalViewsResult,
    totalComments,
    hiddenComments,
    recentRegistrations,
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
    prisma.comment.count(),
    prisma.comment.count({ where: { isHidden: true } }),
    prisma.developer.findMany({
      where: { createdAt: { gte: startOfMonthUTC(new Date(), 5) } },
      select: { createdAt: true },
    }),
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
      },
    }),
    prisma.comment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
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
  const now = new Date();
  const registrationsByMonth = countByMonth(
    recentRegistrations.map((d) => d.createdAt),
    startOfMonthUTC(now, 5),
    now
  );
  const publishedPct = percent(publishedPosts, totalPosts);
  const visibleComments = totalComments - hiddenComments;
  const visiblePct = percent(visibleComments, totalComments);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Content, TID registrations and community activity at a glance."
        actions={
          <>
            <Button asChild variant="outline" size="xs">
              <Link href="/admin/jobs/editor/new">
                <Plus size={14} />
                Post a job
              </Link>
            </Button>
            <Button asChild size="xs">
              <Link href="/admin/editor/new">
                <Plus size={14} />
                New post
              </Link>
            </Button>
          </>
        }
      />

      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5 mb-8">
        <StatCard label="TID holders" value={<Counter targetValue={totalDevelopers} />} hint="Registered developers" href="/admin/developers" />
        <StatCard
          label="Published posts"
          value={<Counter targetValue={publishedPosts} />}
          hint={draftPosts > 0 ? `${draftPosts} draft${draftPosts === 1 ? "" : "s"}` : "No drafts"}
          href="/admin/posts"
        />
        <StatCard label="Blog views" value={<Counter targetValue={totalViews} />} hint="All published posts" href="/admin/analytics" />
        <StatCard
          label="Open jobs"
          value={<Counter targetValue={publishedJobs} />}
          hint={draftJobs > 0 ? `${draftJobs} unpublished` : "All published"}
          href="/admin/jobs"
        />
        <StatCard
          label="Comments"
          value={<Counter targetValue={totalComments} />}
          hint={hiddenComments > 0 ? `${hiddenComments} hidden` : "None hidden"}
          href="/admin/comments"
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          title="TID registrations"
          description="New Techfamz Identities, last 6 months"
          action={{ label: "Analytics", href: "/admin/analytics" }}
          className="lg:col-span-2"
        >
          <div className="px-4 pb-4 pt-10">
            <BarChart items={registrationsByMonth} unit="registrations" title="TID registrations per month, last 6 months" height={150} />
          </div>
        </Panel>

        <Panel title="Content health" description="All time">
          <div className="flex flex-col gap-5 px-4 py-5">
            <div className="flex items-center gap-4">
              <DonutChart size={60} progress={publishedPct} label={`${publishedPosts} of ${totalPosts} posts published (${publishedPct}%)`}>
                <span className="text-xs font-semibold tabular-nums text-text-primary">{publishedPct}%</span>
              </DonutChart>
              <div>
                <div className="text-sm font-medium text-text-primary">Posts published</div>
                <div className="text-xs text-text-muted">{publishedPosts} of {totalPosts} posts</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <DonutChart size={60} progress={visiblePct} label={`${visibleComments} of ${totalComments} comments visible (${visiblePct}%)`}>
                <span className="text-xs font-semibold tabular-nums text-text-primary">{visiblePct}%</span>
              </DonutChart>
              <div>
                <div className="text-sm font-medium text-text-primary">Comments visible</div>
                <div className="text-xs text-text-muted">{visibleComments} of {totalComments} comments</div>
              </div>
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent TID registrations */}
        <Panel title="Recent TID registrations" action={{ label: "All developers", href: "/admin/developers" }}>
          {recentDevelopers.length === 0 ? (
            <EmptyState title="No registrations yet" description="New TIDs will appear here." />
          ) : (
            <ul className="divide-y divide-border-glass">
              {recentDevelopers.map((dev) => (
                <li key={dev.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium text-text-primary">{dev.fullName}</span>
                      <span className="font-mono text-xs text-accent-blue-light">{dev.tid}</span>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-text-muted">
                      {dev.role}
                      {dev.country ? ` · ${dev.country}` : ""}
                    </div>
                  </div>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDistanceToNow(new Date(dev.createdAt), { addSuffix: true })}
                  </span>
                  <a
                    href={`/tid/${dev.tid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded p-1 text-text-muted hover:text-text-primary"
                    title="Open public TID page"
                    aria-label={`Open public TID page for ${dev.fullName}`}
                  >
                    <ExternalLink size={14} />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* Top posts */}
        <Panel title="Most-read posts" action={{ label: "All posts", href: "/admin/posts" }}>
          {topPosts.length === 0 ? (
            <EmptyState title="No published posts yet" />
          ) : (
            <ol className="divide-y divide-border-glass">
              {topPosts.map((post, idx) => (
                <li key={post.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-4 shrink-0 text-xs tabular-nums text-text-muted">{idx + 1}</span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/admin/editor/${post.id}`}
                      className="block truncate text-sm font-medium text-text-primary hover:text-accent-blue-light"
                    >
                      {post.title}
                    </Link>
                    {post.category && <div className="mt-0.5 text-xs text-text-muted">{post.category}</div>}
                  </div>
                  <span className="shrink-0 text-sm tabular-nums text-text-secondary">
                    {post.views.toLocaleString()} <span className="text-xs text-text-muted">views</span>
                  </span>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        {/* Recent comments */}
        <Panel
          title="Recent comments"
          action={{ label: "Moderate", href: "/admin/comments" }}
          className="lg:col-span-2"
        >
          {recentComments.length === 0 ? (
            <EmptyState title="No comments yet" />
          ) : (
            <ul className="divide-y divide-border-glass">
              {recentComments.map((comment) => (
                <li key={comment.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-start sm:gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                      <span className="font-medium text-text-primary">{comment.name || "Anonymous"}</span>
                      <span className="text-text-muted">on</span>
                      <span className="truncate text-text-secondary">{comment.post.title}</span>
                      {comment.isHidden && <StatusBadge status="hidden" />}
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-text-secondary">{comment.content}</p>
                  </div>
                  <span className="shrink-0 text-xs text-text-muted">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
