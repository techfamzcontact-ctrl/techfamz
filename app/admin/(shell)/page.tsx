"use client";

import { useEffect, useState } from "react";
import { getPosts, togglePublishStatus, deletePost } from "../actions";
import Link from "next/link";
import { format } from "date-fns";
import { Edit, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: string | null;
  createdAt: Date;
};

export default function AdminDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleToggle = async (id: string, status: boolean) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !status } : p))
    );
    await togglePublishStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await deletePost(id);
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
          <h1 className="text-2xl font-bold text-text-primary mb-1">Posts</h1>
          <p className="text-sm text-text-muted">Manage your blog content</p>
        </div>
        <Link
          href="/admin/editor/new"
          className="bg-accent-blue text-white py-2 px-4 flex items-center gap-2 rounded-lg font-medium hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
        >
          Write Post
        </Link>
      </div>

      <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border-glass">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass/50">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-text-muted">
                    No posts yet. Start writing!
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-bg-primary/50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-text-primary mb-1">{post.title}</p>
                      <p className="text-xs text-text-muted">/{post.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.7rem] font-bold uppercase tracking-wider border ${
                          post.published
                            ? "text-green-400 bg-green-400/10 border-green-400/20"
                            : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                        }`}
                      >
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggle(post.id, post.published)}
                          className="p-2 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
                          title={post.published ? "Unpublish" : "Publish"}
                        >
                          {post.published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        {post.published && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-md text-text-muted hover:text-accent-blue-light hover:bg-[rgba(59,130,246,0.1)] transition-colors"
                            title="View Live"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/editor/${post.id}`}
                          className="p-2 rounded-md text-text-muted hover:text-cta-yellow hover:bg-[rgba(245,197,66,0.1)] transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
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
