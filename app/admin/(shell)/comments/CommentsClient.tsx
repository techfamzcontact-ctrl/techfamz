"use client";

import { useState, useTransition } from "react";
import { toggleCommentVisibility, deleteComment } from "../../actions";
import { format } from "date-fns";
import Link from "next/link";
import { Eye, EyeOff, Trash2, MessageSquare, ExternalLink } from "lucide-react";

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

export default function CommentsClient({ initialComments }: { initialComments: CommentWithPost[] }) {
  const [comments, setComments] = useState(initialComments);
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

  const visibleCount = comments.filter((c) => !c.isHidden).length;
  const hiddenCount = comments.filter((c) => c.isHidden).length;

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Comments</h1>
          <p className="text-sm text-text-muted mt-1">
            {comments.length} total · {visibleCount} visible · {hiddenCount} hidden
          </p>
        </div>
      </div>

      {comments.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-bg-card border border-border-glass flex items-center justify-center">
            <MessageSquare size={24} className="text-text-muted" />
          </div>
          <p className="text-text-muted">No comments yet across any posts.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`bg-bg-card border rounded-xl p-5 backdrop-blur-md transition-all duration-300 ${
                comment.isHidden
                  ? "border-red-500/20 opacity-60"
                  : "border-border-glass"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Post Reference */}
                  <Link
                    href={`/blog/${comment.post.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-blue-light hover:text-accent-blue transition-colors mb-2"
                  >
                    <ExternalLink size={12} />
                    {comment.post.title}
                  </Link>

                  {/* Author Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent-blue-glow-soft border border-accent-blue-glow flex items-center justify-center text-[0.55rem] font-bold text-accent-blue-light">
                      {(comment.name || "A").charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-text-primary">
                      {comment.name || "Anonymous"}
                    </span>
                    {comment.email && (
                      <span className="text-xs text-text-muted">
                        ({comment.email})
                      </span>
                    )}
                    <span className="w-1 h-1 rounded-full bg-border-glass" />
                    <time className="text-xs text-text-muted">
                      {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                    </time>
                    {comment.isHidden && (
                      <span className="text-[0.65rem] font-semibold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-full">
                        Hidden
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
                    title={comment.isHidden ? "Show comment" : "Hide comment"}
                  >
                    {comment.isHidden ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    disabled={isPending || deletingId === comment.id}
                    className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title="Delete comment"
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
