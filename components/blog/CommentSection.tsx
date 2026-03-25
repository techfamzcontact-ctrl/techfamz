"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  content: string;
  name: string | null;
  createdAt: string;
}

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      if (res.ok) {
        const data = await res.json();
        setComments(data);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, name, email, postId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to post comment");
      }

      const newComment = await res.json();
      setComments((prev) => [newComment, ...prev]);
      setContent("");
      setName("");
      setEmail("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-border-glass">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent-blue-light">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">
          Comments
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-text-muted">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-10">
        <div className="bg-bg-card border border-border-glass rounded-xl p-5 md:p-6 backdrop-blur-md">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            required
            rows={3}
            className="w-full bg-bg-primary/50 border border-border-glass rounded-lg p-4 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue resize-y min-h-[100px] text-sm transition-colors"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (optional)"
              className="bg-bg-primary/50 border border-border-glass rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue text-sm transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional, private)"
              className="bg-bg-primary/50 border border-border-glass rounded-lg px-4 py-2.5 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent-blue text-sm transition-colors"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-[0.7rem] text-text-muted">
              {name.trim() ? `Posting as ${name.trim()}` : "Posting anonymously"}
            </p>
            <button
              type="submit"
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-2 py-2.5 px-6 text-sm font-semibold text-white bg-accent-blue rounded-lg transition-all duration-300 hover:bg-blue-600 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                  </svg>
                  Post Comment
                </>
              )}
            </button>
          </div>

          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
          {success && (
            <p className="mt-3 text-sm text-green-400">Comment posted successfully!</p>
          )}
        </div>
      </form>

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg-card border border-border-glass rounded-xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-border-glass" />
                <div className="h-3 w-24 bg-border-glass rounded" />
              </div>
              <div className="h-3 w-full bg-border-glass rounded mb-2" />
              <div className="h-3 w-3/4 bg-border-glass rounded" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-bg-card border border-border-glass flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-muted">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-text-muted text-sm">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-bg-card border border-border-glass rounded-xl p-5 backdrop-blur-md transition-all duration-300 hover:border-border-glass-hover"
            >
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-[0.65rem] font-bold text-accent-blue-light shrink-0">
                  {(comment.name || "A").charAt(0).toUpperCase()}
                </div>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-semibold text-text-primary truncate">
                    {comment.name || "Anonymous"}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-border-glass shrink-0" />
                  <time className="text-xs text-text-muted shrink-0">
                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </time>
                </div>
              </div>
              <p className="text-[0.9rem] text-text-secondary leading-relaxed whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
