import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ecosystem Insights & Updates — Techfamz Blog",
  description: "Deep dives, tutorials, and updates from the network building the infrastructure for African tech talent.",
};

// Server Component (RSC) to directly fetch published posts from DB
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

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="min-h-screen pt-32 pb-20" style={{ background: "var(--gradient-hero)" }}>
      <div className="max-w-[1200px] mx-auto px-5 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-[800px] mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-accent-blue-light mb-5 py-1.5 px-4 border border-accent-blue-glow rounded-full bg-accent-blue-glow-soft">
            Ecosystem Insights
          </span>
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-[800] leading-[1.1] tracking-[-0.02em] text-text-primary mb-6">
            The Techfamz <span className="bg-[linear-gradient(135deg,#60a5fa,#3b82f6,#93c5fd)] bg-clip-text text-transparent">Blog</span>
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-[600px] mx-auto">
            Deep dives, tutorials, and updates from the network building the infrastructure for African tech talent.
          </p>
        </div>

        {/* Error State */}
        {posts === null ? (
          <div className="text-center py-20 border border-red-500/20 rounded-2xl bg-[rgba(127,29,29,0.15)] backdrop-blur-md">
            <h3 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h3>
            <p className="text-text-secondary mb-6">We couldn&apos;t load the blog posts right now. Please try again later.</p>
            <Link 
              href="/blog" 
              className="inline-flex items-center gap-2 py-2.5 px-5 bg-accent-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 border border-border-glass rounded-2xl bg-bg-card backdrop-blur-md">
            <h3 className="text-xl font-semibold text-text-primary mb-2">No posts yet</h3>
            <p className="text-text-secondary">We&apos;re brewing some great content. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
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
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-text-muted opacity-30 text-4xl font-bold">T</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col flex-1 p-6 md:p-8 relative">
                  {/* Floating glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500 rounded-full" />
                  
                  <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-accent-blue-light mb-4">
                    {post.category && <span>{post.category}</span>}
                    {post.category && <span className="w-1 h-1 rounded-full bg-border-glass" />}
                    <time dateTime={post.createdAt.toISOString()}>
                      {format(post.createdAt, "MMM d, yyyy")}
                    </time>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-bold leading-[1.3] tracking-tight text-text-primary mb-3 group-hover:text-accent-blue-light transition-colors">
                    {post.title}
                  </h2>
                  
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-3 mb-6 flex-1">
                    {post.excerpt || "Read more about this topic..."}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors mt-auto pt-4 border-t border-border-glass/50">
                    Read Article
                    <ArrowRight size={16} className="transform transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
