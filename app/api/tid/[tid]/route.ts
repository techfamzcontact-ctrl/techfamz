import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { isValidTID } from "@/lib/tid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ tid: string }> }
) {
  try {
    const { tid } = await params;

    if (!tid || !isValidTID(tid.toUpperCase())) {
      return NextResponse.json({ error: "Invalid TID format." }, { status: 400 });
    }

    const developer = await prisma.developer.findUnique({
      where: { tid: tid.toUpperCase() },
      select: {
        tid: true,
        fullName: true,
        role: true,
        skills: true,
        githubUrl: true,
        country: true,
        createdAt: true,
        // Deliberately exclude email for privacy
      },
    });

    if (!developer) {
      return NextResponse.json({ error: "TID not found." }, { status: 404 });
    }

    return NextResponse.json({ developer });
  } catch (error) {
    console.error("TID Lookup Error:", error);
    return NextResponse.json(
      { error: "Failed to look up TID." },
      { status: 500 }
    );
  }
}
