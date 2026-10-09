"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  Eye,
  EyeOff,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { deleteJob, toggleJobPublish } from "@/app/admin/actions";
import type { getJobs } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  EmptyState,
  PageHeader,
  Panel,
  Segmented,
  StatusBadge,
  adminInputClass,
  adminTable,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { runAction } from "@/components/admin/run-action";
import { cn } from "@/lib/utils";

type Job = Awaited<ReturnType<typeof getJobs>>[number];
type StatusFilter = "all" | "published" | "draft";

// Keep in sync with JOB_TYPES in ./editor/[id]/page.tsx
const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Freelance"];

// Formatted in UTC so the server render and the browser agree (and match the public job page).
const postedDate = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

const newestFirst = (a: Job, b: Job) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

export default function JobsClient({ initialJobs }: { initialJobs: Job[] }) {
  const confirm = useConfirm();
  const [jobs, setJobs] = useState(initialJobs);
  const [pendingIds, setPendingIds] = useState<ReadonlySet<string>>(() => new Set());

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const publishedCount = useMemo(() => jobs.filter((j) => j.published).length, [jobs]);
  const draftCount = jobs.length - publishedCount;
  const companyCount = useMemo(
    () => new Set(jobs.map((j) => j.company.trim().toLowerCase())).size,
    [jobs]
  );
  // Known types plus any older values already stored on jobs
  const typeOptions = useMemo(
    () => Array.from(new Set([...JOB_TYPES, ...jobs.map((j) => j.type).filter(Boolean)])),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);
      const matchesType = typeFilter === "all" || job.type === typeFilter;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "published" && job.published) ||
        (statusFilter === "draft" && !job.published);
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [jobs, search, typeFilter, statusFilter]);

  const hasFilters = search.trim() !== "" || typeFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setStatusFilter("all");
  };

  const setPending = (id: string, pending: boolean) =>
    setPendingIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(id);
      else next.delete(id);
      return next;
    });

  const setPublished = (id: string, published: boolean) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, published } : j)));

  async function handleTogglePublish(job: Job) {
    const next = !job.published;
    setPending(job.id, true);
    setPublished(job.id, next); // optimistic
    const result = await runAction(
      toggleJobPublish(job.id, job.published),
      next ? "Job published" : "Job unpublished"
    );
    if (!result) setPublished(job.id, job.published); // roll back
    setPending(job.id, false);
  }

  async function handleDelete(job: Job) {
    const ok = await confirm({
      title: "Delete this job?",
      description: `"${job.title}" at ${job.company} will be permanently deleted${
        job.published ? " and removed from the public job board" : ""
      }. This cannot be undone.`,
      confirmLabel: "Delete job",
      destructive: true,
    });
    if (!ok) return;

    setPending(job.id, true);
    setJobs((prev) => prev.filter((j) => j.id !== job.id)); // optimistic
    const result = await runAction(deleteJob(job.id), "Job deleted");
    if (!result) {
      // roll back: put the job back in its original place
      setJobs((prev) =>
        prev.some((j) => j.id === job.id) ? prev : [...prev, job].sort(newestFirst)
      );
    }
    setPending(job.id, false);
  }

  const description =
    jobs.length === 0
      ? "Post and manage listings for the job board."
      : `Post and manage listings for the job board · ${jobs.length} listing${
          jobs.length === 1 ? "" : "s"
        } from ${companyCount} compan${companyCount === 1 ? "y" : "ies"}`;

  return (
    <div>
      <PageHeader
        title="Jobs"
        description={description}
        actions={
          <Button asChild size="xs">
            <Link href="/admin/jobs/editor/new">
              <Plus size={14} />
              Post a job
            </Link>
          </Button>
        }
      />

      <Panel>
        {jobs.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No jobs yet"
            description="Post the first listing for the job board. Drafts stay private until you publish them."
            action={
              <Button asChild size="xs">
                <Link href="/admin/jobs/editor/new">
                  <Plus size={14} />
                  Post a job
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col gap-2 border-b border-border-glass p-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="relative w-full sm:max-w-xs sm:flex-1">
                <Search
                  size={14}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search title, company or location"
                  aria-label="Search jobs"
                  className={cn(adminInputClass, "pl-8 pr-8")}
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    title="Clear search"
                    className="absolute right-1.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                aria-label="Filter by job type"
                className={cn(adminInputClass, "sm:w-40")}
              >
                <option value="all">All types</option>
                {typeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <div className="self-start sm:self-auto">
                <Segmented<StatusFilter>
                  value={statusFilter}
                  onChange={setStatusFilter}
                  options={[
                    { value: "all", label: "All" },
                    { value: "published", label: `Published (${publishedCount})` },
                    { value: "draft", label: `Drafts (${draftCount})` },
                  ]}
                />
              </div>

              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={clearFilters}
                  className="self-start text-text-muted hover:text-text-primary sm:self-auto"
                >
                  Clear
                </Button>
              )}
            </div>

            {filteredJobs.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No jobs match your filters"
                description="Try a different search, or clear the filters to see every listing."
                action={
                  <Button type="button" variant="outline" size="xs" onClick={clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <>
                <div className={adminTable.wrapper}>
                  <table className={adminTable.table}>
                    <thead>
                      <tr>
                        <th className={adminTable.th}>Title</th>
                        <th className={cn(adminTable.th, "hidden md:table-cell")}>Location</th>
                        <th className={cn(adminTable.th, "hidden lg:table-cell")}>Type</th>
                        <th className={adminTable.th}>Status</th>
                        <th className={cn(adminTable.th, "hidden sm:table-cell")}>Posted</th>
                        <th className={cn(adminTable.th, "w-12")}>
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredJobs.map((job) => {
                        const pending = pendingIds.has(job.id);
                        const created = new Date(job.createdAt);
                        return (
                          <tr
                            key={job.id}
                            className={cn(adminTable.tr, pending && "opacity-60")}
                            aria-busy={pending || undefined}
                          >
                            <td className={cn(adminTable.td, "min-w-[220px]")}>
                              <Link
                                href={`/admin/jobs/editor/${job.id}`}
                                className="font-medium text-text-primary transition-colors hover:text-accent-blue-light"
                              >
                                {job.title}
                              </Link>
                              <div className="mt-0.5 text-xs text-text-muted">
                                {job.company}
                                <span className="md:hidden"> · {job.location}</span>
                                <span className="lg:hidden"> · {job.type}</span>
                              </div>
                            </td>
                            <td className={cn(adminTable.td, "hidden text-text-secondary md:table-cell")}>
                              {job.location}
                            </td>
                            <td
                              className={cn(
                                adminTable.td,
                                "hidden whitespace-nowrap text-text-secondary lg:table-cell"
                              )}
                            >
                              {job.type}
                            </td>
                            <td className={adminTable.td}>
                              <StatusBadge status={job.published ? "published" : "draft"} />
                            </td>
                            <td
                              className={cn(
                                adminTable.td,
                                "hidden whitespace-nowrap text-text-muted sm:table-cell"
                              )}
                            >
                              <time dateTime={created.toISOString()}>{postedDate.format(created)}</time>
                            </td>
                            <td className={cn(adminTable.td, "text-right")}>
                              <DropdownMenu modal={false}>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    disabled={pending}
                                    aria-label={`Actions for ${job.title}`}
                                    title="Actions"
                                    className="text-text-muted hover:text-text-primary data-[state=open]:bg-text-primary/[0.07] data-[state=open]:text-text-primary"
                                  >
                                    <MoreHorizontal size={16} />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-44">
                                  <DropdownMenuItem asChild>
                                    <Link href={`/admin/jobs/editor/${job.id}`}>
                                      <Pencil size={14} className="text-text-muted" />
                                      Edit
                                    </Link>
                                  </DropdownMenuItem>
                                  {job.published && (
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={`/jobs/${job.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <ExternalLink size={14} className="text-text-muted" />
                                        View live
                                      </a>
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem onSelect={() => handleTogglePublish(job)}>
                                    {job.published ? (
                                      <>
                                        <EyeOff size={14} className="text-text-muted" />
                                        Unpublish
                                      </>
                                    ) : (
                                      <>
                                        <Eye size={14} className="text-text-muted" />
                                        Publish
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem variant="destructive" onSelect={() => handleDelete(job)}>
                                    <Trash2 size={14} />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-border-glass px-4 py-2.5 text-xs text-text-muted">
                  Showing {filteredJobs.length} of {jobs.length} job{jobs.length === 1 ? "" : "s"}
                </div>
              </>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}
