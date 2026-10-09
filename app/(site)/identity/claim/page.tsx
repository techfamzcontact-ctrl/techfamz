"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Shield, Fingerprint, Lock, Cpu, CheckCircle2 } from "lucide-react";
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
      <div className="lg:w-[48%] lg:sticky lg:top-0 lg:h-screen bg-bg-secondary border-r border-border-glass relative overflow-y-auto overflow-x-hidden px-6 pb-10 pt-24 md:px-10 lg:px-14 lg:pt-28 flex flex-col justify-between z-10">

        <div className="relative z-10">
          <div className="eyebrow flex items-center gap-2 mb-4">
            <Fingerprint className="w-3.5 h-3.5" />
            Developer Registry
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary leading-[1.08] tracking-[-0.03em] mb-4">
            Mint Your <span className="text-accent-blue-light">Developer Passport</span>
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-md leading-relaxed mb-8">
            Your permanent developer identity in the African tech ecosystem, with a public page anyone can check. Preview your card in real time as you complete your profile.
          </p>

          {/* LIVE VIRTUAL PASSPORT CARD */}
          <div className="w-full max-w-md mx-auto my-4">
            <div className="relative rounded-xl border border-white/10 bg-brand-navy text-white p-6 shadow-lg overflow-hidden">

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-7 rounded-md bg-cta-yellow/20 border border-cta-yellow/40 flex items-center justify-center">
                    <Cpu size={15} className="text-cta-yellow" />
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[#60a5fa] font-bold">
                      Techfamz Developer ID
                    </span>
                    <span className="text-[10px] font-mono text-white/50">LIVE PREVIEW</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-white/10 text-[10px] font-mono text-[#93c5fd] font-bold">
                  <span>DRAFT</span>
                </div>
              </div>

              {/* ID Number */}
              <div className="relative z-10 mb-5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/40 block">TID Number · assigned when you submit</span>
                <span className="font-mono text-xl md:text-2xl font-bold text-[#60a5fa] tracking-wider">
                  TF•••••••
                </span>
              </div>

              {/* Live Full Name & Role */}
              <div className="relative z-10 mb-5">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                  {formData.fullName.trim() || "Your Name Here"}
                </h3>
                <div className="flex items-center gap-2 text-xs text-[#93c5fd] font-medium mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
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
                  Skills ({selectedSkills.length}/5)
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
                <span className="text-cta-yellow font-bold">TECHFAMZ.COM/TID</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security badges */}
        <div className="relative z-10 pt-8 mt-6 border-t border-border-glass hidden md:grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-bg-card border border-border-glass">
            <Shield className="w-5 h-5 text-accent-blue mb-1.5" />
            <h4 className="text-xs font-bold text-text-primary mb-0.5">Public Verification</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">Anyone can confirm your TID on its public Techfamz page.</p>
          </div>
          <div className="p-4 rounded-lg bg-bg-card border border-border-glass">
            <Lock className="w-5 h-5 text-accent-blue mb-1.5" />
            <h4 className="text-xs font-bold text-text-primary mb-0.5">Private Email</h4>
            <p className="text-[11px] text-text-muted leading-relaxed">Your email is never shown on your public profile.</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Form Flow */}
      <div className="lg:w-[52%] bg-bg-primary min-h-screen flex items-center justify-center px-6 py-12 md:px-12 lg:px-16 lg:pt-28 relative z-0">
        <div className="w-full max-w-[560px]">
          
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-text-primary tracking-tight">
              Developer Profile
            </h2>
            <p className="text-sm text-text-secondary mt-1">
              Complete your information to generate and claim your unique passport.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-5">
              <div className="pb-3 border-b border-border-glass flex items-center justify-between">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">1. Personal Details</h3>
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
                    className="rounded-lg"
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
                    className="rounded-lg"
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
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="githubUrl" className="text-text-primary text-xs font-semibold">GitHub / Portfolio</Label>
                  <Input
                    id="githubUrl"
                    placeholder="github.com/yourhandle"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="rounded-lg"
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
                    className="flex h-11 w-full items-center justify-between rounded-lg border border-border-glass bg-bg-card px-4 py-2 text-sm text-text-primary transition-colors duration-150 outline-none hover:border-border-glass-hover focus:border-accent-blue focus:ring-[3px] focus:ring-accent-blue-glow-soft appearance-none cursor-pointer"
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
                        aria-pressed={isSelected}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors duration-150 border ${
                          isSelected
                            ? "bg-accent-blue text-white border-accent-blue"
                            : "bg-bg-card text-text-secondary border-border-glass hover:border-border-glass-hover hover:text-text-primary"
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
                className="group w-full text-base"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating your TID...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Mint Your Developer Passport
                    <ArrowRight className="w-5 h-5 transition-transform duration-150 group-hover:translate-x-0.5" />
                  </span>
                )}
              </Button>
              <div className="mt-5 flex items-start gap-3 p-4 rounded-lg bg-bg-secondary border border-border-glass">
                <Lock className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                <p className="text-xs text-text-muted leading-relaxed">
                  Once issued, your TID is permanently linked to your profile. Anyone can confirm it on your public Techfamz page or by scanning the QR code on your card.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
