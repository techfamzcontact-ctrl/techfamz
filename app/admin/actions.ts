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

/**
 * Result of a mutating server action.
 *
 * Mutations return errors instead of throwing them: in production builds Next.js
 * replaces the message of an Error thrown in a server action with a generic one,
 * so thrown messages never reach the admin UI.
 */
export type ActionResult<T = null> = { ok: true; data: T } | { ok: false; error: string };

const SESSION_EXPIRED = "Your session has expired. Please sign in again.";

function isUniqueViolation(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: string }).code === "P2002";
}

async function hasAdminSession(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return Boolean(session?.user);
}

async function getAdminUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.user.findUnique({ where: { email: session.user.email } });
}

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
      _count: { select: { comments: true } },
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

export async function togglePublishStatus(id: string, currentStatus: boolean): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  try {
    await prisma.post.update({
      where: { id },
      data: { published: !currentStatus },
    });
  } catch (err) {
    console.error("togglePublishStatus failed:", err);
    return { ok: false, error: "Couldn't change the post's status. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { ok: true, data: null };
}

export async function deletePost(id: string): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  try {
    await prisma.post.delete({
      where: { id },
    });
  } catch (err) {
    console.error("deletePost failed:", err);
    return { ok: false, error: "Couldn't delete the post. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  return { ok: true, data: null };
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
}): Promise<ActionResult<{ id: string; slug: string }>> {
  const user = await getAdminUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  if (!data.title?.trim()) {
    return { ok: false, error: "Title is required before saving." };
  }

  const finalSlug = data.slug
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  if (!finalSlug) {
    return { ok: false, error: "The URL slug is empty. Use letters or numbers in the title or slug." };
  }

  let savedPost;

  try {
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
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: `Another post already uses the URL /blog/${finalSlug}. Change the title or the slug and save again.`,
      };
    }
    console.error("savePost failed:", err);
    return { ok: false, error: "Couldn't save the post. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/blog");
  revalidatePath(`/blog/${finalSlug}`);

  return { ok: true, data: { id: savedPost.id, slug: savedPost.slug } };
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
}): Promise<ActionResult<{ id: string; slug: string }>> {
  const user = await getAdminUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  const missing = [
    ["title", data.title],
    ["company", data.company],
    ["location", data.location],
    ["job type", data.type],
    ["apply link or email", data.applyUrl],
  ]
    .filter(([, value]) => !value?.trim())
    .map(([label]) => label);
  if (missing.length > 0) {
    return { ok: false, error: `Please fill in: ${missing.join(", ")}.` };
  }

  const finalSlug = data.slug
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  if (!finalSlug) {
    return { ok: false, error: "The URL slug is empty. Use letters or numbers in the title or slug." };
  }

  // Normalize applyUrl: auto-prepend mailto: for email addresses
  const trimmedApply = data.applyUrl.trim();
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedApply);
  const finalApplyUrl = isEmail
    ? `mailto:${trimmedApply}`
    : trimmedApply.startsWith("http") || trimmedApply.startsWith("mailto:")
      ? trimmedApply
      : `https://${trimmedApply}`;

  let savedJob;

  try {
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
  } catch (err) {
    if (isUniqueViolation(err)) {
      return {
        ok: false,
        error: `Another job already uses the URL /jobs/${finalSlug}. Change the title or the slug and save again.`,
      };
    }
    console.error("saveJob failed:", err);
    return { ok: false, error: "Couldn't save the job. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  revalidatePath(`/jobs/${finalSlug}`);

  return { ok: true, data: { id: savedJob.id, slug: savedJob.slug } };
}

export async function deleteJob(id: string): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  try {
    await prisma.job.delete({
      where: { id },
    });
  } catch (err) {
    console.error("deleteJob failed:", err);
    return { ok: false, error: "Couldn't delete the job. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  return { ok: true, data: null };
}

export async function toggleJobPublish(id: string, currentStatus: boolean): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  try {
    await prisma.job.update({
      where: { id },
      data: { published: !currentStatus },
    });
  } catch (err) {
    console.error("toggleJobPublish failed:", err);
    return { ok: false, error: "Couldn't change the job's status. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  return { ok: true, data: null };
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

export async function toggleCommentVisibility(id: string, currentHidden: boolean): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  let slug: string;
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { isHidden: !currentHidden },
      select: { post: { select: { slug: true } } },
    });
    slug = comment.post.slug;
  } catch (err) {
    console.error("toggleCommentVisibility failed:", err);
    return { ok: false, error: "Couldn't update the comment. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/comments");
  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${slug}`);
  return { ok: true, data: null };
}

export async function deleteComment(id: string): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  let slug: string;
  try {
    const comment = await prisma.comment.delete({
      where: { id },
      select: { post: { select: { slug: true } } },
    });
    slug = comment.post.slug;
  } catch (err) {
    console.error("deleteComment failed:", err);
    return { ok: false, error: "Couldn't delete the comment. Please try again." };
  }

  revalidatePath("/admin");
  revalidatePath("/admin/comments");
  revalidatePath("/admin/posts");
  revalidatePath(`/blog/${slug}`);
  return { ok: true, data: null };
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

export async function deleteDeveloper(id: string): Promise<ActionResult> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  try {
    await prisma.developer.delete({
      where: { id },
    });
  } catch (err) {
    console.error("deleteDeveloper failed:", err);
    return { ok: false, error: "Couldn't delete the developer. Please try again." };
  }

  revalidatePath("/admin/developers");
  revalidatePath("/admin");
  return { ok: true, data: null };
}

type DeveloperInput = {
  fullName: string;
  email: string;
  role: string;
  skills: string[];
  githubUrl?: string;
  country?: string;
};

function validateDeveloperInput(data: DeveloperInput): string | null {
  if (!data.fullName?.trim() || data.fullName.trim().length < 2) {
    return "Full name is required (at least 2 characters).";
  }
  if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    return "A valid email address is required.";
  }
  if (!data.role?.trim()) {
    return "Role is required.";
  }
  return null;
}

function normalizeDeveloperInput(data: DeveloperInput) {
  const cleanSkills = Array.isArray(data.skills)
    ? data.skills.filter((s) => typeof s === "string" && s.trim()).map((s) => s.trim())
    : [];

  let cleanGithubUrl = data.githubUrl?.trim() || null;
  if (cleanGithubUrl && !cleanGithubUrl.startsWith("http")) {
    cleanGithubUrl = `https://${cleanGithubUrl}`;
  }

  return {
    fullName: data.fullName.trim(),
    email: data.email.trim().toLowerCase(),
    role: data.role.trim(),
    skills: cleanSkills,
    githubUrl: cleanGithubUrl,
    country: data.country?.trim() || null,
  };
}

