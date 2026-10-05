"use client";

import { useState, useMemo, useTransition } from "react";
import { toggleCommentVisibility, deleteComment } from "@/app/admin/actions";
import { format } from "date-fns";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Trash2,
  MessageSquare,
  ExternalLink,
  Search,
  X,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";

interface CommentWithPost {
  id: string;
  content: string;
  name: string | null;
  email: string | null;
  isHidden: boolean;
  createdAt: Date;
  post: {
    title: string;
    slug: string;
  };
}

export default function CommentsClient({
  initialComments,
}: {
  initialComments: CommentWithPost[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "VISIBLE" | "HIDDEN">("ALL");
  const [isPending, startTransition] = useTransition();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggle = (id: string, isHidden: boolean) => {
    startTransition(async () => {
      await toggleCommentVisibility(id, isHidden);
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isHidden: !isHidden } : c))
      );
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Permanently delete this comment? This cannot be undone.")) return;
    setDeletingId(id);
    startTransition(async () => {
      await deleteComment(id);
      setComments((prev) => prev.filter((c) => c.id !== id));
      setDeletingId(null);
    });
  };

  const visibleCount = useMemo(() => comments.filter((c) => !c.isHidden).length, [comments]);
  const hiddenCount = useMemo(() => comments.filter((c) => c.isHidden).length, [comments]);

  const filteredComments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return comments.filter((c) => {
      const matchesSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        c.content.toLowerCase().includes(q) ||
        c.post.title.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "VISIBLE" && !c.isHidden) ||
        (statusFilter === "HIDDEN" && c.isHidden);

      return matchesSearch && matchesStatus;
    });
  }, [comments, search, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-text-primary">Comment Moderation</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue-light border border-accent-blue-glow/30">
              {comments.length} Total
            </span>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Review reader discussions, hide toxic remarks or spam, and manage community engagement.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-card border border-border-glass text-xs font-medium text-green-400">
            <CheckCircle size={14} /> {visibleCount} Visible
          </span>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium ${
              hiddenCount > 0
                ? "bg-amber-400/10 border-amber-400/30 text-amber-400 font-semibold"
                : "bg-bg-card border-border-glass text-text-muted"
            }`}
          >
            <ShieldAlert size={14} /> {hiddenCount} Hidden
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-bg-card border border-border-glass rounded-xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search by author, email, comment text, or article title..."
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
            All ({comments.length})
          </button>
          <button
            onClick={() => setStatusFilter("VISIBLE")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "VISIBLE"
                ? "bg-green-500 text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Visible ({visibleCount})
          </button>
          <button
            onClick={() => setStatusFilter("HIDDEN")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              statusFilter === "HIDDEN"
                ? "bg-amber-500 text-white"
                : "text-text-muted hover:text-text-primary"
            }`}
          >
            Hidden ({hiddenCount})
          </button>
        </div>

        {(search || statusFilter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
            }}
            className="text-xs text-text-muted hover:text-accent-blue-light transition-colors px-2 py-1 text-center whitespace-nowrap"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="text-center py-20 bg-bg-card border border-border-glass rounded-xl">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bg-primary border border-border-glass flex items-center justify-center">
            <MessageSquare size={24} className="text-text-muted" />
          </div>
          <p className="text-text-primary font-semibold">No comments submitted yet</p>
          <p className="text-xs text-text-muted mt-1">Reader comments on blog articles will appear here for review.</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="text-center py-16 bg-bg-card border border-border-glass rounded-xl">
          <p className="text-text-primary font-semibold">No comments match your search</p>
          <p className="text-xs text-text-muted mt-1">Try clearing your search query or status filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-bg-card border rounded-xl p-5 transition-all duration-200 ${
                comment.isHidden
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-border-glass"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Post Reference */}
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue-light hover:text-accent-blue transition-colors mb-2 group"
                  >
                    <ExternalLink size={12} className="group-hover:translate-x-0.5 transition-transform" />
                    <span>On: &ldquo;{comment.post.title}&rdquo;</span>
                  </Link>

                  {/* Author Info */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-[0.55rem] font-bold text-accent-blue-light">
                      {(comment.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {comment.name || "Anonymous"}
                    </span>
                    {comment.email && (
                      <span className="text-xs text-text-muted font-mono">
                        ({comment.email})
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-border-glass" />
                    <time className="text-xs text-text-muted">
                      {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                    {comment.isHidden && (
                      <span className="text-[0.65rem] font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full uppercase">
                        Hidden from Public
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => handleToggle(comment.id, comment.isHidden)}
                    disabled={isPending}
                    className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-primary transition-colors disabled:opacity-50"
                    title={comment.isHidden ? "Make visible" : "Hide from public view"}
                  >
                    {comment.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending || deletingId === comment.id}
                    className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete comment permanently"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
