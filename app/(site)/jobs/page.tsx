import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Briefcase, DollarSign, ArrowRight, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Jobs — Techfamz",
  description: "Discover the latest tech job openings curated by the Techfamz community. Find your next opportunity in engineering, design, product, and more.",
  openGraph: {
    title: "Tech Jobs — Techfamz",
    description: "Discover the latest tech job openings curated by the Techfamz community. Find your next opportunity in engineering, design, product, and more.",
    url: "https://www.techfamz.com/jobs",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech Jobs — Techfamz",
    description: "Discover the latest tech job openings curated by the Techfamz community.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/jobs",
  },
};

export const dynamic = "force-dynamic";

async function getPublishedJobs() {
  try {
    return await prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        company: true,
        location: true,
        type: true,
        salary: true,
        category: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return null;
  }
}

import { Suspense } from "react";
import { JobsListSkeleton } from "@/components/jobs/JobCardSkeleton";

// The new server component handling the async DB fetch
async function JobsList() {
  const jobs = await getPublishedJobs();

  if (jobs === null) {
    return (
      <div className="text-center py-20 border border-red-500/20 rounded-2xl bg-[rgba(127,29,29,0.15)] ">
        <h3 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h3>
        <p className="text-text-secondary mb-6">We couldn&apos;t load jobs right now. Please try again later.</p>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </Link>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-20 border border-border-glass rounded-2xl bg-bg-card ">
        <Briefcase size={40} className="mx-auto mb-4 text-text-muted opacity-30" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">No openings yet</h3>
        <p className="text-text-secondary">We&apos;re sourcing new opportunities. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.slug}`}
          className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 md:p-7 bg-bg-card border border-border-glass rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-blue/5 hover:border-accent-blue/40 shadow-xs"
        >
          {/* Left: Company Badge */}
          <div className="shrink-0 w-13 h-13 rounded-2xl bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border border-accent-blue/30 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <span className="text-xl font-black text-accent-blue-light">
              {job.company.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Middle: Job Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h2 className="text-base md:text-lg font-bold text-text-primary group-hover:text-accent-blue-light transition-colors truncate">
                {job.title}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-text-secondary">
              <span className="flex items-center gap-1.5 font-medium text-text-primary">
                <Briefcase size={13} className="text-accent-blue" />
                {job.company}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-text-muted" />
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1 font-mono font-semibold text-amber-500">
                  <DollarSign size={13} />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1 text-text-muted">
                <Clock size={12} />
                {format(new Date(job.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Right: Tags & Arrow */}
          <div className="flex items-center gap-2.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border-glass">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider text-accent-blue-light bg-accent-blue-glow-soft border border-accent-blue-glow">
              {job.type}
            </span>
            {job.category && (
              <span className="hidden md:inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold text-text-muted bg-bg-primary/70 border border-border-glass">
                {job.category}
              </span>
            )}
            <div className="w-8 h-8 rounded-xl bg-bg-primary/50 flex items-center justify-center text-text-muted group-hover:text-accent-blue-light group-hover:bg-accent-blue/10 transition-colors">
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-[760px] mx-auto">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-accent-blue-light mb-4 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft shadow-xs">
            Opportunities
          </span>
          <h1 className="text-[clamp(2.4rem,5vw,4.2rem)] font-black leading-[1.08] tracking-tight text-text-primary mb-4">
            Tech <span className="text-gradient-blue">Opportunities</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed max-w-[620px] mx-auto">
            Curated roles from top tech hubs across Africa and remote teams worldwide. Connect directly using your verified TID.
          </p>
        </div>

        {/* Suspense Wrapper around Async Component */}
        {/* Suspense Wrapper around Async Component */}
        <Suspense fallback={<JobsListSkeleton />}>
          <JobsList />
        </Suspense>
      </div>
    </main>
  );
}
