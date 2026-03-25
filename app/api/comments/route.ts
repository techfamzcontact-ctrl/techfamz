import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const postId = req.nextUrl.searchParams.get("postId");
  const isAdmin = req.nextUrl.searchParams.get("admin") === "1";

  if (!postId) {
    return NextResponse.json({ error: "postId is required" }, { status: 400 });
  }

  if (isAdmin) {
    // Admin: return ALL comments including hidden ones, with email
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        content: true,
        name: true,
        email: true,
        isHidden: true,
        createdAt: true,
      },
    });
    return NextResponse.json(comments);
  }

  // Public: only visible comments, no email
  const comments = await prisma.comment.findMany({
    where: { postId, isHidden: false },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      content: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json(comments);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, name, email, postId } = body;

    if (!content || !content.trim()) {
      return NextResponse.json(
        { error: "Comment content is required" },
        { status: 400 }
      );
    }

    if (!postId) {
      return NextResponse.json(
        { error: "postId is required" },
        { status: 400 }
      );
    }

    // Verify the post exists
    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        name: name?.trim() || "Anonymous",
        email: email?.trim() || null,
        postId,
      },
      select: {
        id: true,
        content: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to post comment" },
      { status: 500 }
    );
  }
}
