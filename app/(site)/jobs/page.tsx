import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { format } from "date-fns";
import { MapPin, Briefcase, Banknote, ArrowRight, Clock } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tech Jobs",
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
      <div className="text-center py-16 px-6 border border-border-glass rounded-xl bg-bg-card">
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
      <div className="text-center py-16 px-6 border border-border-glass rounded-xl bg-bg-card">
        <Briefcase size={40} className="mx-auto mb-4 text-text-muted opacity-30" />
        <h3 className="text-xl font-semibold text-text-primary mb-2">No openings yet</h3>
        <p className="text-text-secondary">We&apos;re sourcing new opportunities. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border-glass border-y border-border-glass">
      {jobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.slug}`}
          className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 py-6 px-2 sm:px-4 transition-colors duration-150 hover:bg-bg-card"
        >
          {/* Left: Company monogram */}
          <div className="shrink-0 w-12 h-12 rounded-lg bg-bg-card border border-border-glass flex items-center justify-center">
            <span className="text-lg font-bold text-accent-blue-light">
              {job.company.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Middle: Job Details */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base md:text-lg font-semibold tracking-tight text-text-primary group-hover:text-accent-blue-light transition-colors truncate mb-1.5">
              {job.title}
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-text-secondary">
              <span className="font-medium text-text-primary">
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
                  <Banknote size={14} className="text-text-muted" />
                  {job.salary}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-text-muted">
                <Clock size={13} />
                {format(new Date(job.createdAt), "MMM d, yyyy")}
              </span>
            </div>
          </div>

          {/* Right: Tags & Arrow */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold text-accent-blue-light bg-accent-blue-glow-soft">
              {job.type}
            </span>
            {job.category && (
              <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium text-text-muted border border-border-glass">
                {job.category}
              </span>
            )}
            <ArrowRight size={16} className="ml-1 text-text-muted group-hover:text-accent-blue-light group-hover:translate-x-0.5 transition-all duration-150" />
          </div>
        </Link>
      ))}
    </div>
  );
}

export default function JobsPage() {
  return (
    <main className="min-h-screen pt-32 pb-24 bg-bg-primary">
      <div className="max-w-[1000px] mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-12 max-w-[720px]">
          <span className="eyebrow">
            Opportunities
          </span>
          <h1 className="text-[clamp(2.4rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary mb-4">
            Tech <span className="text-accent-blue-light">Opportunities</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Curated roles from top tech hubs across Africa and remote teams worldwide. Connect directly using your verified TID.
          </p>
        </div>

        <Suspense fallback={<JobsListSkeleton />}>
          <JobsList />
        </Suspense>
      </div>
    </main>
  );
}
