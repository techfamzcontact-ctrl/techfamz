import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import sanitizeHtml from "sanitize-html";


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
  };
}

export default async function BlogPostPage({ params }: Props) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

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
        url: "https://techfamz.com",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      
      <main className="min-h-screen bg-[linear-gradient(180deg,#040810_0%,#0C1A3A_50%,#060B18_100%)] pt-24 pb-20">
        <article className="max-w-[800px] mx-auto px-5 md:px-8">
          
          <Link 
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-text-muted hover:text-accent-blue-light transition-colors mb-6 group"
          >
            <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
            Back to Blog
          </Link>

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
            
            <h1 className="text-[clamp(2.5rem,4vw,3.5rem)] font-[800] leading-[1.15] tracking-tight text-text-primary mb-4">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-lg md:text-xl text-text-secondary leading-relaxed border-l-2 border-accent-blue pl-4 py-1">
                {post.excerpt}
              </p>
            )}
          </header>

          {post.coverImage && (
            <div className="relative aspect-[16/9] w-full rounded-none overflow-hidden mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)] border border-border-glass">
              <Image 
                src={post.coverImage} 
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#040810] via-transparent to-transparent opacity-40" />
            </div>
          )}

          <div 
            className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-accent-blue-light hover:prose-a:text-accent-blue prose-img:rounded-none prose-img:border prose-img:border-border-glass prose-hr:border-border-glass [&_ul]:list-disc [&_ol]:list-decimal [&_ul]:pl-6 [&_ol]:pl-6 [&_li]:my-0.5 [&_li_p]:my-0 [&_ul]:my-2 [&_ol]:my-2 [&_p]:m-0 [&_p]:min-h-[1.5em]"
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

        </article>
      </main>
      <Footer />
    </>
  );
}
