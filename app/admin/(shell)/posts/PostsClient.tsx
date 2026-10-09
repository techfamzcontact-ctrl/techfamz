"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import {
  Eye,
  EyeOff,
  ExternalLink,
  FileText,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  togglePublishStatus,
  deletePost,
  toggleCommentVisibility,
  deleteComment,
  type getPosts,
} from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PageHeader,
  Panel,
  StatusBadge,
  EmptyState,
  Segmented,
  adminInputClass,
  adminTable,
} from "@/components/admin/AdminUI";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { runAction } from "@/components/admin/run-action";
import { cn } from "@/lib/utils";

type PostRow = Awaited<ReturnType<typeof getPosts>>[number];

/** Shape returned by GET /api/comments?postId=…&admin=1 */
type PostComment = {
  id: string;
  content: string;
  name: string | null;
  email: string | null;
  isHidden: boolean;
  createdAt: string;
};

type StatusFilter = "all" | "published" | "draft";
type CommentsState = "idle" | "loading" | "error" | "ready";

// Fixed locale so the server render and the browser agree on number formatting
const numberFormat = new Intl.NumberFormat("en-US");

const newestFirst = (a: { createdAt: Date | string }, b: { createdAt: Date | string }) =>
  new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

function withId(set: ReadonlySet<string>, id: string, present: boolean): ReadonlySet<string> {
  const next = new Set(set);
  if (present) next.add(id);
  else next.delete(id);
  return next;
}

