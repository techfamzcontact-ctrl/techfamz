"use client";

import { useMemo, useState } from "react";
import { MotionConfig } from "motion/react";
import FluidTabs from "@/components/animata/tabs/fluid-tabs";
import BarChart from "@/components/animata/graphs/bar-chart";
import DonutChart from "@/components/animata/graphs/donut-chart";
import Counter from "@/components/animata/text/counter";
import { PageHeader, Panel, StatCard } from "@/components/admin/AdminUI";
import { BarList } from "@/components/admin/BarList";
import {
  countByMonth,
  normalizeLabel,
  percent,
  startOfMonthUTC,
  sumBy,
  tally,
  topWithOther,
} from "@/lib/analytics";

export type AnalyticsData = {
  developers: { createdAt: string; role: string; country: string | null; skills: string[]; hasGithub: boolean }[];
  posts: {
    title: string;
    slug: string;
    category: string | null;
    views: number;
    published: boolean;
    createdAt: string;
    comments: number;
  }[];
  comments: { createdAt: string; isHidden: boolean }[];
  jobs: { createdAt: string; published: boolean }[];
};

const RANGES = [
  { label: "Last 6 months", months: 6 },
  { label: "Last 12 months", months: 12 },
  { label: "All time", months: null },
] as const;

function ChartPanel({
  title,
  description,
  total,
  emptyText,
  children,
}: {
  title: string;
  description: string;
  total: number;
  emptyText: string;
  children: React.ReactNode;
}) {
  return (
    <Panel title={title} description={description}>
      {total === 0 ? (
        <p className="px-4 py-16 text-center text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="px-4 pb-4 pt-10">{children}</div>
      )}
    </Panel>
  );
}

