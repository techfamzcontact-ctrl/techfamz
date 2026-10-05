"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import bcrypt from "bcryptjs";
import { generateTID } from "@/lib/tid";
import { resend } from "@/lib/resend";
import { TIDWelcomeEmail } from "@/components/emails/TIDWelcomeEmail";

export async function getPosts() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      category: true,
      createdAt: true,
      views: true,
    },
  });
}

const DEFAULT_POST_CATEGORIES = [
  "Tutorial",
  "Tech News",
  "Tech Tips",
  "Opinion",
  "Case Study",
  "Engineering",
  "Daily Courses",
];

export async function getPostCategories(): Promise<string[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const posts = await prisma.post.findMany({
    where: { category: { not: null } },
    select: { category: true },
    distinct: ["category"],
  });

  const dbCategories = posts
    .map((p) => p.category?.trim())
    .filter((c): c is string => Boolean(c));

  const combined = Array.from(new Set([...DEFAULT_POST_CATEGORIES, ...dbCategories]));
  return combined.sort();
}

export async function togglePublishStatus(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.post.update({
    where: { id },
    data: { published: !currentStatus },
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function deletePost(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
}

export async function getPost(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (id === "new") return null;

  return await prisma.post.findUnique({
    where: { id },
  });
}

export async function savePost(data: {
  id: string;
  title: string;
  slug?: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  published: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const finalSlug = data.slug 
    ? slugify(data.slug, { lower: true, strict: true }) 
    : slugify(data.title, { lower: true, strict: true });

  let savedPost;

  if (data.id === "new") {
    savedPost = await prisma.post.create({
      data: {
        title: data.title,
        slug: finalSlug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        category: data.category || null,
        published: data.published,
        authorId: user.id,
      },
    });
  } else {
    savedPost = await prisma.post.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: finalSlug,
        content: data.content,
        excerpt: data.excerpt,
        coverImage: data.coverImage,
        category: data.category || null,
        published: data.published,
      },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  revalidatePath(`/blog/${finalSlug}`);

  return savedPost;
}

// ───────────────────────────────────────────
// Jobs CRUD
// ───────────────────────────────────────────

export async function getJobs() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      company: true,
      type: true,
      location: true,
      published: true,
      createdAt: true,
    },
  });
}

export async function getJob(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (id === "new") return null;

  return await prisma.job.findUnique({
    where: { id },
  });
}

export async function saveJob(data: {
  id: string;
  title: string;
  slug?: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  applyUrl: string;
  category: string;
  published: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const finalSlug = data.slug
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  // Normalize applyUrl: auto-prepend mailto: for email addresses
  const trimmedApply = data.applyUrl.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedApply);
  const finalApplyUrl = isEmail
    ? `mailto:${trimmedApply}`
    : trimmedApply.startsWith("http") || trimmedApply.startsWith("mailto:")
      ? trimmedApply
      : `https://${trimmedApply}`;

  let savedJob;

  if (data.id === "new") {
    savedJob = await prisma.job.create({
      data: {
        title: data.title,
        slug: finalSlug,
        company: data.company,
        location: data.location,
        type: data.type,
        salary: data.salary || null,
        description: data.description,
        applyUrl: finalApplyUrl,
        category: data.category || null,
        published: data.published,
        postedById: user.id,
      },
    });
  } else {
    savedJob = await prisma.job.update({
      where: { id: data.id },
      data: {
        title: data.title,
        slug: finalSlug,
        company: data.company,
        location: data.location,
        type: data.type,
        salary: data.salary || null,
        description: data.description,
        applyUrl: finalApplyUrl,
        category: data.category || null,
        published: data.published,
      },
    });
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${finalSlug}`);

  return savedJob;
}

export async function deleteJob(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.job.delete({
    where: { id },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
}

export async function toggleJobPublish(id: string, currentStatus: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.job.update({
    where: { id },
    data: { published: !currentStatus },
  });

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
}

// ───────────────────────────────────────────
// Comments Moderation
// ───────────────────────────────────────────

export async function getComments() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.comment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        select: { title: true, slug: true },
      },
    },
  });
}

export async function toggleCommentVisibility(id: string, currentHidden: boolean) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const comment = await prisma.comment.update({
    where: { id },
    data: { isHidden: !currentHidden },
    select: { post: { select: { slug: true } } },
  });

  revalidatePath("/admin/comments");
  revalidatePath(`/blog/${comment.post.slug}`);
}

export async function deleteComment(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const comment = await prisma.comment.delete({
    where: { id },
    select: { post: { select: { slug: true } } },
  });

  revalidatePath("/admin/comments");
  revalidatePath(`/blog/${comment.post.slug}`);
}

// ───────────────────────────────────────────
// Developers / TID Management
// ───────────────────────────────────────────

export async function getDevelopers() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  return await prisma.developer.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteDeveloper(id: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.developer.delete({
    where: { id },
  });

  revalidatePath("/admin/developers");
  revalidatePath("/admin");
}

export async function createDeveloperAdmin(data: {
  fullName: string;
  email: string;
  role: string;
  skills: string[];
  githubUrl?: string;
  country?: string;
  sendEmail?: boolean;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
    throw new Error("Full name is required (min 2 characters)");
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw new Error("A valid email address is required");
  }
  if (!data.role?.trim()) {
    throw new Error("Role is required");
  }

  const existing = await prisma.developer.findUnique({
    where: { email: data.email.trim().toLowerCase() },
  });
  if (existing) {
    throw new Error(`A developer with email "${data.email}" already exists with TID ${existing.tid}`);
  }

  let tid = generateTID();
  let attempts = 0;
  while (attempts < 10) {
    const collision = await prisma.developer.findUnique({ where: { tid } });
    if (!collision) break;
    tid = generateTID();
    attempts++;
  }

  const cleanSkills = Array.isArray(data.skills)
    ? data.skills.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
    : [];

  let cleanGithubUrl = data.githubUrl?.trim() || null;
  if (cleanGithubUrl && !cleanGithubUrl.startsWith("http")) {
    cleanGithubUrl = `https://${cleanGithubUrl}`;
  }

  const developer = await prisma.developer.create({
    data: {
      tid,
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role.trim(),
      skills: cleanSkills,
      githubUrl: cleanGithubUrl,
      country: data.country?.trim() || null,
    },
  });

  if (data.sendEmail && resend) {
    const baseUrl = process.env.NEXTAUTH_URL || "https://www.techfamz.com";
    resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Techfamz <no-reply@techfamz.com>",
      to: [developer.email],
      subject: `Welcome to Techfamz! Your TID: ${developer.tid}`,
      react: TIDWelcomeEmail({
        fullName: developer.fullName,
        tid: developer.tid,
        role: developer.role,
        skills: developer.skills,
        memberSince: developer.createdAt.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        }),
        verificationUrl: `${baseUrl}/tid/${developer.tid}`,
      }),
    }).catch((err) => {
      console.error("Failed to send TID welcome email:", err);
    });
  }

  revalidatePath("/admin/developers");
  revalidatePath("/admin");
  return developer;
}

