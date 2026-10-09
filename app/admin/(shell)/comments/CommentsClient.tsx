"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { ExternalLink, Eye, EyeOff, MessageSquare, Search, Trash2, X } from "lucide-react";
import { toggleCommentVisibility, deleteComment } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  PageHeader,
  Panel,
  StatusBadge,
  EmptyState,
  Segmented,
  adminInputClass,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { runAction } from "@/components/admin/run-action";
import { cn } from "@/lib/utils";

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

type StatusFilter = "all" | "visible" | "hidden";

const newestFirst = (a: { createdAt: Date }, b: { createdAt: Date }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function withId(set: ReadonlySet<string>, id: string, present: boolean): ReadonlySet<string> {
  const next = new Set(set);
  if (present) next.add(id);
  else next.delete(id);
  return next;
}

const noopSubscribe = () => () => {};

/** False during the server render and hydration, true afterwards (for browser-timezone dates). */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );
}

export default function CommentsClient({
  initialComments,
}: {
  initialComments: CommentWithPost[];
}) {
  const confirm = useConfirm();
  const isClient = useIsClient();

  // Local copy for optimistic updates. When a server action revalidates this page,
  // fresh server data arrives as new props and replaces the local copy.
  const [comments, setComments] = useState(initialComments);
  const [serverComments, setServerComments] = useState(initialComments);
  if (initialComments !== serverComments) {
    setServerComments(initialComments);
    setComments(initialComments);
  }
  const [busyIds, setBusyIds] = useState<ReadonlySet<string>>(new Set());

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const hiddenCount = useMemo(() => comments.filter((c) => c.isHidden).length, [comments]);
  const visibleCount = comments.length - hiddenCount;

  const filteredComments = useMemo(() => {
    const q = search.trim().toLowerCase();
    return comments.filter((c) => {
      const matchesSearch =
        !q ||
        (c.name?.toLowerCase().includes(q) ?? false) ||
        (c.email?.toLowerCase().includes(q) ?? false) ||
        c.content.toLowerCase().includes(q) ||
        c.post.title.toLowerCase().includes(q);
      const matchesStatus = status === "all" || (status === "hidden" ? c.isHidden : !c.isHidden);
      return matchesSearch && matchesStatus;
    });
  }, [comments, search, status]);

  const filtersActive = search.trim() !== "" || status !== "all";

  function clearFilters() {
    setSearch("");
    setStatus("all");
  }

  async function handleToggle(comment: CommentWithPost) {
    const wasHidden = comment.isHidden;
    setBusyIds((s) => withId(s, comment.id, true));
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, isHidden: !wasHidden } : c)));

    const result = await runAction(
      toggleCommentVisibility(comment.id, wasHidden),
      wasHidden ? "Comment is visible on the blog again" : "Comment hidden from the blog"
    );
    if (!result) {
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, isHidden: wasHidden } : c)));
    }
    setBusyIds((s) => withId(s, comment.id, false));
  }

  async function handleDelete(comment: CommentWithPost) {
    const ok = await confirm({
      title: "Delete this comment?",
      description: `The comment by ${comment.name || "Anonymous"} on “${comment.post.title}” will be permanently deleted. This cannot be undone.${
        comment.isHidden ? "" : " To keep it but remove it from the blog, hide it instead."
      }`,
      confirmLabel: "Delete comment",
      destructive: true,
    });
    if (!ok) return;

    setComments((prev) => prev.filter((c) => c.id !== comment.id));
    const result = await runAction(deleteComment(comment.id), "Comment deleted");
    if (!result) {
      setComments((prev) =>
        prev.some((c) => c.id === comment.id) ? prev : [...prev, comment].sort(newestFirst)
      );
    }
  }

  return (
    <div>
      <PageHeader
        title="Comments"
        description="Review reader comments on blog posts. Hidden comments are kept but don't appear on the blog."
      />

      {comments.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative md:w-80">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, comment or post"
              aria-label="Search comments"
              className={cn(adminInputClass, "pl-8", search && "pr-9")}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                title="Clear search"
                className="absolute right-1.5 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: `All (${comments.length})` },
                { value: "visible", label: `Visible (${visibleCount})` },
                { value: "hidden", label: `Hidden (${hiddenCount})` },
              ]}
            />
            {filtersActive && (
              <button
                type="button"
                onClick={clearFilters}
                className="rounded text-xs font-medium text-text-muted underline-offset-4 transition-colors hover:text-text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      <Panel>
        {comments.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="No comments yet"
            description="Comments readers leave on blog posts will appear here for review."
          />
        ) : filteredComments.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No comments match these filters"
            description="Try another search term or status."
            action={
              <Button variant="outline" size="xs" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <ul className="divide-y divide-border-glass">
              {filteredComments.map((comment) => {
                const busy = busyIds.has(comment.id);
                const created = new Date(comment.createdAt);
                return (
                  <li
                    key={comment.id}
                    className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-start sm:gap-6"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-medium text-text-primary">
                          {comment.name || "Anonymous"}
                        </span>
                        {comment.email && (
                          <span className="break-all text-xs text-text-muted">{comment.email}</span>
                        )}
                        <span aria-hidden="true" className="text-xs text-text-muted">
                          ·
                        </span>
                        <time
                          dateTime={created.toISOString()}
                          title={isClient ? format(created, "MMM d, yyyy 'at' h:mm a") : undefined}
                          className="text-xs text-text-muted"
                          suppressHydrationWarning
                        >
                          {formatDistanceToNow(created, { addSuffix: true })}
                        </time>
                        <StatusBadge status={comment.isHidden ? "hidden" : "visible"} />
                      </div>

                      <p
                        className={cn(
                          "mt-1.5 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed",
                          comment.isHidden ? "text-text-muted" : "text-text-secondary"
                        )}
                      >
                        {comment.content}
                      </p>

                      <a
                        href={`/blog/${comment.post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Open the post in a new tab"
                        className="mt-2 inline-flex max-w-full items-center gap-1 text-xs text-text-muted transition-colors hover:text-accent-blue-light"
                      >
                        <span className="shrink-0">On</span>
                        <span className="truncate font-medium">{comment.post.title}</span>
                        <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                      </a>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <Button
                        variant="outline"
                        size="xs"
                        disabled={busy}
                        onClick={() => handleToggle(comment)}
                        title={comment.isHidden ? "Show this comment on the blog" : "Hide this comment on the blog"}
                      >
                        {comment.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                        {comment.isHidden ? "Show" : "Hide"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        disabled={busy}
                        onClick={() => handleDelete(comment)}
                        aria-label={`Delete comment by ${comment.name || "Anonymous"}`}
                        title="Delete comment permanently"
                        className="text-text-muted hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-border-glass px-4 py-2.5 text-xs text-text-muted">
              {filteredComments.length === comments.length
                ? plural(comments.length, "comment")
                : `Showing ${filteredComments.length} of ${plural(comments.length, "comment")}`}
            </div>
          </>
        )}
      </Panel>
    </div>
  );
}
