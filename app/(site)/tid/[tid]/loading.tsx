import React from "react";
import { ShieldCheck, Download, Copy, Twitter, Linkedin } from "lucide-react";

export default function LoadingTIDCard() {
  return (
    <main className="min-h-screen pt-24 pb-20 relative flex flex-col items-center justify-center overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-accent-blue opacity-5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500 opacity-[0.03] rounded-full blur-3xl pointer-events-none" />

      <div className="container max-w-4xl mx-auto px-4 relative z-10 flex flex-col items-center">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-bg-card border border-border-glass shadow-sm mb-6 opacity-70">
            <ShieldCheck className="w-5 h-5 text-text-muted" />
            <span className="text-sm font-semibold text-text-muted">Fetching Identity...</span>
          </div>
        </div>

        {/* Skeleton Card */}
        <div className="w-full max-w-lg mx-auto mb-10">
          <div className="relative w-full overflow-hidden rounded-2xl border border-border-glass bg-bg-primary/50  shadow-2xl animate-pulse">
            
            {/* Header */}
            <div className="p-6 md:p-8 flex items-start justify-between border-b border-border-glass/50 bg-gradient-to-r from-bg-card to-transparent">
              <div>
                <div className="h-4 w-32 bg-border-glass rounded mb-2"></div>
                <div className="h-8 w-48 bg-border-glass rounded"></div>
              </div>
              <div className="w-12 h-12 bg-border-glass rounded-xl"></div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8">
              <div className="mb-8">
                <div className="h-10 w-3/4 bg-border-glass rounded mb-3"></div>
                <div className="h-5 w-1/2 bg-border-glass rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-border-glass rounded"></div>
              </div>

              {/* Skills */}
              <div className="mb-8 flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-20 bg-border-glass rounded-full"></div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-end justify-between mt-auto">
                <div>
                  <div className="h-3 w-24 bg-border-glass rounded mb-2"></div>
                  <div className="h-4 w-32 bg-border-glass rounded"></div>
                </div>
                <div className="w-20 h-20 bg-border-glass rounded-xl transform rotate-[-2deg]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Skeleton Actions */}
        <div className="flex flex-col items-center gap-6 w-full max-w-lg opacity-50">
          <div className="h-12 w-48 bg-border-glass rounded-lg"></div>
          <div className="w-full h-px bg-gradient-to-r from-transparent via-border-glass to-transparent my-2" />
          <div className="flex flex-col items-center gap-3">
            <div className="h-4 w-32 bg-border-glass rounded mb-2"></div>
            <div className="flex gap-3">
              <div className="h-10 w-28 bg-border-glass rounded-lg"></div>
              <div className="h-10 w-28 bg-border-glass rounded-lg"></div>
              <div className="h-10 w-28 bg-border-glass rounded-lg"></div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
