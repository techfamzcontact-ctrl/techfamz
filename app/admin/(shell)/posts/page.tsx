"use client";

import { useEffect, useState, useMemo, useTransition, Fragment } from "react";
import {
  getPosts,
  togglePublishStatus,
  deletePost,
  toggleCommentVisibility,
  deleteComment,
} from "../../actions";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  Edit,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  MessageSquare,
  X,
  Search,
  Plus,
  FileText,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: string | null;
  createdAt: Date;
  views: number;
};

type PostComment = {
  id: string;
  content: string;
  name: string | null;
  email: string | null;
  isHidden: boolean;
  createdAt: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  // Comment drawer state
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [activePostTitle, setActivePostTitle] = useState("");
  const [postComments, setPostComments] = useState<PostComment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

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
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !status } : p))
    );
    await togglePublishStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post? This cannot be undone.")) return;
    setPosts((prev) => prev.filter((p) => p.id !== id));
    await deletePost(id);
  };

  // Fetch comments for a specific post
  const openComments = async (postId: string, postTitle: string) => {
    if (activePostId === postId) {
      setActivePostId(null);
      return;
    }
    setActivePostId(postId);
    setActivePostTitle(postTitle);
    setCommentsLoading(true);
    try {
      const res = await fetch(`/api/comments?postId=${postId}&admin=1`);
      if (res.ok) {
        setPostComments(await res.json());
      }
    } catch {
      // silently fail
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComment = (id: string, isHidden: boolean) => {
    startTransition(async () => {
      await toggleCommentVisibility(id, isHidden);
      setPostComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isHidden: !isHidden } : c))
      );
    });
  };

  const handleDeleteComment = (id: string) => {
    if (!confirm("Permanently delete this comment?")) return;
    startTransition(async () => {
      await deleteComment(id);
      setPostComments((prev) => prev.filter((c) => c.id !== id));
    });
  };

  // Derived categories
  const availableCategories = useMemo(() => {
    const cats = Array.from(new Set(posts.map((p) => p.category).filter(Boolean))) as string[];
    return cats.sort();
  }, [posts]);

  // Derived filtered posts
  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        (post.category && post.category.toLowerCase().includes(q));

      const matchesCategory =
        selectedCategory === "ALL" || post.category === selectedCategory;

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "PUBLISHED" && post.published) ||
        (statusFilter === "DRAFT" && !post.published);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, search, selectedCategory, statusFilter]);

  // Summary counts
  const publishedCount = useMemo(() => posts.filter((p) => p.published).length, [posts]);
  const draftCount = posts.length - publishedCount;
  const totalViews = useMemo(() => posts.reduce((sum, p) => sum + (p.views || 0), 0), [posts]);

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
            <h1 className="text-2xl font-bold text-text-primary">Blog Posts</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue-light border border-accent-blue-glow/30">
              {posts.length} Total
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Author, edit, and publish technical insights, tutorials, and engineering announcements.
          </p>
        </div>

        <Link
          href="/admin/editor/new"
          className="bg-accent-blue text-white py-2 px-4 flex items-center gap-2 rounded-lg font-semibold text-xs hover:bg-blue-600 transition-colors shadow-[0_0_15px_var(--color-accent-blue-glow-soft)] self-start sm:self-center"
        >
          <Plus size={16} />
          <span>Write Post</span>
        </Link>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Total Articles
          </div>
          <div className="text-2xl font-bold text-text-primary">{posts.length}</div>
          <div className="text-[0.7rem] text-accent-blue-light mt-0.5 flex items-center gap-1">
            <FileText size={11} /> Platform stories
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Published Live
          </div>
          <div className="text-2xl font-bold text-text-primary">{publishedCount}</div>
          <div className="text-[0.7rem] text-green-400 mt-0.5 flex items-center gap-1">
            <CheckCircle size={11} /> Publicly readable
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Drafts
          </div>
          <div className="text-2xl font-bold text-text-primary">{draftCount}</div>
          <div className="text-[0.7rem] text-amber-400 mt-0.5 flex items-center gap-1">
            <Clock size={11} /> In progress
          </div>
        </div>

        <div className="bg-bg-card border border-border-glass rounded-xl p-4">
          <div className="text-[0.65rem] font-bold text-text-muted uppercase tracking-wider mb-1">
            Total Readers
          </div>
          <div className="text-2xl font-bold text-text-primary">{totalViews.toLocaleString()}</div>
          <div className="text-[0.7rem] text-cyan-400 mt-0.5 flex items-center gap-1">
            <Sparkles size={11} /> Post impressions
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-glass rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by title, slug, or category..."
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

        {/* Category Filter */}
        <div className="w-full md:w-48">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2 px-3 bg-bg-primary border border-border-glass rounded-lg text-sm text-text-primary focus:outline-none focus:border-accent-blue transition-colors"
          >
            <option value="ALL">All Categories</option>
            {availableCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
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
            onClick={() => setStatusFilter("PUBLISHED")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "PUBLISHED"
                ? "bg-green-500 text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Live ({publishedCount})
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

        {(search || selectedCategory !== "ALL" || statusFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setStatusFilter("ALL");
            }}
            className="text-xs text-text-muted hover:text-accent-blue-light transition-colors px-2 py-1 text-center whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Posts Table */}
      <div className="bg-bg-card border border-border-glass rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-border-glass text-[0.7rem] uppercase tracking-wider text-text-muted font-bold bg-bg-primary/50">
                <th className="px-6 py-4">Title & Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-glass/50">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                    <FileText size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="font-semibold text-text-primary">No articles found</p>
                    <p className="text-xs text-text-muted mt-1">
                      {search || selectedCategory !== "ALL" || statusFilter !== "ALL"
                        ? "Try adjusting your search query or status filter."
                        : "Start creating technical articles for the community!"}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <Fragment key={post.id}>
                    <tr className="hover:bg-bg-primary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/editor/${post.id}`}
                            className="font-semibold text-sm text-text-primary hover:text-accent-blue-light transition-colors line-clamp-1"
                          >
                            {post.title}
                          </Link>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                          <span className="font-mono text-[0.68rem] text-text-muted/70">
                            /blog/{post.slug}
                          </span>
                          {post.category && (
                            <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue-light border border-accent-blue-glow/20">
                              {post.category}
                            </span>
                          )}
                        </div>
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
                      <td className="px-6 py-4 text-xs text-text-secondary whitespace-nowrap">
                        {format(new Date(post.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold text-cyan-400 text-right whitespace-nowrap">
                        {Intl.NumberFormat("en-US").format(post.views)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openComments(post.id, post.title)}
                            className={`p-2 rounded-md transition-colors ${
                              activePostId === post.id
                                ? "text-accent-blue-light bg-accent-blue-glow-soft"
                                : "text-text-muted hover:text-accent-blue-light hover:bg-[rgba(59,130,246,0.1)]"
                            }`}
                            title="Moderate Comments"
                          >
                            <MessageSquare size={16} />
                          </button>
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

                    {/* Expandable comments panel */}
                    {activePostId === post.id && (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 bg-bg-primary/80 border-y border-border-glass">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-text-primary">
                              Comments on &ldquo;{activePostTitle}&rdquo;
                            </span>
                            <button
                              onClick={() => setActivePostId(null)}
                              className="text-text-muted hover:text-text-primary p-1 rounded transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>

                          {commentsLoading ? (
                            <div className="py-6 text-center text-xs text-text-muted">
                              Loading comments...
                            </div>
                          ) : postComments.length === 0 ? (
                            <div className="py-6 text-center text-xs text-text-muted">
                              No comments on this post yet.
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {postComments.map((c) => (
                                <div
                                  key={c.id}
                                  className={`flex items-start justify-between gap-4 p-3 rounded-lg border text-xs transition-colors ${
                                    c.isHidden
                                      ? "bg-red-500/5 border-red-500/20 opacity-60"
                                      : "bg-bg-card border-border-glass"
                                  }`}
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-semibold text-text-primary">
                                        {c.name || "Anonymous"}
                                      </span>
                                      {c.email && (
                                        <span className="text-text-muted">({c.email})</span>
                                      )}
                                      <span className="text-text-muted">·</span>
                                      <span className="text-text-muted">
                                        {formatDistanceToNow(new Date(c.createdAt), {
                                          addSuffix: true,
                                        })}
                                      </span>
                                      {c.isHidden && (
                                        <span className="text-[0.65rem] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase">
                                          Hidden
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-text-secondary whitespace-pre-wrap">{c.content}</p>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0">
                                    <button
                                      onClick={() => handleToggleComment(c.id, c.isHidden)}
                                      disabled={isPending}
                                      className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors disabled:opacity-50"
                                      title={c.isHidden ? "Show comment" : "Hide comment"}
                                    >
                                      {c.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(c.id)}
                                      disabled={isPending}
                                      className="p-1.5 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                      title="Delete comment"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredPosts.length > 0 && (
          <div className="px-6 py-3 border-t border-border-glass bg-bg-primary/30 flex items-center justify-between text-xs text-text-muted">
            <span>
              Showing {filteredPosts.length} of {posts.length} posts
            </span>
            <span>Techfamz Blog Hub</span>
          </div>
        )}
      </div>
    </div>
  );
}