function Meter({ label, part, whole, unitLabel }: { label: string; part: number; whole: number; unitLabel: string }) {
  const pct = percent(part, whole);
  return (
    <div className="flex items-center gap-4">
      <DonutChart size={64} progress={pct} label={`${label}: ${part} of ${whole} ${unitLabel} (${pct}%)`}>
        <span className="text-sm font-semibold tabular-nums text-text-primary">{pct}%</span>
      </DonutChart>
      <div className="min-w-0">
        <div className="text-sm font-medium text-text-primary">{label}</div>
        <div className="text-xs text-text-muted">
          {part.toLocaleString("en-US")} of {whole.toLocaleString("en-US")} {unitLabel}
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsClient({ data, now: nowIso }: { data: AnalyticsData; now: string }) {
  const [rangeIndex, setRangeIndex] = useState(1);
  const range = RANGES[rangeIndex];
  const now = useMemo(() => new Date(nowIso), [nowIso]);

  const view = useMemo(() => {
    const allDates = [
      ...data.developers.map((d) => d.createdAt),
      ...data.posts.map((p) => p.createdAt),
      ...data.comments.map((c) => c.createdAt),
    ].map((iso) => new Date(iso));
    const firstRecord = allDates.length ? new Date(Math.min(...allDates.map((d) => d.getTime()))) : now;
    const start = range.months ? startOfMonthUTC(now, range.months - 1) : startOfMonthUTC(firstRecord);
    const inRange = (iso: string) => new Date(iso) >= start;

    const developers = data.developers.filter((d) => inRange(d.createdAt));
    const posts = data.posts.filter((p) => inRange(p.createdAt));
    const published = posts.filter((p) => p.published);
    const comments = data.comments.filter((c) => inRange(c.createdAt));
    const jobs = data.jobs.filter((j) => inRange(j.createdAt));

    return {
      developers,
      posts,
      published,
      comments,
      jobs,
      views: published.reduce((sum, p) => sum + p.views, 0),
      registrationsByMonth: countByMonth(developers.map((d) => new Date(d.createdAt)), start, now),
      postsByMonth: countByMonth(published.map((p) => new Date(p.createdAt)), start, now),
      commentsByMonth: countByMonth(comments.map((c) => new Date(c.createdAt)), start, now),
      topPosts: [...published]
        .sort((a, b) => b.views - a.views)
        .slice(0, 8)
        .map((p) => ({ label: p.title, value: p.views, href: `/blog/${p.slug}` })),
      viewsByCategory: topWithOther(
        sumBy(published, (p) => p.category?.trim() || "Uncategorized", (p) => p.views),
        6
      ),
      roles: topWithOther(tally(developers, (d) => d.role), 6),
      countries: topWithOther(tally(developers, (d) => (d.country ? normalizeLabel(d.country) : null)), 6),
      skills: tally(developers, (d) => d.skills).slice(0, 8),
    };
  }, [data, now, range.months]);

  const totals = { developers: data.developers.length };

  return (
    <MotionConfig reducedMotion="user">
      <PageHeader
        title="Analytics"
        description="Growth of the TID registry, the blog and the community. Every number below follows the selected period."
      />

      {/* Period filter: scopes everything below it */}
      <FluidTabs activeIndex={rangeIndex} onActiveIndexChange={setRangeIndex} className="mb-6 w-auto max-w-none justify-start">
        <FluidTabs.List aria-label="Time period">
          {RANGES.map((r) => (
            <FluidTabs.Tab key={r.label}>
              <FluidTabs.Label>{r.label}</FluidTabs.Label>
            </FluidTabs.Tab>
          ))}
        </FluidTabs.List>
      </FluidTabs>

      {/* Key numbers */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <StatCard
          label="New TID holders"
          value={<Counter targetValue={view.developers.length} />}
          hint={`${totals.developers.toLocaleString("en-US")} in total`}
        />
        <StatCard
          label="Posts published"
          value={<Counter targetValue={view.published.length} />}
          hint={`${(view.posts.length - view.published.length).toLocaleString("en-US")} drafts started`}
        />
        <StatCard
          label="Views on those posts"
          value={<Counter targetValue={view.views} />}
          hint="Lifetime views per post"
        />
        <StatCard
          label="Comments"
          value={<Counter targetValue={view.comments.length} />}
          hint={`${view.comments.filter((c) => c.isHidden).length} hidden`}
        />
        <StatCard
          label="Jobs posted"
          value={<Counter targetValue={view.jobs.length} />}
          hint={`${view.jobs.filter((j) => j.published).length} published`}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartPanel
          title="TID registrations"
          description="New Techfamz Identities per month"
          total={view.developers.length}
          emptyText="No registrations in this period."
        >
          <BarChart items={view.registrationsByMonth} unit="registrations" title="TID registrations per month" />
        </ChartPanel>

        <ChartPanel
          title="Posts published"
          description="Published blog posts per month, by publish date"
          total={view.published.length}
          emptyText="No posts published in this period."
        >
          <BarChart items={view.postsByMonth} unit="posts" title="Posts published per month" />
        </ChartPanel>

        <Panel title="Most-read posts" description="Lifetime views of posts published in this period">
          <BarList rows={view.topPosts} unit="views" emptyText="No published posts in this period." />
        </Panel>

        <Panel title="Views by category" description="Lifetime views, grouped by post category">
          <BarList rows={view.viewsByCategory} unit="views" emptyText="No published posts in this period." />
        </Panel>

        <ChartPanel
          title="Comments"
          description="Comments posted per month"
          total={view.comments.length}
          emptyText="No comments in this period."
        >
          <BarChart items={view.commentsByMonth} unit="comments" title="Comments per month" />
        </ChartPanel>

        <Panel title="Health" description="Shares within this period">
          <div className="flex flex-col gap-5 px-4 py-5">
            <Meter label="Posts published" part={view.published.length} whole={view.posts.length} unitLabel="posts created" />
            <Meter
              label="TID holders with a GitHub link"
              part={view.developers.filter((d) => d.hasGithub).length}
              whole={view.developers.length}
              unitLabel="TID holders"
            />
            <Meter
              label="Comments visible"
              part={view.comments.filter((c) => !c.isHidden).length}
              whole={view.comments.length}
              unitLabel="comments"
            />
          </div>
        </Panel>
      </div>

      <h2 className="mb-3 mt-10 text-sm font-semibold text-text-primary">TID holders in this period</h2>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="By role">
          <BarList rows={view.roles} unit="TID holders" emptyText="No TID holders in this period." />
        </Panel>
        <Panel title="By country">
          <BarList rows={view.countries} unit="TID holders" emptyText="No countries given in this period." />
        </Panel>
        <Panel title="Top skills" description="Self-reported, up to 5 per person">
          <BarList rows={view.skills} unit="TID holders" emptyText="No skills given in this period." />
        </Panel>
      </div>

      <p className="mt-8 text-xs text-text-muted">
        Post views are lifetime totals per post; the site does not record daily view history, so views are grouped by
        each post&apos;s publish month rather than by when the visit happened.
      </p>
    </MotionConfig>
  );
}
