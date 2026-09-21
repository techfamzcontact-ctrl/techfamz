import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShieldCheck, Server, Lock, Activity, Download } from "lucide-react";
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

  if (!developer) return { title: "TID Not Found | Techfamz" };

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
    <main className="min-h-screen bg-bg-primary pt-24 pb-20 relative flex flex-col items-center overflow-hidden font-sans">
      
      {/* Terminal Background */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(var(--color-border-glass) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-glass) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      <div className="absolute top-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-40 z-0" />
      <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[800px] h-[400px] bg-accent-blue opacity-[0.06] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="container max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Terminal Header */}
        <div className="w-full max-w-2xl mb-10 animate-fade-in-up-delay-1">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-bg-card/80 border border-border-glass backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-mono text-text-muted uppercase tracking-widest">Techfamz Registry // Authenticated</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono text-text-muted">
              <div className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-accent-blue" /> SECURE</div>
              <div className="flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-accent-blue" /> NODE: TX-9</div>
              <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-emerald-500" /> ONLINE</div>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        {isNew && (
          <div className="mb-8 w-full max-w-2xl px-6 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-medium animate-slide-up-1 text-center shadow-md">
            🎉 Identity successfully minted! Your digital passport has been securely registered. We&apos;ve sent the credentials to your email.
          </div>
        )}
        
        {isExisting && (
          <div className="mb-8 w-full max-w-2xl px-6 py-4 rounded-2xl bg-accent-blue/10 border border-accent-blue/20 text-accent-blue-light text-sm font-medium animate-slide-up-1 text-center">
            👋 Welcome back. Your developer identity is verified and recognized across the ecosystem.
          </div>
        )}

        {/* The Card on Pedestal */}
        <div className="w-full animate-slide-up-1 mb-12 relative perspective-1000">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] bg-accent-blue opacity-15 blur-[90px] pointer-events-none rounded-full" />
          <TIDCard developer={developer} baseUrl={baseUrl} />
        </div>

        {/* Control Panel */}
        <div className="w-full max-w-2xl bg-bg-card border border-border-glass rounded-3xl p-6 md:p-8 shadow-xl shadow-black/10 animate-slide-up-2 backdrop-blur-md">
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
