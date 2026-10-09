import { prisma } from "@/lib/prisma";
import AnalyticsClient, { type AnalyticsData } from "./AnalyticsClient";

export const metadata = {
  title: "Analytics | Admin Dashboard",
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [developers, posts, comments, jobs] = await Promise.all([
    prisma.developer.findMany({
      select: { createdAt: true, role: true, country: true, skills: true, githubUrl: true },
    }),
    prisma.post.findMany({
      select: {
        title: true,
        slug: true,
        category: true,
        views: true,
        published: true,
        createdAt: true,
        _count: { select: { comments: true } },
      },
    }),
    prisma.comment.findMany({ select: { createdAt: true, isHidden: true } }),
    prisma.job.findMany({ select: { createdAt: true, published: true } }),
  ]);

  // Only plain, serialisable fields go to the client
  const data: AnalyticsData = {
    developers: developers.map((d) => ({
      createdAt: d.createdAt.toISOString(),
      role: d.role,
      country: d.country,
      skills: d.skills,
      hasGithub: Boolean(d.githubUrl),
    })),
    posts: posts.map((p) => ({
      title: p.title,
      slug: p.slug,
      category: p.category,
      views: p.views,
      published: p.published,
      createdAt: p.createdAt.toISOString(),
      comments: p._count.comments,
    })),
    comments: comments.map((c) => ({ createdAt: c.createdAt.toISOString(), isHidden: c.isHidden })),
    jobs: jobs.map((j) => ({ createdAt: j.createdAt.toISOString(), published: j.published })),
  };

  return <AnalyticsClient data={data} now={new Date().toISOString()} />;
}
