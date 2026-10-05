"use client";

import { useEffect, useState, useMemo } from "react";
import { getJobs, toggleJobPublish, deleteJob } from "../../actions";
import Link from "next/link";
import { format } from "date-fns";
import {
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  Briefcase,
  Plus,
  Search,
  X,
  CheckCircle,
  Clock,
  Building2,
  MapPin,
} from "lucide-react";

type Job = {
  id: string;
  title: string;
  slug: string;
  company: string;
  type: string;
  location: string;
  published: boolean;
  createdAt: Date;
};

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "LIVE" | "DRAFT">("ALL");

  const fetchJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggle = async (id: string, status: boolean) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, published: !status } : j))
    );
    await toggleJobPublish(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this job? This cannot be undone.")) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await deleteJob(id);
  };

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    const q = search.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q);

      const matchesType =
        selectedType === "ALL" || job.type === selectedType;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "LIVE" && job.published) ||
        (statusFilter === "DRAFT" && !job.published);

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [jobs, search, selectedType, statusFilter]);

  // Summary counts
  const liveCount = useMemo(() => jobs.filter((j) => j.published).length, [jobs]);
  const draftCount = jobs.length - liveCount;
  const uniqueCompanies = useMemo(
    () => new Set(jobs.map((j) => j.company.toLowerCase())).size,
    [jobs]
  );

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Tech Jobs</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue-light border border-accent-blue-glow/30">
              {jobs.length} Listings
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Post, review, and manage career opportunities for African developers and tech talent.
          </p>
        </div>

        <Link
          href="/admin/jobs/editor/new"
          className="bg-accent-blue text-white py-2 px-4 flex items-center gap-2 rounded-lg font-semibold text-xs hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-blue-glow-soft)] self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Post Job</span>
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Total Listings
          </div>
          <div className="text-2xl font-bold text-text-primary">{jobs.length}</div>
          <div className="text-[0.7rem] text-accent-blue-light mt-0.5 flex items-center gap-1">
            <Briefcase size={11} /> Opportunities created
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Active / Live
          </div>
          <div className="text-2xl font-bold text-text-primary">{liveCount}</div>
          <div className="text-[0.7rem] text-green-400 mt-0.5 flex items-center gap-1">
            <CheckCircle size={11} /> Open applications
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Unpublished Drafts
          </div>
          <div className="text-2xl font-bold text-text-primary">{draftCount}</div>
          <div className="text-[0.7rem] text-amber-400 mt-0.5 flex items-center gap-1">
            <Clock size={11} /> Not yet visible
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Hiring Companies
          </div>
          <div className="text-2xl font-bold text-text-primary">{uniqueCompanies}</div>
          <div className="text-[0.7rem] text-cyan-400 mt-0.5 flex items-center gap-1">
            <Building2 size={11} /> Employer partners
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-glass rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-9 py-2 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Job Type Filter */}
        <div className="w-full md:w-44">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full py-2 px-3 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="ALL">All Types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-bg-primary rounded-lg border border-border-glass">
          <button
            onClick={() => setStatusFilter("ALL")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "ALL"
                ? "bg-accent-blue text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("LIVE")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "LIVE"
                ? "bg-green-500 text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Live ({liveCount})
          </button>
          <button
            onClick={() => setStatusFilter("DRAFT")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "DRAFT"
                ? "bg-amber-500 text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Drafts ({draftCount})
          </button>
        </div>

        {(search || selectedType !== "ALL" || statusFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedType("ALL");
              setStatusFilter("ALL");
            }}
            className="text-xs text-text-muted hover:text-accent-blue-light transition-colors px-2 py-1 text-center whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Jobs Table */}
      <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-glass text-[0.7rem] uppercase tracking-wider text-text-muted font-bold bg-bg-primary/50">
                <th className="px-6 py-4">Job Title & Location</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date Posted</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass/50">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-text-primary">No job listings found</p>
                    <p className="text-xs text-text-muted mt-1">
                      {search || selectedType !== "ALL" || statusFilter !== "ALL"
                        ? "Try clearing your filters or search terms."
                        : "Post your first career opportunity for the community!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-bg-primary/50 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/jobs/editor/${job.id}`}
                        className="font-semibold text-sm text-text-primary hover:text-accent-blue-light transition-colors line-clamp-1"
                      >
                        {job.title}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted mt-0.5">
                        <MapPin size={12} className="shrink-0 text-text-muted/70" />
                        <span>{job.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-text-secondary">
                      {job.company}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-wider border text-accent-blue-light bg-accent-blue-glow-soft border-accent-blue-glow">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${
                          job.published
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        }`}
                      >
                        {job.published ? "Live" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-text-secondary whitespace-nowrap">
                      {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleToggle(job.id, job.published)}
                          className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
                          title={job.published ? "Unpublish" : "Publish"}
                        >
                          {job.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {job.published && (
                          <a
                            href={`/jobs/${job.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-md text-text-muted hover:text-accent-blue-light hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                            title="View Live Listing"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/jobs/editor/${job.id}`}
                          className="p-2 rounded-md text-text-muted hover:text-cta-yellow hover:bg-[rgba(245,197,66,0.1)] transition-colors"
                          title="Edit Job"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-md text-text-muted hover:text-red-400 hover:bg-[rgba(248,113,113,0.1)] transition-colors"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredJobs.length > 0 && (
          <div className="px-6 py-3 border-t border-border-glass bg-bg-primary/30 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {filteredJobs.length} of {jobs.length} job postings
            </span>
            <span>Techfamz Job Board</span>
          </div>
        )}
      </div>
    </div>
  );
}
