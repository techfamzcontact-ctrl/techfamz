"use client";

import { useEffect, useState, useTransition } from "react";
import { getPosts, togglePublishStatus, deletePost, toggleCommentVisibility, deleteComment } from "../../actions";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { Edit, Trash2, ExternalLink, Eye, EyeOff, MessageSquare, X } from "lucide-react";

type Post = {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  category: string | null;
  createdAt: Date;
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
    if (!window.confirm("Are you sure you want to delete this post?")) return;
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
          <table className="w-full text-left border-collapse min-w-[700px]">
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
                  <>
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
                            onClick={() => openComments(post.id, post.title)}
                            className={`p-2 rounded-md transition-colors ${
                              activePostId === post.id
                                ? "text-accent-blue-light bg-accent-blue-glow-soft"
                                : "text-text-muted hover:text-accent-blue-light hover:bg-[rgba(59,130,246,0.1)]"
                            }`}
                            title="View Comments"
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
                      <tr key={`${post.id}-comments`}>
                        <td colSpan={4} className="p-0">
                          <div className="bg-bg-primary/50 border-t border-border-glass px-6 py-5">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
                                <MessageSquare size={14} className="text-accent-blue-light" />
                                Comments on &ldquo;{activePostTitle}&rdquo;
                              </h3>
                              <button
                                onClick={() => setActivePostId(null)}
                                className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-bg-card transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>

                            {commentsLoading ? (
                              <div className="flex items-center gap-2 text-sm text-text-muted py-4">
                                <div className="w-4 h-4 rounded-full border-2 border-accent-blue border-t-transparent animate-spin" />
                                Loading comments...
                              </div>
                            ) : postComments.length === 0 ? (
                              <p className="text-sm text-text-muted py-4">No comments on this post yet.</p>
                            ) : (
                              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {postComments.map((comment) => (
                                  <div
                                    key={comment.id}
                                    className={`flex items-start justify-between gap-3 p-3 rounded-lg border transition-all ${
                                      comment.isHidden
                                        ? "border-red-500/20 opacity-60 bg-red-500/5"
                                        : "border-border-glass bg-bg-card"
                                    }`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <div className="w-5 h-5 rounded-full bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-[0.5rem] font-bold text-accent-blue-light">
                                          {(comment.name || "A").charAt(0).toUpperCase()}
                                        </div>
                                        <span className="text-xs font-semibold text-text-primary">
                                          {comment.name || "Anonymous"}
                                        </span>
                                        {comment.email && (
                                          <span className="text-[0.65rem] text-text-muted">({comment.email})</span>
                                        )}
                                        <span className="text-[0.65rem] text-text-muted">
                                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                        </span>
                                        {comment.isHidden && (
                                          <span className="text-[0.6rem] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded-full">
                                            Hidden
                                          </span>
                                        )}
                                      </div>
                                      <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                                        {comment.content}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button
                                        onClick={() => handleToggleComment(comment.id, comment.isHidden)}
                                        disabled={isPending}
                                        className="p-1.5 rounded text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors disabled:opacity-50"
                                        title={comment.isHidden ? "Show" : "Hide"}
                                      >
                                        {comment.isHidden ? <Eye size={13} /> : <EyeOff size={13} />}
                                      </button>
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        disabled={isPending}
                                        className="p-1.5 rounded text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                        title="Delete"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
