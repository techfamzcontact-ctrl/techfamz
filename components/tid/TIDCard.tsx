import React from "react";
import { QRCodeSVG } from "qrcode.react";

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
    month: "long",
    year: "numeric",
  });

  return (
    <div
      id="tid-card"
      className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl border border-accent-blue/40 bg-[#0A1428] shadow-[0_0_50px_var(--color-accent-blue-glow)]"
    >
      {/* Background accents */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-accent-blue opacity-15 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-[80px] pointer-events-none" />
      
      {/* SVG Noise filter since background images might fail in HTML2Canvas */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none z-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter>
          <rect width="100%" height="100%" filter="url(#n)" fill="transparent"/>
        </svg>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 md:p-8 flex items-start justify-between border-b border-accent-blue/10 bg-gradient-to-r from-black/20 to-transparent backdrop-blur-sm">
        <div>
          <h2 className="text-[10px] font-mono font-bold text-accent-blue uppercase tracking-[0.2em] mb-1">
            Techfamz Developer Identity
          </h2>
          <div className="font-mono text-2xl md:text-3xl font-bold text-white drop-shadow-[0_0_15px_rgba(96,165,250,0.6)] tracking-wider">
            {developer.tid}
          </div>
        </div>
        <div className="w-12 h-12 flex items-center justify-center bg-black/40 border border-accent-blue/20 rounded-xl shadow-inner backdrop-blur-md">
          <svg
            className="w-6 h-6 text-accent-blue drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      {/* Body */}
      <div className="relative z-10 p-6 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
            {developer.fullName}
          </h1>
          <p className="text-lg text-accent-blue-light flex items-center gap-2 font-medium">
            <span className="inline-flex relative w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
              <span className="relative inline-flex rounded-full w-2 h-2 bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
            </span>
            {developer.role}
          </p>
          {developer.country && (
            <p className="text-sm text-text-muted mt-1 font-mono uppercase tracking-wider">{developer.country}</p>
          )}
        </div>

        {/* Skills */}
        {developer.skills && developer.skills.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {developer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 text-xs font-mono font-medium text-text-secondary bg-black/40 border border-border-glass rounded-md backdrop-blur-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em] mb-1">
              Registry Date
            </p>
            <p className="text-sm font-semibold text-white tracking-wide">
              {memberSince}
            </p>
          </div>

          {/* QR Code */}
          <div className="bg-white p-2 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] border border-white/20">
            <QRCodeSVG
              value={verificationUrl}
              size={64}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
            />
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue to-transparent opacity-80 shadow-[0_0_15px_rgba(59,130,246,1)]" />
    </div>
  );
}