export default function PostsClient({ initialPosts }: { initialPosts: PostRow[] }) {
  const confirm = useConfirm();

  // Local copy for optimistic updates. When a server action revalidates this page,
  // fresh server data arrives as new props and replaces the local copy.
  const [posts, setPosts] = useState(initialPosts);
  const [serverPosts, setServerPosts] = useState(initialPosts);
  if (initialPosts !== serverPosts) {
    setServerPosts(initialPosts);
    setPosts(initialPosts);
  }
  const [busyPostIds, setBusyPostIds] = useState<ReadonlySet<string>>(new Set());

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  // Comments drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentsState, setCommentsState] = useState<CommentsState>("idle");
  const [commentsError, setCommentsError] = useState("");
  const [busyCommentIds, setBusyCommentIds] = useState<ReadonlySet<string>>(new Set());
  // Incremented per fetch so a slow response for a previous post is ignored
  const commentsRequest = useRef(0);

  const activePost = posts.find((p) => p.id === activePostId) ?? null;

  const categories = useMemo(
    () =>
      Array.from(new Set(posts.map((p) => p.category).filter((c): c is string => Boolean(c)))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [posts]
  );

  const publishedCount = useMemo(() => posts.filter((p) => p.published).length, [posts]);
  const draftCount = posts.length - publishedCount;

  const filteredPosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.slug.toLowerCase().includes(q) ||
        (post.category?.toLowerCase().includes(q) ?? false);
      const matchesCategory = !category || post.category === category;
      const matchesStatus =
        status === "all" || (status === "published" ? post.published : !post.published);
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [posts, search, category, status]);

  const filtersActive = search.trim() !== "" || category !== "" || status !== "all";

  function clearFilters() {
    setSearch("");
    setCategory("");
    setStatus("all");
  }

  function adjustCommentCount(postId: string, update: (count: number) => number) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, _count: { ...p._count, comments: Math.max(0, update(p._count.comments)) } } : p
      )
    );
  }

  // ── Post actions ──────────────────────────────────────────

  async function handleTogglePublish(post: PostRow) {
    const wasPublished = post.published;
    setBusyPostIds((s) => withId(s, post.id, true));
    setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: !wasPublished } : p)));

    const result = await runAction(
      togglePublishStatus(post.id, wasPublished),
      wasPublished ? "Post unpublished. It is now a draft." : "Post published"
    );
    if (!result) {
      setPosts((prev) => prev.map((p) => (p.id === post.id ? { ...p, published: wasPublished } : p)));
    }
    setBusyPostIds((s) => withId(s, post.id, false));
  }

  async function handleDeletePost(post: PostRow) {
    const commentCount = post._count.comments;
    const ok = await confirm({
      title: "Delete this post?",
      description: `“${post.title}”${
        commentCount > 0 ? ` and its ${plural(commentCount, "comment")}` : ""
      } will be permanently deleted${post.published ? " and removed from the blog" : ""}. This cannot be undone.`,
      confirmLabel: "Delete post",
      destructive: true,
    });
    if (!ok) return;

    setPosts((prev) => prev.filter((p) => p.id !== post.id));
    const result = await runAction(deletePost(post.id), "Post deleted");
    if (!result) {
      setPosts((prev) => (prev.some((p) => p.id === post.id) ? prev : [...prev, post].sort(newestFirst)));
    }
  }

  // ── Comments drawer ───────────────────────────────────────

  async function loadComments(postId: string) {
    const requestId = ++commentsRequest.current;
    setComments([]);
    setCommentsError("");
    setCommentsState("loading");

    try {
      const res = await fetch(`/api/comments?postId=${encodeURIComponent(postId)}&admin=1`, {
        cache: "no-store",
      });
      if (requestId !== commentsRequest.current) return;
      if (!res.ok) {
        setCommentsError(
          res.status === 401
            ? "Your session has expired. Please sign in again."
            : "The comments couldn't be loaded. Please try again."
        );
        setCommentsState("error");
        return;
      }
      const data = (await res.json()) as PostComment[];
      if (requestId !== commentsRequest.current) return;
      setComments(data);
      setCommentsState("ready");
      // Keep the table's count in step with what was just loaded
      adjustCommentCount(postId, () => data.length);
    } catch {
      if (requestId !== commentsRequest.current) return;
      setCommentsError("The comments couldn't be loaded. Check your connection and try again.");
      setCommentsState("error");
    }
  }

  function openComments(post: PostRow) {
    setActivePostId(post.id);
    setDrawerOpen(true);
    loadComments(post.id);
  }

  async function handleToggleComment(comment: PostComment) {
    const wasHidden = comment.isHidden;
    setBusyCommentIds((s) => withId(s, comment.id, true));
    setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, isHidden: !wasHidden } : c)));

    const result = await runAction(
      toggleCommentVisibility(comment.id, wasHidden),
      wasHidden ? "Comment is visible on the blog again" : "Comment hidden from the blog"
    );
    if (!result) {
      setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, isHidden: wasHidden } : c)));
    }
    setBusyCommentIds((s) => withId(s, comment.id, false));
  }

  async function handleDeleteComment(comment: PostComment, postId: string) {
    const ok = await confirm({
      title: "Delete this comment?",
      description: `The comment by ${comment.name || "Anonymous"} will be permanently deleted. This cannot be undone.${
        comment.isHidden ? "" : " To keep it but remove it from the blog, hide it instead."
      }`,
      confirmLabel: "Delete comment",
      destructive: true,
    });
    if (!ok) return;

    const requestId = commentsRequest.current;
    setComments((prev) => prev.filter((c) => c.id !== comment.id));
    adjustCommentCount(postId, (n) => n - 1);

    const result = await runAction(deleteComment(comment.id), "Comment deleted");
    if (!result) {
      // Only put it back if the drawer still shows the same post's comments
      if (requestId === commentsRequest.current) {
        setComments((prev) =>
          prev.some((c) => c.id === comment.id) ? prev : [...prev, comment].sort(newestFirst)
        );
      }
      adjustCommentCount(postId, (n) => n + 1);
    }
  }

  const newPostButton = (
    <Button asChild size="xs">
      <Link href="/admin/editor/new">
        <Plus size={14} />
        New post
      </Link>
    </Button>
  );

  return (
    <div>
      <PageHeader
        title="Posts"
        description="Write, edit and publish blog posts, and moderate the comments on each one."
        actions={newPostButton}
      />

      {posts.length > 0 && (
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center">
          <div className="relative md:w-72">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              aria-hidden="true"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, slug or category"
              aria-label="Search posts"
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

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Filter by category"
            className={cn(adminInputClass, "md:w-44 dark:scheme-dark")}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-3">
            <Segmented
              value={status}
              onChange={setStatus}
              options={[
                { value: "all", label: "All" },
                { value: "published", label: `Published (${publishedCount})` },
                { value: "draft", label: `Drafts (${draftCount})` },
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
        {posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No posts yet"
            description="Posts you write appear here. Drafts stay private until you publish them."
            action={newPostButton}
          />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No posts match these filters"
            description="Try another search term, category or status."
            action={
              <Button variant="outline" size="xs" onClick={clearFilters}>
                Clear filters
              </Button>
            }
          />
        ) : (
          <>
            <div className={adminTable.wrapper}>
              <table className={adminTable.table}>
                <thead>
                  <tr>
                    <th scope="col" className={adminTable.th}>
                      Title
                    </th>
                    <th scope="col" className={adminTable.th}>
                      Status
                    </th>
                    <th scope="col" className={cn(adminTable.th, "hidden lg:table-cell")}>
                      Date
                    </th>
                    <th scope="col" className={cn(adminTable.th, "hidden text-right sm:table-cell")}>
                      Views
                    </th>
                    <th scope="col" className={cn(adminTable.th, "hidden text-right sm:table-cell")}>
                      Comments
                    </th>
                    <th scope="col" className={cn(adminTable.th, "w-12 px-2")}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => {
                    const busy = busyPostIds.has(post.id);
                    const commentCount = post._count.comments;
                    return (
                      <tr key={post.id} className={adminTable.tr}>
                        <td className={cn(adminTable.td, "w-full min-w-36 max-w-0")}>
                          <Link
                            href={`/admin/editor/${post.id}`}
                            className="line-clamp-2 font-medium text-text-primary transition-colors hover:text-accent-blue-light"
                          >
                            {post.title}
                          </Link>
                          <div className="mt-0.5 flex min-w-0 items-center gap-1.5 text-xs text-text-muted">
                            <span className="truncate font-mono" title={`/blog/${post.slug}`}>
                              /blog/{post.slug}
                            </span>
                            {post.category && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="shrink-0 whitespace-nowrap">{post.category}</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className={adminTable.td}>
                          <StatusBadge status={post.published ? "published" : "draft"} />
                        </td>
                        <td className={cn(adminTable.td, "hidden whitespace-nowrap text-text-secondary lg:table-cell")}>
                          <time dateTime={new Date(post.createdAt).toISOString()} suppressHydrationWarning>
                            {format(new Date(post.createdAt), "MMM d, yyyy")}
                          </time>
                        </td>
                        <td
                          className={cn(
                            adminTable.td,
                            "hidden text-right tabular-nums text-text-secondary sm:table-cell"
                          )}
                        >
                          {numberFormat.format(post.views)}
                        </td>
                        <td className={cn(adminTable.td, "hidden text-right sm:table-cell")}>
                          <button
                            type="button"
                            onClick={() => openComments(post)}
                            aria-label={`${plural(commentCount, "comment")} on ${post.title}. Open comments`}
                            title="Open comments"
                            className="-mr-2 inline-flex h-7 items-center gap-1.5 rounded-md px-2 tabular-nums text-text-secondary transition-colors hover:bg-text-primary/5 hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/40"
                          >
                            <MessageSquare size={14} className="text-text-muted" aria-hidden="true" />
                            {numberFormat.format(commentCount)}
                          </button>
                        </td>
                        <td className={cn(adminTable.td, "px-2 text-right")}>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon-xs"
                                disabled={busy}
                                aria-label={`Actions for ${post.title}`}
                                title="Actions"
                                className="text-text-muted hover:text-text-primary"
                              >
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/editor/${post.id}`}>
                                  <Pencil className="text-text-muted" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              {post.published && (
                                <DropdownMenuItem asChild>
                                  <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="text-text-muted" />
                                    View live
                                  </a>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onSelect={() => handleTogglePublish(post)}>
                                {post.published ? (
                                  <>
                                    <EyeOff className="text-text-muted" />
                                    Unpublish
                                  </>
                                ) : (
                                  <>
                                    <Eye className="text-text-muted" />
                                    Publish
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onSelect={() => openComments(post)}>
                                <MessageSquare className="text-text-muted" />
                                Comments
                                <span className="ml-auto text-xs tabular-nums text-text-muted">
                                  {commentCount}
                                </span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem variant="destructive" onSelect={() => handleDeletePost(post)}>
                                <Trash2 />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border-glass px-4 py-2.5 text-xs text-text-muted">
              {filteredPosts.length === posts.length
                ? plural(posts.length, "post")
                : `Showing ${filteredPosts.length} of ${plural(posts.length, "post")}`}
            </div>
          </>
        )}
      </Panel>

      {/* Comments for one post */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="gap-0 border-border-glass bg-bg-card p-0 data-[side=right]:w-full data-[side=right]:sm:max-w-md"
        >
          <SheetHeader className="flex-row items-start gap-3 border-b border-border-glass px-4 py-3">
            <div className="min-w-0 flex-1">
              <SheetTitle className="line-clamp-2 text-sm font-semibold text-text-primary">
                {activePost?.title ?? "Comments"}
              </SheetTitle>
              <SheetDescription className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
                <span>{activePost ? plural(activePost._count.comments, "comment") : "Comments"}</span>
                {activePost?.published && (
                  <>
                    <span aria-hidden="true">·</span>
                    <a
                      href={`/blog/${activePost.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-text-muted transition-colors hover:text-accent-blue-light"
                    >
                      View post
                      <ExternalLink size={12} aria-hidden="true" />
                    </a>
                  </>
                )}
              </SheetDescription>
            </div>
            <SheetClose asChild>
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Close comments"
                title="Close"
                className="-mr-1 text-text-muted hover:text-text-primary"
              >
                <X size={16} />
              </Button>
            </SheetClose>
          </SheetHeader>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {commentsState === "loading" && (
              <div className="space-y-6 px-4 py-4" aria-busy="true">
                <span className="sr-only" role="status">
                  Loading comments
                </span>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                ))}
              </div>
            )}

            {commentsState === "error" && (
              <EmptyState
                title="Couldn't load comments"
                description={commentsError}
                action={
                  activePostId && (
                    <Button variant="outline" size="xs" onClick={() => loadComments(activePostId)}>
                      <RotateCw size={14} />
                      Try again
                    </Button>
                  )
                }
              />
            )}

            {commentsState === "ready" && comments.length === 0 && (
              <EmptyState
                icon={MessageSquare}
                title="No comments yet"
                description="Comments readers leave on this post will appear here."
              />
            )}

            {commentsState === "ready" && comments.length > 0 && activePostId && (
              <ul className="divide-y divide-border-glass">
                {comments.map((comment) => {
                  const busy = busyCommentIds.has(comment.id);
                  const created = new Date(comment.createdAt);
                  return (
                    <li key={comment.id} className="px-4 py-3.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-text-primary">
                            {comment.name || "Anonymous"}
                          </p>
                          {comment.email && (
                            <p className="truncate text-xs text-text-muted" title={comment.email}>
                              {comment.email}
                            </p>
                          )}
                        </div>
                        <StatusBadge status={comment.isHidden ? "hidden" : "visible"} />
                      </div>
                      <p
                        className={cn(
                          "mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed",
                          comment.isHidden ? "text-text-muted" : "text-text-secondary"
                        )}
                      >
                        {comment.content}
                      </p>
                      <div className="mt-2.5 flex items-center gap-1">
                        <time
                          dateTime={created.toISOString()}
                          title={format(created, "MMM d, yyyy 'at' h:mm a")}
                          className="mr-auto text-xs text-text-muted"
                        >
                          {formatDistanceToNow(created, { addSuffix: true })}
                        </time>
                        <Button
                          variant="outline"
                          size="xs"
                          disabled={busy}
                          onClick={() => handleToggleComment(comment)}
                          title={comment.isHidden ? "Show this comment on the blog" : "Hide this comment on the blog"}
                        >
                          {comment.isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                          {comment.isHidden ? "Show" : "Hide"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="xs"
                          disabled={busy}
                          onClick={() => handleDeleteComment(comment, activePostId)}
                          title="Delete this comment permanently"
                          className="text-red-600 hover:bg-red-500/10 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={14} />
                          Delete
                        </Button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
