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

async function PostsList({ category }: { category?: string }) {
  const posts = await getPublishedPosts();

  if (posts === null) {
    return (
      <div className="text-center py-20 border border-red-500/20 rounded-2xl bg-[rgba(127,29,29,0.15)] backdrop-blur-md">
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredPosts.map((post) => (
        <Link 
          href={`/blog/${post.slug}`} 
          key={post.id}
          className="group flex flex-col bg-bg-card border border-border-glass rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-400 ease-premium hover:-translate-y-2 hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)] hover:border-border-glass-hover"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-[rgba(0,0,0,0.3)]">
            {post.coverImage ? (
              <Image 
                src={post.coverImage} 
                alt={post.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50">
                <Image src="/logo.png" alt="Techfamz logo" width={48} height={48} className="object-contain opacity-30 grayscale" />
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 p-6 md:p-8 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500 rounded-full" />
            
            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-accent-blue-light mb-4">
              {post.category && <span>{post.category}</span>}
              {post.category && <span className="w-1 h-1 rounded-full bg-border-glass" />}
              <time dateTime={post.createdAt.toISOString()}>
                {format(new Date(post.createdAt), "MMM d, yyyy")}
              </time>
            </div>
            
            <h2 className="text-lg md:text-2xl font-bold leading-[1.3] tracking-tight text-text-primary mb-6 group-hover:text-accent-blue-light transition-colors">
              {post.title}
            </h2>
            
            <div className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors mt-auto pt-4 border-t border-border-glass/50">
              Read Article
              <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      ))}
    </div>
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
    <main className="min-h-screen pt-32 pb-20" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 max-w-[800px] mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            Ecosystem Insights
          </span>
          <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-[800] leading-[1.1] tracking-[-0.02em] text-text-primary mb-6">
            The Techfamz <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">Blog</span>
          </h1>
          
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-12">
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
