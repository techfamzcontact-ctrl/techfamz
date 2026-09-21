"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Shield, Fingerprint, Lock, Sparkles, Cpu, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ROLES = [
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

const COMMON_SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular",
  "Node.js", "Python", "Go", "Rust", "Java", "Swift", "Flutter",
  "Docker", "AWS", "PostgreSQL", "MongoDB", "GraphQL", "TailwindCSS"
];

export default function ClaimTIDPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    githubUrl: "",
    country: "",
  });
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/tid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, skills: selectedSkills }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate TID");
      }

      if (data.existing) {
        router.push(`/tid/${data.developer.tid}?existing=true`);
      } else {
        router.push(`/tid/${data.developer.tid}?new=true`);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-bg-primary flex flex-col lg:flex-row relative">
      {/* LEFT PANEL - Live Holographic Passport Card Preview */}
      <div className="lg:w-[48%] lg:sticky lg:top-0 lg:h-screen bg-bg-secondary border-r border-border-glass relative overflow-y-auto overflow-x-hidden p-6 md:p-10 lg:p-14 flex flex-col justify-between z-10">
        {/* Subtle grid background */}
        <div 
          className="absolute inset-0 z-0 opacity-15 pointer-events-none" 
          style={{ backgroundImage: 'radial-gradient(var(--color-border-glass) 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-accent-blue/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue-light text-xs font-semibold tracking-wider uppercase mb-5">
            <Fingerprint className="w-3.5 h-3.5" />
            Developer Registry
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-text-primary leading-[1.08] tracking-tight mb-4">
            Mint Your <span className="text-gradient-blue">Developer Passport</span>
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-md leading-relaxed mb-8">
            Your permanent, cryptographically verified identity in the African tech ecosystem. Preview your card in real-time as you complete your profile.
          </p>

          {/* LIVE VIRTUAL PASSPORT CARD */}
          <div className="w-full max-w-md mx-auto my-4 relative group">
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-accent-blue/30 via-amber-400/20 to-accent-blue-light/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            <div className="relative rounded-3xl border border-accent-blue/40 bg-gradient-to-b from-[#0B1528] via-[#070D1B] to-[#040812] text-white p-6 shadow-2xl overflow-hidden">
              {/* Circuit dots */}
              <div 
                className="absolute inset-0 z-0 opacity-15 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(rgba(96, 165, 250, 0.4) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
              />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-400/30 to-amber-600/30 border border-amber-400/40 flex items-center justify-center">
                    <Cpu size={15} className="text-amber-300" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-accent-blue-light font-bold">
                      Techfamz Verified ID
                    </span>
                    <span className="text-[10px] font-mono text-white/50">LIVE PREVIEW</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-accent-blue/20 border border-accent-blue/40 text-[10px] font-mono text-accent-blue-light font-bold">
                  <Sparkles size={11} />
                  <span>ACTIVE MINT</span>
                </div>
              </div>

              {/* ID Number */}
              <div className="relative z-10 mb-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">Assigned Hash</span>
                <span className="font-mono text-xl md:text-2xl font-black text-gradient-blue tracking-wider">
                  TID-TF-LIVE
                </span>
              </div>

              {/* Live Full Name & Role */}
              <div className="relative z-10 mb-5">
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
                  {formData.fullName.trim() || "Your Name Here"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-accent-blue-light font-medium mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{formData.role || "Primary Engineering Role"}</span>
                  {formData.country && (
                    <>
                      <span className="text-white/30">•</span>
                      <span className="text-white/70 uppercase">{formData.country}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Selected Skills Chips */}
              <div className="relative z-10 mb-4">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block mb-1.5">
                  Verified Skills ({selectedSkills.length}/5)
                </span>
                <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                  {selectedSkills.length > 0 ? (
                    selectedSkills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/10 border border-white/15 text-white">
                        {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-[11px] font-mono text-white/40 italic">
                      Select up to 5 skills below...
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Bar */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-white/50">
                <span>AFRICAN DEVELOPER REGISTRY</span>
                <span className="text-amber-400 font-bold">SECURE ENCLAVE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="relative z-10 pt-8 mt-6 border-t border-border-glass hidden md:grid grid-cols-2 gap-4">
          <div className="p-3.5 rounded-2xl bg-bg-card/70 border border-border-glass backdrop-blur-sm">
            <Shield className="w-5 h-5 text-accent-blue mb-1.5" />
            <h4 className="text-xs font-bold text-text-primary mb-0.5">Verifiable Hash</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">Cryptographic validation on the Techfamz registry.</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-bg-card/70 border border-border-glass backdrop-blur-sm">
            <Lock className="w-5 h-5 text-accent-blue mb-1.5" />
            <h4 className="text-xs font-bold text-text-primary mb-0.5">Privacy Guard</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">Your email is encrypted and never exposed publicly.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Form Flow */}
      <div className="lg:w-[52%] bg-bg-primary min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-16 relative z-0">
        <div className="w-full max-w-[560px] animate-slide-up-1">
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
              Developer Profile
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Complete your information to generate and claim your unique passport.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-5">
              <div className="pb-3 border-b border-border-glass flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">1. Identity Verification</h3>
                <span className="text-[11px] font-mono text-text-muted">Required fields *</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-text-primary text-xs font-semibold">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="e.g. Chinua Achebe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-primary text-xs font-semibold">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-text-primary text-xs font-semibold">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g. Ghana, Kenya, Nigeria"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-text-primary text-xs font-semibold">GitHub / Portfolio</Label>
                  <Input
                    id="githubUrl"
                    placeholder="github.com/yourhandle"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Technical Profile */}
            <div className="space-y-5 pt-4">
              <div className="pb-3 border-b border-border-glass flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">2. Technical Track</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-text-primary text-xs font-semibold">Primary Engineering Role *</Label>
                <div className="relative">
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-border-glass bg-bg-card px-4 py-2 text-sm text-text-primary transition-all duration-200 outline-none hover:border-border-glass-hover focus:border-accent-blue focus:ring-[3px] focus:ring-accent-blue-glow-soft appearance-none cursor-pointer shadow-xs"
                  >
                    <option value="" disabled>Select your primary discipline</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-text-primary text-xs font-semibold">Core Stack (Select up to 5)</Label>
                  <span className="text-xs font-mono font-bold text-accent-blue-light">{selectedSkills.length}/5 Selected</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 border ${
                          isSelected
                            ? "bg-accent-blue text-white border-accent-blue shadow-md shadow-accent-blue/20 scale-[1.02]"
                            : "bg-bg-card text-text-secondary border-border-glass hover:border-accent-blue/50 hover:text-text-primary"
                        }`}
                      >
                        {isSelected && <CheckCircle2 size={12} className="inline mr-1 -mt-0.5" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="pt-6">
              <Button 
                type="submit" 
                variant="cta"
                size="lg"
                className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-amber-500/20 transition-all duration-300 hover:scale-[1.01]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting Registry Record...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Mint Your Developer Passport
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              <div className="mt-5 flex items-start gap-3 p-4 rounded-2xl bg-accent-blue/5 border border-accent-blue/10">
                <Lock className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Your identity is cryptographically minted. Once issued, your TID is permanently linked to your profile and can be verified across all Techfamz partner platforms.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
