"use client";

import { useEffect, useState } from "react";
import { getJobs, toggleJobPublish, deleteJob } from "../../actions";
import Link from "next/link";
import { format } from "date-fns";
import { Edit, Trash2, ExternalLink, Eye, EyeOff, Briefcase, Plus } from "lucide-react";

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

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    await deleteJob(id);
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Tech Jobs</h1>
          <p className="text-sm text-text-muted">Manage job listings</p>
        </div>
        <Link
          href="/admin/jobs/editor/new"
          className="bg-accent-blue text-white py-2 px-4 flex items-center gap-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
        >
          <Plus size={18} />
          Post Job
        </Link>
      </div>

      <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden ">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-border-glass">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Job Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass/50">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                    <Briefcase size={32} className="mx-auto mb-3 opacity-30" />
                    No jobs posted yet. Start posting!
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-bg-primary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary mb-1">{job.title}</p>
                      <p className="text-xs text-text-muted">{job.location}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{job.company}</td>
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
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {format(new Date(job.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
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
                            title="View Live"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/jobs/editor/${job.id}`}
                          className="p-2 rounded-md text-text-muted hover:text-cta-yellow hover:bg-[rgba(245,197,66,0.1)] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-2 rounded-md text-text-muted hover:text-red-400 hover:bg-[rgba(248,113,113,0.1)] transition-colors"
                          title="Delete"
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
      </div>
    </div>
  );
}
