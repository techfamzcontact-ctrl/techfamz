"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight, Shield, Fingerprint, Lock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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
      {/* LEFT PANEL - Marketing & Branding */}
      <div className="lg:w-[45%] lg:sticky lg:top-0 lg:h-screen bg-bg-secondary dark:bg-[#040810] border-r border-border-glass relative overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] flex flex-col justify-between p-8 md:p-12 lg:p-16 z-10">
        {/* Background Effects */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'radial-gradient(var(--color-border-glass) 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
        />
        <div className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-accent-blue opacity-10 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[500px] h-[500px] bg-indigo-500 opacity-[0.05] blur-[100px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10">


          <div className="animate-fade-in-up-delay-1">

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text-primary leading-[1.1] tracking-tight mb-6">
              Mint Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-indigo-400">
                Developer Passport.
              </span>
            </h1>
            <p className="text-lg text-text-secondary max-w-md leading-relaxed">
              Join the globally recognized registry of top-tier engineers. A cryptographically secure, verifiable identity that proves your stack and unlocks exclusive ecosystem access.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue-light text-xs font-semibold tracking-wider uppercase mb-6">
              <Fingerprint className="w-3.5 h-3.5" />
              Developer Registry
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0 animate-fade-in-up-delay-2 hidden md:block">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-bg-card border border-border-glass">
              <Shield className="w-6 h-6 text-accent-blue mb-3" />
              <h3 className="text-text-primary font-semibold text-sm mb-1">Verifiable Proof</h3>
              <p className="text-xs text-text-muted">A unique, non-guessable hash linking your identity to the Techfamz blockchain registry.</p>
            </div>
            <div className="p-5 rounded-2xl bg-bg-card border border-border-glass">
              <Lock className="w-6 h-6 text-accent-blue mb-3" />
              <h3 className="text-text-primary font-semibold text-sm mb-1">Privacy First</h3>
              <p className="text-xs text-text-muted">Your email remains hidden. Only your public developer profile is accessible via your TID.</p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - The Form Flow */}
      <div className="lg:w-[55%] bg-bg-primary min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-20 relative z-0">
        <div className="w-full max-w-[560px] animate-slide-up-1">
          
          <div className="mb-10 md:hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue-light text-xs font-semibold tracking-wider uppercase mb-4">
              <Fingerprint className="w-3.5 h-3.5" />
              Developer Registry
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-[1.1] tracking-tight">Mint Your Passport</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Section 1: Personal Details */}
            <div className="space-y-6">
              <div className="pb-4 border-b border-border-glass">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">1. Identity Verification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="fullName" className="text-text-secondary text-sm font-medium">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    placeholder="e.g. John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="email" className="text-text-secondary text-sm font-medium">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2.5">
                  <Label htmlFor="country" className="text-text-secondary text-sm font-medium">Country (Optional)</Label>
                  <Input
                    id="country"
                    placeholder="e.g. Nigeria"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="githubUrl" className="text-text-secondary text-sm font-medium">GitHub/Portfolio (Optional)</Label>
                  <Input
                    id="githubUrl"
                    placeholder="github.com/username"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Technical Profile */}
            <div className="space-y-6 pt-6">
              <div className="pb-4 border-b border-border-glass">
                <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">2. Technical Profile</h3>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="role" className="text-text-secondary text-sm font-medium">Primary Role *</Label>
                <div className="relative">
                  <select
                    id="role"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="flex h-12 w-full items-center justify-between rounded-xl border border-border-glass bg-bg-primary/30 px-4 py-2 text-[0.95rem] text-text-primary transition-all duration-200 outline-none placeholder:text-text-muted hover:border-border-glass-hover focus:border-accent-blue focus:ring-[3px] focus:ring-accent-blue-glow-soft appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select your primary discipline</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-text-secondary text-sm font-medium">Core Tech Stack (Max 5)</Label>
                  <span className="text-xs font-mono text-text-muted">{selectedSkills.length}/5</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COMMON_SKILLS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                          isSelected
                            ? "bg-accent-blue text-white border-accent-blue shadow-[0_0_15px_var(--color-accent-blue-glow-soft)]"
                            : "bg-bg-primary/30 text-text-secondary border-border-glass hover:border-accent-blue/50 hover:text-text-primary"
                        }`}
                      >
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Submission */}
            <div className="pt-8">
              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-[16px] font-bold group bg-white text-black hover:bg-gray-200 border-0 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting Registry Record...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Generate Developer ID
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </Button>
              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-accent-blue/5 border border-accent-blue/10">
                <Lock className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                <p className="text-[13px] text-text-muted leading-relaxed">
                  Your identity is cryptographically generated. By minting, you agree to the Techfamz Ecosystem Terms. We never share your email with third parties.
                </p>
              </div>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}
