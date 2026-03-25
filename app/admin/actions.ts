"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

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
