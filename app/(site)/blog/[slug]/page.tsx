import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { SharePost } from "@/components/blog/SharePost";
import CommentSection from "@/components/blog/CommentSection";
import ViewTracker from "@/components/blog/ViewTracker";


interface Props {
  params: Promise<{ slug: string }>;
}

async function getPostBySlug(slug: string) {
  try {
    return await prisma.post.findUnique({
      where: { slug },
    });
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}

async function getRelatedPosts(currentSlug: string, category: string | null) {
  try {
    // Try same-category posts first, fallback to latest posts
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        slug: { not: currentSlug },
        ...(category ? { category } : {}),
      },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        slug: true,
        coverImage: true,
        category: true,
        createdAt: true,
      },
    });

    // If no same-category posts, get latest from any category
    if (posts.length === 0 && category) {
      return await prisma.post.findMany({
        where: {
          published: true,
          slug: { not: currentSlug },
        },
        orderBy: { createdAt: "desc" },
        take: 3,
        select: {
          id: true,
          title: true,
          slug: true,
          coverImage: true,
          category: true,
          createdAt: true,
        },
      });
    }

    return posts;
  } catch {
    return [];
  }
}

/** Estimated reading time from the post HTML (~225 words per minute). */
function getReadingMinutes(html: string): number {
  const words = html.replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 225));
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.excerpt || "Read more on the Techfamz blog.",
    openGraph: {
      title: post.title,
      description: post.excerpt || "",
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      authors: ["Techfamz"],
      images: post.coverImage ? [post.coverImage] : previousImages,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "",
      images: post.coverImage ? [post.coverImage] : [],
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

import { Suspense } from "react";
import { PostDetailSkeleton } from "@/components/blog/PostCardSkeleton";

async function PostDetail({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);

  if (!post || !post.published) {
    notFound();
  }

  // Generate JSON-LD Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImage ? [post.coverImage] : [],
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: [
      {
        "@type": "Organization",
        name: "Techfamz",
        url: "https://www.techfamz.com",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className="max-w-[720px] mx-auto px-5 md:px-8">
        <ViewTracker slug={post.slug} />
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-10 flex-wrap" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-text-primary transition-colors font-medium">
            Blog
          </Link>
          {post.category && (
            <>
              <span className="text-border-glass">/</span>
              <Link 
                href={`/blog?category=${encodeURIComponent(post.category)}`} 
                className="hover:text-text-primary transition-colors font-medium"
              >
                {post.category}
              </Link>
            </>
          )}
          <span className="text-border-glass">/</span>
          <span className="text-text-muted truncate max-w-[200px]">{post.title}</span>
        </nav>

        <header className="mb-8">
          {post.category && (
            <span className="eyebrow">{post.category}</span>
          )}

          <h1 className="text-[clamp(2rem,4.5vw,3rem)] font-extrabold leading-[1.15] tracking-[-0.025em] text-text-primary mb-5">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-text-muted">
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, "MMMM d, yyyy")}
            </time>
            <span aria-hidden="true">·</span>
            <span>{getReadingMinutes(post.content)} min read</span>
          </div>
        </header>

        <SharePost title={post.title} path={`/blog/${post.slug}`} className="py-4 mb-8 border-y border-border-glass" />

        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden mb-10 border border-border-glass bg-bg-secondary">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 768px) 656px, 100vw"
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose article"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              transformTags: { h1: "h2" },
              allowedTags: [
                "h1","h2","h3","h4","h5","h6",
                "p","br","strong","em","u","s","del","mark","code","pre","blockquote","hr",
                "ul","ol","li",
                "a","img","iframe",
                "table","thead","tbody","tr","th","td",
                "div","span",
              ],
              allowedAttributes: {
                a: ["href", "target", "rel", "class"],
                img: ["src", "alt", "class", "width", "height"],
                iframe: ["src", "width", "height", "allowfullscreen", "allow", "frameborder", "title", "class", "style", "data-youtube-video"],
                "*": ["class", "style"],
              },
              allowedStyles: {
                "*": {
                  "text-align": [/^(left|right|center|justify)$/],
                },
              },
            }),
          }}
        />

        <SharePost title={post.title} path={`/blog/${post.slug}`} className="mt-12 py-4 border-y border-border-glass" />

        <CommentSection postId={post.id} />
      </article>
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen pt-28 pb-24 bg-bg-primary">
      <Suspense fallback={<PostDetailSkeleton />}>
        <PostDetail slug={resolvedParams.slug} />
      </Suspense>
      <Suspense>
        <RelatedPosts slug={resolvedParams.slug} />
      </Suspense>
    </main>
  );
}

async function RelatedPosts({ slug }: { slug: string }) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const related = await getRelatedPosts(slug, post.category);
  if (related.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-5 md:px-8 mt-20 pt-12 border-t border-border-glass">
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        {post.category ? `More in ${post.category}` : "More Articles"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((relatedPost) => (
          <Link
            key={relatedPost.id}
            href={`/blog/${relatedPost.slug}`}
            className="group flex flex-col bg-bg-card border border-border-glass rounded-xl overflow-hidden transition-colors duration-150 hover:border-border-glass-hover"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-bg-secondary">
              {relatedPost.coverImage ? (
                <Image
                  src={relatedPost.coverImage}
                  alt={relatedPost.title}
                  fill
                  sizes="(min-width: 768px) 340px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image src="/logo.png" alt="Techfamz" width={36} height={36} className="object-contain opacity-30 grayscale" />
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-text-muted mb-2">
                {relatedPost.category && <span className="font-semibold text-accent-blue-light">{relatedPost.category}</span>}
                {relatedPost.category && <span aria-hidden="true">·</span>}
                <time dateTime={relatedPost.createdAt.toISOString()}>
                  {format(new Date(relatedPost.createdAt), "MMM d, yyyy")}
                </time>
              </div>
              <h3 className="text-base font-bold text-text-primary leading-snug group-hover:text-accent-blue-light transition-colors line-clamp-2">
                {relatedPost.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