export async function createDeveloperAdmin(
  data: DeveloperInput & { sendEmail?: boolean }
): Promise<ActionResult<Awaited<ReturnType<typeof prisma.developer.create>>>> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  const invalid = validateDeveloperInput(data);
  if (invalid) return { ok: false, error: invalid };

  const clean = normalizeDeveloperInput(data);

  const existing = await prisma.developer.findUnique({
    where: { email: clean.email },
  });
  if (existing) {
    return { ok: false, error: `${clean.email} already has a TID (${existing.tid}).` };
  }

  let tid = generateTID();
  let attempts = 0;
  while (attempts < 10) {
    const collision = await prisma.developer.findUnique({ where: { tid } });
    if (!collision) break;
    tid = generateTID();
    attempts++;
  }

  let developer;
  try {
    developer = await prisma.developer.create({
      data: { tid, ...clean },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, error: `${clean.email} already has a TID.` };
    }
    console.error("createDeveloperAdmin failed:", err);
    return { ok: false, error: "Couldn't create the developer. Please try again." };
  }

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
  return { ok: true, data: developer };
}

export async function updateDeveloperAdmin(
  id: string,
  data: DeveloperInput
): Promise<ActionResult<Awaited<ReturnType<typeof prisma.developer.update>>>> {
  if (!(await hasAdminSession())) return { ok: false, error: SESSION_EXPIRED };

  const invalid = validateDeveloperInput(data);
  if (invalid) return { ok: false, error: invalid };

  const clean = normalizeDeveloperInput(data);

  const existingDev = await prisma.developer.findUnique({
    where: { email: clean.email },
  });
  if (existingDev && existingDev.id !== id) {
    return { ok: false, error: `${clean.email} is already used by another developer (${existingDev.tid}).` };
  }

  let updated;
  try {
    updated = await prisma.developer.update({
      where: { id },
      data: clean,
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { ok: false, error: `${clean.email} is already used by another developer.` };
    }
    console.error("updateDeveloperAdmin failed:", err);
    return { ok: false, error: "Couldn't save the developer. Please try again." };
  }

  revalidatePath("/admin/developers");
  revalidatePath("/admin");
  revalidatePath(`/tid/${updated.tid}`);
  return { ok: true, data: updated };
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
}): Promise<ActionResult> {
  const user = await getAdminUser();
  if (!user) return { ok: false, error: SESSION_EXPIRED };

  if (!currentPassword) {
    return { ok: false, error: "Current password is required." };
  }

  if (!newPassword || newPassword.length < 8) {
    return { ok: false, error: "New password must be at least 8 characters long." };
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);
  if (!isValid) {
    return { ok: false, error: "Current password is incorrect." };
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
  } catch (err) {
    console.error("updateAdminPassword failed:", err);
    return { ok: false, error: "Couldn't update the password. Please try again." };
  }

  return { ok: true, data: null };
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

  // When the database is down, report zero counts instead of crashing the settings page,
  // so the "unreachable" status above can actually be shown.
  const [usersCount, postsCount, jobsCount, developersCount, commentsCount] =
    dbStatus === "connected"
      ? await Promise.all([
          prisma.user.count(),
          prisma.post.count(),
          prisma.job.count(),
          prisma.developer.count(),
          prisma.comment.count(),
        ]).catch(() => [0, 0, 0, 0, 0])
      : [0, 0, 0, 0, 0];

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
  if (!session?.user) return { hiddenComments: 0, draftPosts: 0, draftJobs: 0 };

  const [hiddenComments, draftPosts, draftJobs] = await Promise.all([
    prisma.comment.count({ where: { isHidden: true } }),
    prisma.post.count({ where: { published: false } }),
    prisma.job.count({ where: { published: false } }),
  ]);

  return { hiddenComments, draftPosts, draftJobs };
}
