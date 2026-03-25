import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Atomically increment the views count for this post
    await prisma.post.update({
      where: { slug },
      data: {
        views: {
          increment: 1,
        },
      },
      select: { id: true }, // Lightweight return
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to increment view:", error);
    // Don't expose database errors to public clients for tracking routes
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
