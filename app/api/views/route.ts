import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    // Atomically increment the views count for this post.
    // Raw SQL on purpose: prisma.post.update() would also bump @updatedAt, and updatedAt
    // feeds dateModified (JSON-LD) and the sitemap lastmod, which must change only on real edits.
    const updated = await prisma.$executeRaw`UPDATE "Post" SET "views" = "views" + 1 WHERE "slug" = ${slug}`;

    if (updated === 0) {
      return NextResponse.json({ success: false }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Failed to increment view:", error);
    // Don't expose database errors to public clients for tracking routes
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
