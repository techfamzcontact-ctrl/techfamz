import Link from "next/link";
import { Plus, FileText, Briefcase, ChevronRight, CheckCircle, Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [
    totalPosts, publishedPosts,
    totalJobs, publishedJobs
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { published: true } })
  ]);

  const draftPosts = totalPosts - publishedPosts;
  const draftJobs = totalJobs - publishedJobs;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-1">Dashboard</h1>
          <p className="text-sm text-text-muted">Welcome to the Techfamz admin panel.</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-text-primary mb-4">Platform Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {/* Published Posts */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-accent-blue-glow transition-all duration-300">
          <div className="absolute -right-4 -top-4 text-green-400/5 group-hover:text-green-400/10 transition-colors">
            <FileText size={80} />
          </div>
          <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-2 relative z-10">Published Posts</div>
          <div className="text-3xl font-bold text-text-primary mb-1 relative z-10">{publishedPosts}</div>
          <div className="text-xs text-green-400 flex items-center gap-1 relative z-10"><CheckCircle size={12}/> Live on Blog</div>
        </div>

        {/* Draft Posts */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-accent-blue-glow transition-all duration-300">
          <div className="absolute -right-4 -top-4 text-amber-400/5 group-hover:text-amber-400/10 transition-colors">
            <FileText size={80} />
          </div>
          <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-2 relative z-10">Draft Posts</div>
          <div className="text-3xl font-bold text-text-primary mb-1 relative z-10">{draftPosts}</div>
          <div className="text-xs text-amber-400 flex items-center gap-1 relative z-10"><Clock size={12}/> Needs Review</div>
        </div>

        {/* Active Jobs */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-accent-blue-glow transition-all duration-300">
          <div className="absolute -right-4 -top-4 text-green-400/5 group-hover:text-green-400/10 transition-colors">
            <Briefcase size={80} />
          </div>
          <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-2 relative z-10">Active Jobs</div>
          <div className="text-3xl font-bold text-text-primary mb-1 relative z-10">{publishedJobs}</div>
          <div className="text-xs text-green-400 flex items-center gap-1 relative z-10"><CheckCircle size={12}/> Accepting Applicants</div>
        </div>

        {/* Draft Jobs */}
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md relative overflow-hidden group hover:border-accent-blue-glow transition-all duration-300">
          <div className="absolute -right-4 -top-4 text-amber-400/5 group-hover:text-amber-400/10 transition-colors">
            <Briefcase size={80} />
          </div>
          <div className="text-text-muted text-[0.65rem] font-bold uppercase tracking-wider mb-2 relative z-10">Draft Jobs</div>
          <div className="text-3xl font-bold text-text-primary mb-1 relative z-10">{draftJobs}</div>
          <div className="text-xs text-amber-400 flex items-center gap-1 relative z-10"><Clock size={12}/> Unpublished</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link href="/admin/posts" className="bg-bg-card border border-border-glass rounded-xl p-6 backdrop-blur-md hover:border-accent-blue-glow transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
          <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.1)] text-accent-blue-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]">
            <FileText size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center justify-between">
            Manage Blog
            <ChevronRight size={20} className="text-text-muted group-hover:text-accent-blue-light transition-colors group-hover:translate-x-1" />
          </h3>
          <p className="text-sm text-text-secondary">View, edit, toggle publishing status, or delete existing articles from the blog.</p>
        </Link>
        
        <Link href="/admin/jobs" className="bg-bg-card border border-border-glass rounded-xl p-6 backdrop-blur-md hover:border-accent-blue-glow transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
          <div className="w-12 h-12 rounded-xl bg-[rgba(59,130,246,0.1)] text-accent-blue-light flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2 flex items-center justify-between">
            Manage Jobs
            <ChevronRight size={20} className="text-text-muted group-hover:text-accent-blue-light transition-colors group-hover:translate-x-1" />
          </h3>
          <p className="text-sm text-text-secondary">View, edit, toggle active status, or delete technical job listings.</p>
        </Link>
      </div>

      <h2 className="text-lg font-bold text-text-primary mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/editor/new" className="flex items-center gap-4 p-5 bg-bg-card border border-border-glass rounded-xl hover:bg-bg-primary/50 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-border-glass text-text-primary group-hover:text-accent-blue group-hover:bg-[rgba(59,130,246,0.1)] flex items-center justify-center transition-colors">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Write New Post</div>
            <div className="text-xs text-text-muted">Open the rich-text editor for a new article</div>
          </div>
        </Link>
        <Link href="/admin/jobs/editor/new" className="flex items-center gap-4 p-5 bg-bg-card border border-border-glass rounded-xl hover:bg-bg-primary/50 transition-colors group">
          <div className="w-10 h-10 rounded-full bg-border-glass text-text-primary group-hover:text-amber-400 group-hover:bg-[rgba(245,197,66,0.1)] flex items-center justify-center transition-colors">
            <Plus size={20} />
          </div>
          <div>
            <div className="font-semibold text-text-primary mb-0.5">Post New Job</div>
            <div className="text-xs text-text-muted">List a new opportunity for the community</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
