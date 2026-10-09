import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { TIDCard } from "@/components/tid/TIDCard";
import { DownloadCardButton } from "@/components/tid/DownloadCardButton";
import { ShareButtons } from "@/components/tid/ShareButtons";

async function getDeveloperData(tid: string) {
  const { prisma } = await import("@/lib/prisma");
  
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
    },
  });

  return developer;
}

export async function generateMetadata({ params }: { params: Promise<{ tid: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const developer = await getDeveloperData(resolvedParams.tid);

  if (!developer) return { title: "TID Not Found" };

  const title = `${developer.fullName} - Techfamz Identity (${developer.tid})`;
  const description = `Verify ${developer.fullName}'s Techfamz Developer Identity (${developer.role}). Join the ecosystem.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TIDVerificationPage({ params, searchParams }: { params: Promise<{ tid: string }>, searchParams: Promise<{ new?: string, existing?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const developer = await getDeveloperData(resolvedParams.tid);

  if (!developer) {
    notFound();
  }

  const baseUrl = process.env.NEXTAUTH_URL || "https://www.techfamz.com";
  const url = `${baseUrl}/tid/${developer.tid}`;
  
  const isNew = resolvedSearchParams.new === "true";
  const isExisting = resolvedSearchParams.existing === "true";

  return (
    <main className="min-h-screen bg-bg-primary pt-28 pb-20 flex flex-col items-center">
      <div className="container max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {/* Terminal Header */}
        <div className="w-full max-w-2xl mb-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 rounded-lg bg-bg-card border border-border-glass">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Techfamz Registry // Public Record</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-accent-blue" />
                ISSUED {new Date(developer.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isNew && (
          <div className="mb-8 w-full max-w-2xl px-6 py-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium text-center">
            🎉 Your TID has been created and added to the Techfamz registry. A welcome email with your details is on its way.
          </div>
        )}
        
        {isExisting && (
          <div className="mb-8 w-full max-w-2xl px-6 py-4 rounded-lg bg-accent-blue-glow-soft border border-accent-blue/20 text-accent-blue-light text-sm font-medium text-center">
            👋 Welcome back. This email already has a TID, so here is your existing passport.
          </div>
        )}

        {/* The Card on Pedestal */}
        <div className="w-full mb-12">
          <TIDCard developer={developer} baseUrl={baseUrl} />
        </div>

        {/* Control Panel */}
        <div className="w-full max-w-2xl bg-bg-card border border-border-glass rounded-xl p-6 md:p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-text-primary mb-1">Passport Control Panel</h3>
            <p className="text-sm text-text-secondary">Export your credentials or share your verification badge.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="w-full md:w-auto flex-1 max-w-[280px]">
              <DownloadCardButton elementId="tid-card" fileName={`${developer.tid}-passport.png`} />
            </div>
            
            <div className="hidden md:block w-px h-12 bg-border-glass mx-4" />
            <div className="md:hidden w-full h-px bg-border-glass my-2" />
            
            <div className="w-full md:w-auto flex flex-col items-center">
              <span className="text-xs font-mono text-text-muted mb-2.5 uppercase tracking-wider">Share Protocol</span>
              <ShareButtons url={url} tid={developer.tid} />
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
