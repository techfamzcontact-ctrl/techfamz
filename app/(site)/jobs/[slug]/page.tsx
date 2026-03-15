import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Clock } from "lucide-react";
import sanitizeHtml from "sanitize-html";
import type { Metadata, ResolvingMetadata } from "next";
import { ApplyButtons } from "@/components/jobs/ApplyButtons";
import { Suspense } from "react";
import { JobDetailSkeleton } from "@/components/jobs/JobCardSkeleton";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getJobBySlug(slug: string) {
  try {
    return await prisma.job.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    return { title: "Job Not Found" };
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: `${job.type} · ${job.location}${job.salary ? ` · ${job.salary}` : ""}. Apply now on Techfamz.`,
    openGraph: {
      title: `${job.title} at ${job.company} — Techfamz Jobs`,
      description: `${job.type} role at ${job.company}. ${job.location}.`,
      url: `https://techfamz.com/jobs/${resolvedParams.slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${job.title} at ${job.company}`,
      description: `${job.type} · ${job.location}${job.salary ? ` · ${job.salary}` : ""}. Apply now on Techfamz.`,
    },
    alternates: {
      canonical: `https://techfamz.com/jobs/${resolvedParams.slug}`,
    },
  };
}

async function JobDetail({ slug }: { slug: string }) {
  const job = await getJobBySlug(slug);

  if (!job || !job.published) {
    notFound();
  }

  // Smart apply link: detect email vs URL
  const rawUrl = job.applyUrl.trim();
  const isEmail = rawUrl.startsWith("mailto:") || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawUrl);
  
  let applyHref = rawUrl;
  if (isEmail && !rawUrl.startsWith("mailto:")) {
    applyHref = `mailto:${rawUrl}`;
  } else if (!isEmail && !rawUrl.startsWith("http") && !rawUrl.startsWith("/")) {
    applyHref = `https://${rawUrl}`;
  }

  // JSON-LD Structured Data for Google Jobs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.createdAt.toISOString(),
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
    },
    jobLocation: {
      "@type": "Place",
      address: job.location,
    },
    employmentType: job.type.toUpperCase().replace("-", "_"),
    ...(job.salary && {
      baseSalary: {
        "@type": "MonetaryAmount",
        currency: "USD",
        value: {
          "@type": "QuantitativeValue",
          value: job.salary,
        },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-[900px] mx-auto px-5 md:px-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-accent-blue-light transition-colors mb-8 group"
        >
          <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
          Back to Tech Jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-bg-card border border-border-glass rounded-2xl backdrop-blur-md p-8 md:p-10 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Company Badge */}
            <div className="shrink-0 w-16 h-16 rounded-xl bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center">
              <span className="text-2xl font-bold text-accent-blue-light">
                {job.company.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-[800] leading-[1.15] tracking-tight text-text-primary mb-3">
                {job.title}
              </h1>
              <p className="text-lg text-text-secondary mb-5">{job.company}</p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-text-secondary">
                {job.location && (
                  <span className="flex items-center gap-2">
                    <MapPin size={16} className="text-accent-blue-light" />
                    {job.location}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Briefcase size={16} className="text-accent-blue-light" />
                  {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-2">
                    <DollarSign size={16} className="text-accent-blue-light" />
                    {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <Clock size={16} className="text-accent-blue-light" />
                  Posted {format(job.createdAt, "MMMM d, yyyy")}
                </span>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="mt-8 pt-6 border-t border-border-glass">
            <ApplyButtons 
              applyUrl={job.applyUrl} 
              isEmail={isEmail} 
              applyHref={applyHref} 
              size="large" 
            />
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-bg-card border border-border-glass rounded-2xl backdrop-blur-md p-8 md:p-10">
          <h2 className="text-xl font-bold text-text-primary mb-6">About This Role</h2>
          <div
            className="prose dark:prose-invert prose-base md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent-blue-light hover:prose-a:text-accent-blue prose-hr:border-border-glass [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_p]:m-0 [&_p]:min-h-[1.5em]"
            dangerouslySetInnerHTML={{
              __html: sanitizeHtml(job.description, {
                allowedTags: [
                  "h1","h2","h3","h4","h5","h6",
                  "p","br","strong","em","u","s","del","mark","code","pre","blockquote","hr",
                  "ul","ol","li",
                  "a","img",
                  "table","thead","tbody","tr","th","td",
                  "div","span",
                ],
                allowedAttributes: {
                  a: ["href", "target", "rel", "class"],
                  img: ["src", "alt", "class", "width", "height"],
                  "*": ["class", "style"],
                },
                allowedStyles: {
                  "*": {
                    "text-align": [/^(left|right|center|justify)$/],
                  },
                },
              }),
            }}
          />

          {/* Bottom Apply CTA */}
          <div className="mt-10 pt-6 border-t border-border-glass flex items-center justify-between">
            <p className="text-text-secondary text-sm">Interested in this role?</p>
            <ApplyButtons 
              applyUrl={job.applyUrl} 
              isEmail={isEmail} 
              applyHref={applyHref} 
              size="normal" 
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const resolvedParams = await params;

  // We only wrap the content area in suspense. 
  // Note: the background gradient still renders immediately while the user waits
  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--gradient-hero)" }}>
      <Suspense fallback={<JobDetailSkeleton />}>
        <JobDetail slug={resolvedParams.slug} />
      </Suspense>
    </main>
  );
}
