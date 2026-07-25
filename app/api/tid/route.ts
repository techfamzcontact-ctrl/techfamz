import { prisma } from "@/lib/prisma";
import { generateTID } from "@/lib/tid";
import { resend } from "@/lib/resend";
import { NextRequest, NextResponse } from "next/server";
import { TIDWelcomeEmail } from "@/components/emails/TIDWelcomeEmail";

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT) return true;

  entry.count++;
  return false;
}

const VALID_ROLES = [
  "Frontend Engineer",
  "Backend Engineer",
  "Full-Stack Developer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "UI/UX Designer",
  "Cloud Engineer",
  "Cybersecurity Specialist",
  "AI/ML Engineer",
  "Other",
];

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { fullName, email, role, skills, githubUrl, country } = body;

    // Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Full name is required (min 2 characters)." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!role || !VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Please select a valid role." }, { status: 400 });
    }

    // Check for existing developer with this email
    const existing = await prisma.developer.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (existing) {
      return NextResponse.json({
        developer: existing,
        existing: true,
        message: "You already have a Techfamz Identity!",
      });
    }

    // Generate unique TID
    let tid: string;
    let attempts = 0;
    do {
      tid = generateTID();
      const collision = await prisma.developer.findUnique({ where: { tid } });
      if (!collision) break;
      attempts++;
    } while (attempts < 10);

    if (attempts >= 10) {
      return NextResponse.json({ error: "Failed to generate unique TID. Please try again." }, { status: 500 });
    }

    // Normalize and validate skills
    const cleanSkills = Array.isArray(skills)
      ? skills.filter((s: unknown) => typeof s === "string" && s.trim()).map((s: string) => s.trim()).slice(0, 5)
      : [];

    // Normalize githubUrl
    let cleanGithubUrl = githubUrl?.trim() || null;
    if (cleanGithubUrl && !cleanGithubUrl.startsWith("http")) {
      cleanGithubUrl = `https://${cleanGithubUrl}`;
    }

    // Create developer
    const developer = await prisma.developer.create({
      data: {
        tid,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        role,
        skills: cleanSkills,
        githubUrl: cleanGithubUrl,
        country: country?.trim() || null,
      },
    });

    // Send welcome email (fire-and-forget — don't block the response)
    if (resend) {
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

    return NextResponse.json({ developer, existing: false }, { status: 201 });
  } catch (error) {
    console.error("TID Generation Error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
