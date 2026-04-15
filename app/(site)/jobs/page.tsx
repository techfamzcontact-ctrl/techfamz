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
      <div className="text-center py-20 border border-red-500/20 rounded-2xl bg-[rgba(127,29,29,0.15)] backdrop-blur-md">
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
      <div className="text-center py-20 border border-border-glass rounded-2xl bg-bg-card backdrop-blur-md">
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
          className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 md:p-8 bg-bg-card border border-border-glass rounded-2xl backdrop-blur-md transition-all duration-300 ease-premium hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] hover:border-border-glass-hover"
        >
          {/* Left: Company Badge */}
          <div className="shrink-0 w-14 h-14 rounded-xl bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center">
            <span className="text-xl font-bold text-accent-blue-light">
              {job.company.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Middle: Job Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-xl font-bold text-text-primary mb-2 group-hover:text-accent-blue-light transition-colors truncate">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
              <span className="flex items-center gap-1.5">
                <Briefcase size={14} className="text-text-muted" />
                {job.company}
              </span>
              {job.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-text-muted" />
                  {job.location}
                </span>
              )}
              {job.salary && (
                <span className="flex items-center gap-1.5">
                  <DollarSign size={14} className="text-text-muted" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock size={14} className="text-text-muted" />
                {format(new Date(job.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Right: Tags & Arrow */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border text-accent-blue-light bg-accent-blue-glow-soft border-accent-blue-glow">
              {job.type}
            </span>
            {job.category && (
              <span className="hidden md:inline-flex items-center px-3 py-1.5 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border border-border-glass text-text-muted bg-bg-primary">
                {job.category}
              </span>
            )}
            <ArrowRight size={18} className="text-text-muted group-hover:text-accent-blue-light group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="text-center mb-16 max-w-[800px] mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            Opportunities
          </span>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-[800] leading-[1.1] tracking-[-0.02em] text-text-primary mb-6">
            Tech <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">Jobs</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-[600px] mx-auto">
            Curated job openings from across the African tech ecosystem. Find your next role in engineering, design, product, and more.
          </p>
        </div>

        {/* Suspense Wrapper around Async Component */}
        <Suspense fallback={<JobsListSkeleton />}>
          <JobsList />
        </Suspense>
      </div>
    </main>
  );
}
