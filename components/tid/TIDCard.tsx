import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Cpu, Sparkles } from "lucide-react";

interface TIDCardProps {
  developer: {
    tid: string;
    fullName: string;
    role: string;
    skills: string[];
    country: string | null;
    createdAt: Date | string;
  };
  baseUrl: string;
}

export function TIDCard({ developer, baseUrl }: TIDCardProps) {
  const verificationUrl = `${baseUrl}/tid/${developer.tid}`;
  const memberSince = new Date(developer.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div
      id="tid-card"
      className="relative w-full max-w-lg mx-auto overflow-hidden rounded-3xl border border-accent-blue/40 bg-gradient-to-b from-[#0B1528] via-[#070D1B] to-[#040812] text-white shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all duration-300"
    >
      {/* Metallic Circuit Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(rgba(96, 165, 250, 0.4) 1px, transparent 1px)', 
          backgroundSize: '18px 18px' 
        }} 
      />
      
      {/* Corner Ambient Glows */}
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-accent-blue/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top Header */}
      <div className="relative z-10 px-7 pt-7 pb-5 flex items-center justify-between border-b border-white/10 bg-white/[0.02] backdrop-blur-md">
        <div className="flex items-center gap-3">
          {/* Microchip Graphic */}
          <div className="w-10 h-8 rounded-lg bg-gradient-to-br from-amber-400/30 via-amber-200/20 to-amber-600/30 border border-amber-400/40 flex items-center justify-center shadow-xs">
            <Cpu size={18} className="text-amber-300" />
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-accent-blue-light font-bold">
              Techfamz Verified Passport
            </span>
            <span className="font-mono text-xs text-white/60 tracking-wider">
              AFRICA TALENT REGISTRY
            </span>
          </div>
        </div>

        {/* Security / Verified Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/15 border border-accent-blue/40 text-[11px] font-mono text-accent-blue-light font-bold tracking-wider">
          <ShieldCheck size={14} className="text-accent-blue-light" />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="relative z-10 px-7 py-7">
        {/* TID Hash Identifier */}
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
            Identity Hash
          </span>
          <div className="font-mono text-2xl md:text-3xl font-black text-white tracking-widest text-gradient-blue inline-block">
            {developer.tid}
          </div>
        </div>

        {/* Developer Name & Role */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight mb-1.5">
            {developer.fullName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-accent-blue-light font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span>{developer.role}</span>
            {developer.country && (
              <>
                <span className="text-white/30">•</span>
                <span className="text-xs text-white/70 font-mono uppercase tracking-wide">
                  {developer.country}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Skills Stack Chips */}
        {developer.skills && developer.skills.length > 0 && (
          <div className="mb-7">
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-2">
              Verified Stack
            </span>
            <div className="flex flex-wrap gap-1.5">
              {developer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono font-semibold text-white/90 bg-white/[0.06] border border-white/10 rounded-lg backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card Footer: Metadata + QR */}
        <div className="flex items-end justify-between pt-5 border-t border-white/10">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-white/50 block mb-1">
              Member Since
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {memberSince}
            </span>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-amber-400/80 font-mono">
              <Sparkles size={11} />
              <span>Immutable Ledger Record</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-black/40 border border-white/20">
            <QRCodeSVG
              value={verificationUrl}
              size={64}
              level="M"
              bgColor="#ffffff"
              fgColor="#0a1428"
            />
          </div>
        </div>
      </div>

      {/* Holographic Bottom Edge Accent */}
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-gradient-to-r from-accent-blue via-amber-400 to-accent-blue-light opacity-90 shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
    </div>
  );
}