export async function updateDeveloperAdmin(
  id: string,
  data: {
    fullName: string;
    email: string;
    role: string;
    skills: string[];
    githubUrl?: string;
    country?: string;
  }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
    throw new Error("Full name is required (min 2 characters)");
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    throw new Error("A valid email address is required");
  }
  if (!data.role?.trim()) {
    throw new Error("Role is required");
  }

  const existingDev = await prisma.developer.findUnique({
    where: { email: data.email.trim().toLowerCase() },
  });
  if (existingDev && existingDev.id !== id) {
    throw new Error(`Email "${data.email}" is already used by another developer (${existingDev.tid})`);
  }

  const cleanSkills = Array.isArray(data.skills)
    ? data.skills.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
    : [];

  let cleanGithubUrl = data.githubUrl?.trim() || null;
  if (cleanGithubUrl && !cleanGithubUrl.startsWith("http")) {
    cleanGithubUrl = `https://${cleanGithubUrl}`;
  }

  const updated = await prisma.developer.update({
    where: { id },
    data: {
      fullName: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role.trim(),
      skills: cleanSkills,
      githubUrl: cleanGithubUrl,
      country: data.country?.trim() || null,
    },
  });

  revalidatePath("/admin/developers");
  revalidatePath("/admin");
  revalidatePath(`/tid/${updated.tid}`);
  return updated;
}

// ───────────────────────────────────────────
// Settings & System Health Actions
// ───────────────────────────────────────────

export async function updateAdminPassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  if (!currentPassword) {
    throw new Error("Current password is required");
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new Error("User account not found");
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    throw new Error("Current password is incorrect");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { success: true };
}

export async function getSystemHealth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");

  const startDb = Date.now();
  let dbStatus: "connected" | "error" = "connected";
  let dbLatency = 0;
  let dbError: string | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbLatency = Date.now() - startDb;
  } catch (err) {
    dbStatus = "error";
    dbError = err instanceof Error ? err.message : "Database connection failed";
  }

  const resendConfigured = Boolean(process.env.RESEND_API_KEY);
  const cloudinaryConfigured = Boolean(
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
  const nextAuthConfigured = Boolean(process.env.NEXTAUTH_SECRET);

  const [usersCount, postsCount, jobsCount, developersCount, commentsCount] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.job.count(),
    prisma.developer.count(),
    prisma.comment.count(),
  ]);

  return {
    database: {
      status: dbStatus,
      latencyMs: dbLatency,
      error: dbError,
    },
    services: {
      resend: { configured: resendConfigured },
      cloudinary: { configured: cloudinaryConfigured },
      gemini: { configured: geminiConfigured },
      nextAuth: { configured: nextAuthConfigured },
    },
    counts: {
      users: usersCount,
      posts: postsCount,
      jobs: jobsCount,
      developers: developersCount,
      comments: commentsCount,
    },
    environment: process.env.NODE_ENV || "development",
  };
}

export async function getAdminSidebarMetrics() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { pendingComments: 0, draftPosts: 0, draftJobs: 0 };

  const [pendingComments, totalPosts, publishedPosts, totalJobs, publishedJobs] = await Promise.all([
    prisma.comment.count({ where: { isHidden: true } }),
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.job.count(),
    prisma.job.count({ where: { published: true } }),
  ]);

  return {
    pendingComments,
    draftPosts: totalPosts - publishedPosts,
    draftJobs: totalJobs - publishedJobs,
  };
}

