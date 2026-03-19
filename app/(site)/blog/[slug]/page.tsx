import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";
import { SharePost } from "@/components/blog/SharePost";


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

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return { title: "Post Not Found | Techfamz" };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.title} | Techfamz`,
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
      canonical: `https://www.techfamz.com/blog/${resolvedParams.slug}`,
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
      
      <article className="max-w-[800px] mx-auto px-5 md:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-8 flex-wrap" aria-label="Breadcrumb">
          <Link href="/blog" className="hover:text-accent-blue-light transition-colors font-medium">
            Blog
          </Link>
          {post.category && (
            <>
              <span className="text-border-glass">/</span>
              <Link 
                href={`/blog?category=${encodeURIComponent(post.category)}`} 
                className="hover:text-accent-blue-light transition-colors font-medium"
              >
                {post.category}
              </Link>
            </>
          )}
          <span className="text-border-glass">/</span>
          <span className="text-text-secondary truncate max-w-[200px]">{post.title}</span>
        </nav>

        <header className="mb-8">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-wider text-accent-blue-light mb-3">
            {post.category && (
              <>
                <span>{post.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-border-glass" />
              </>
            )}
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, "MMMM d, yyyy")}
            </time>
          </div>
          
          <h1 className="text-[clamp(1.25rem,4vw,3.5rem)] font-[800] leading-[1.15] tracking-tight text-text-primary mb-4">
            {post.title}
          </h1>
          
          {post.excerpt && (
            <p className="text-sm md:text-base text-text-secondary leading-relaxed border-l-2 border-accent-blue pl-4 py-1">
              {post.excerpt}
            </p>
          )}
        </header>

        <SharePost title={post.title} path={`/blog/${post.slug}`} className="pb-4 mb-4 border-b border-border-glass" />

        {post.coverImage && (
          <div className="relative aspect-[16/9] w-full rounded-none overflow-hidden mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-border-glass">
            <Image 
              src={post.coverImage} 
              alt={post.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        <div 
          className="prose dark:prose-invert prose-base md:prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent-blue-light hover:prose-a:text-accent-blue prose-img:rounded-none prose-img:border prose-img:border-border-glass prose-hr:border-border-glass [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_p]:m-0 [&_p]:min-h-[1.5em]"
          dangerouslySetInnerHTML={{
            __html: sanitizeHtml(post.content, {
              allowedTags: [
                "h1","h2","h3","h4","h5","h6",
                "p","br","strong","em","u","s","del","mark","code","pre","blockquote","hr",
                "ul","ol","li",
                "a","img",
                "table","thead","tbody","tr","th","td",
                "div","span",
              ],
              allowedAttributes: {
                a: ["href", "target", "rel", "class"],
                img: ["src", "alt", "class", "width", "height"],
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

        <SharePost title={post.title} path={`/blog/${post.slug}`} />

      </article>
    </>
  );
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen pt-24 pb-20" style={{ background: "var(--gradient-hero)" }}>
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
    <section className="max-w-[1200px] mx-auto px-5 md:px-8 mt-16 pt-12 border-t border-border-glass/50">
      <h2 className="text-2xl font-bold text-text-primary mb-8">
        {post.category ? `More in ${post.category}` : "More Articles"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((relatedPost) => (
          <Link
            key={relatedPost.id}
            href={`/blog/${relatedPost.slug}`}
            className="group flex flex-col bg-bg-card border border-border-glass rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:border-border-glass-hover"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[rgba(0,0,0,0.3)]">
              {relatedPost.coverImage ? (
                <Image
                  src={relatedPost.coverImage}
                  alt={relatedPost.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/50">
                  <Image src="/logo.png" alt="Techfamz" width={36} height={36} className="object-contain opacity-30 grayscale" />
                </div>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-blue-light mb-3">
                {relatedPost.category && <span>{relatedPost.category}</span>}
                {relatedPost.category && <span className="w-1 h-1 rounded-full bg-border-glass" />}
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
