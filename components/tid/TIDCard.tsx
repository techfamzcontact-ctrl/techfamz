import React from "react";
import { QRCodeSVG } from "qrcode.react";
import { ShieldCheck, Cpu } from "lucide-react";

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

// Colours here are plain hex/rgba on purpose: the PNG download uses html2canvas,
// which cannot parse the color-mix()/oklab() output of Tailwind opacity modifiers.
export function TIDCard({ developer, baseUrl }: TIDCardProps) {
  const verificationUrl = `${baseUrl}/tid/${developer.tid}`;
  const memberSince = new Date(developer.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <div
      id="tid-card"
      className="relative w-full max-w-lg mx-auto overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[#0f1a31] text-white shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]"
    >
      {/* Top Header */}
      <div className="px-7 pt-7 pb-5 flex items-center justify-between border-b border-[rgba(255,255,255,0.1)]">
        <div className="flex items-center gap-3">
          {/* Microchip Graphic */}
          <div className="w-10 h-8 rounded-md bg-[rgba(240,180,41,0.18)] border border-[rgba(240,180,41,0.45)] flex items-center justify-center">
            <Cpu size={18} className="text-[#f0b429]" />
          </div>
          <div>
            <span className="block text-[10px] font-mono uppercase tracking-[0.25em] text-[#60a5fa] font-bold">
              Techfamz Verified Passport
            </span>
            <span className="font-mono text-xs text-[#9aa4b8] tracking-wider">
              AFRICA TALENT REGISTRY
            </span>
          </div>
        </div>

        {/* Security / Verified Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[rgba(96,165,250,0.14)] text-[11px] font-mono text-[#93c5fd] font-bold tracking-wider">
          <ShieldCheck size={14} />
          <span>VERIFIED</span>
        </div>
      </div>

      {/* Main Card Body */}
      <div className="px-7 py-7">
        {/* TID Number */}
        <div className="mb-6">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b95a7] block mb-1">
            TID Number
          </span>
          <div className="font-mono text-2xl md:text-3xl font-bold tracking-widest text-[#60a5fa]">
            {developer.tid}
          </div>
        </div>

        {/* Developer Name & Role */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight mb-1.5">
            {developer.fullName}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[#93c5fd] font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#34d399]" />
            <span>{developer.role}</span>
            {developer.country && (
              <>
                <span className="text-[#5b6577]">•</span>
                <span className="text-xs text-[#c3cad6] font-mono uppercase tracking-wide">
                  {developer.country}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Skills Stack Chips */}
        {developer.skills && developer.skills.length > 0 && (
          <div className="mb-7">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b95a7] block mb-2">
              Skills
            </span>
            <div className="flex flex-wrap gap-1.5">
              {developer.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs font-mono font-semibold text-[#e5e7eb] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-md"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Card Footer: Metadata + QR */}
        <div className="flex items-end justify-between pt-5 border-t border-[rgba(255,255,255,0.1)]">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8b95a7] block mb-1">
              Member Since
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wider">
              {memberSince}
            </span>
            <div className="mt-2 text-[10px] text-[#f0b429] font-mono">
              <span>Scan the QR code to verify</span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG
              value={verificationUrl}
              size={64}
              level="M"
              bgColor="#ffffff"
              fgColor="#0f1a31"
            />
          </div>
        </div>
      </div>

      {/* Brand edge: bulb gold */}
      <div className="absolute bottom-0 inset-x-0 h-[3px] bg-[#f0b429]" />
    </div>
  );
}
