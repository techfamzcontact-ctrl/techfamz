import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { Suspense } from "react";
import { PostsListSkeleton } from "@/components/blog/PostCardSkeleton";
import { CategoryFilter } from "@/components/blog/CategoryFilter";

export const metadata: Metadata = {
  title: "Ecosystem Insights & Updates — Techfamz Blog",
  description: "Deep dives, tutorials, and updates from the network building the infrastructure for African tech talent.",
  openGraph: {
    title: "Ecosystem Insights & Updates — Techfamz Blog",
    description: "Deep dives, tutorials, and updates from the network building the infrastructure for African tech talent.",
    url: "https://www.techfamz.com/blog",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ecosystem Insights & Updates — Techfamz Blog",
    description: "Deep dives, tutorials, and updates from the network building the infrastructure for African tech talent.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "/blog",
  },
};

export const dynamic = "force-dynamic";

async function getPublishedPosts() {
  try {
    return await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        category: true,
        createdAt: true,
        author: {
          select: { email: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return null;
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true, category: { not: null } },
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return posts
      .map((p) => p.category)
      .filter((c): c is string => c !== null);
  } catch {
    return [];
  }
}

type PublishedPost = NonNullable<Awaited<ReturnType<typeof getPublishedPosts>>>[number];

function PostMeta({ post }: { post: PublishedPost }) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
      {post.category && (
        <>
          <span className="font-semibold text-accent-blue-light">{post.category}</span>
          <span aria-hidden="true">·</span>
        </>
      )}
      <time dateTime={post.createdAt.toISOString()}>
        {format(new Date(post.createdAt), "MMM d, yyyy")}
      </time>
    </div>
  );
}

function CoverImage({ post, sizes, priority }: { post: PublishedPost; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border-glass bg-bg-secondary">
      {post.coverImage ? (
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/logo.png" alt="Techfamz logo" width={48} height={48} className="object-contain opacity-30 grayscale" />
        </div>
      )}
    </div>
  );
}

async function PostsList({ category }: { category?: string }) {
  const posts = await getPublishedPosts();

  if (posts === null) {
    return (
      <div className="py-16 px-6 text-center border border-border-glass rounded-xl bg-bg-card">
        <h3 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h3>
        <p className="text-text-secondary mb-6">We couldn&apos;t load the blog posts right now. Please try again later.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
        >
          Retry
        </Link>
      </div>
    );
  }

  // Filter by category if specified
  const filteredPosts = category
    ? posts.filter((post) => post.category === category)
    : posts;

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-text-muted text-lg mb-4">
          {category ? `No articles found in "${category}".` : "No articles yet. Stay tuned!"}
        </p>
        {category && (
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 py-2.5 px-5 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
          >
            View All Articles
          </Link>
        )}
      </div>
    );
  }

  const [featured, ...rest] = filteredPosts;

  return (
    <>
      {/* Featured story: the newest post */}
      <Link
        href={`/blog/${featured.slug}`}
        className="group grid gap-6 md:grid-cols-[1.35fr_1fr] md:gap-10 md:items-center pb-12 mb-12 border-b border-border-glass"
      >
        <CoverImage post={featured} sizes="(min-width: 1024px) 640px, (min-width: 768px) 55vw, 100vw" priority />
        <div>
          <PostMeta post={featured} />
          <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-extrabold leading-[1.2] tracking-[-0.02em] text-text-primary mb-4 group-hover:text-accent-blue-light transition-colors">
            {featured.title}
          </h2>
          {featured.excerpt && (
            <p className="text-base md:text-lg text-text-secondary leading-relaxed line-clamp-3 mb-5">
              {featured.excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-blue-light">
            Read article
            <ArrowRight size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>

      {rest.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {rest.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col">
              <CoverImage post={post} sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" />
              <div className="pt-5">
                <PostMeta post={post} />
                <h2 className="text-lg font-bold leading-snug tracking-tight text-text-primary mb-2 group-hover:text-accent-blue-light transition-colors line-clamp-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const resolvedParams = await searchParams;
  const categories = await getCategories();

  return (
    <main className="min-h-screen pt-32 pb-24 bg-bg-primary">
      <div className="max-w-[1140px] mx-auto px-5 md:px-8">

        {/* Header */}
        <div className="mb-10 max-w-[720px]">
          <span className="eyebrow">
            Ecosystem Insights
          </span>
          <h1 className="text-[clamp(2.4rem,5vw,3.75rem)] font-extrabold leading-[1.08] tracking-[-0.03em] text-text-primary mb-4">
            The Techfamz <span className="text-accent-blue-light">Journal</span>
          </h1>
          <p className="text-base md:text-lg text-text-secondary leading-relaxed">
            Engineering perspectives, platform evolution, and architectural deep dives from the builders shaping African tech.
          </p>
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-12 pb-6 border-b border-border-glass">
            <Suspense>
              <CategoryFilter categories={categories} />
            </Suspense>
          </div>
        )}

        <Suspense fallback={<PostsListSkeleton />}>
          <PostsList category={resolvedParams.category} />
        </Suspense>

      </div>
    </main>
  );
}
