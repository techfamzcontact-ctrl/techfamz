"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    setSubscribed(true);
    setEmail("");
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer className="relative bg-bg-primary overflow-hidden rounded-t-[32px] md:rounded-t-[48px] border-t border-border-glass pt-16 pb-12">
      {/* Decorative top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
      
      {/* Subtle background ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-accent-blue-glow opacity-10 blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5 group">
              <div className="flex items-center justify-center w-[36px] h-[36px] rounded-xl border border-accent-blue/30 bg-accent-blue/10 overflow-hidden shrink-0 transition-transform group-hover:scale-105 shadow-xs">
                <Image src="/logo.png" alt="Techfamz logo" width={28} height={28} className="object-contain" />
              </div>
              <span className="text-xl font-black tracking-tight text-text-primary">
                Tech<span className="text-accent-blue-light">famz</span>
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Engineering the unified digital infrastructure for African tech talent, verified developer identity, and company collaboration.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://twitter.com/techfamz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-white hover:border-accent-blue hover:bg-accent-blue-glow-soft transition-all duration-300" 
                aria-label="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://linkedin.com/company/techfamz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-[#0A66C2] hover:border-[#0A66C2]/40 hover:bg-[#0A66C2]/10 transition-all duration-300" 
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com/techfamz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-blue-light hover:border-accent-blue hover:bg-accent-blue-glow-soft transition-all duration-300" 
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">Platform</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/identity" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Developer TID
                </Link>
              </li>
              <li>
                <Link href="/identity/claim" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-flex items-center gap-1.5 font-medium">
                  Claim Passport <span className="text-[10px] uppercase font-bold text-accent-blue-light bg-accent-blue-glow-soft border border-accent-blue-glow px-1.5 py-0.5 rounded-full">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Articles & Insights
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Partner With Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Ecosystem */}
          <div>
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">Ecosystem</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  About & Vision
                </Link>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/KLihH50meiH8XxvjGsS1cf" target="_blank" rel="noopener noreferrer" className="text-sm text-[#25D366] hover:underline transition-colors inline-flex items-center gap-1.5 font-medium">
                  WhatsApp Community
                </a>
              </li>
              <li>
                <Link href="/admin/login" className="text-sm text-text-muted hover:text-text-primary transition-colors inline-block">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-5">Stay Updated</h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Curated tech breakthroughs, African ecosystem insights, and hiring signals delivered straight to your inbox.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium animate-slide-up-1">
                <CheckCircle2 size={16} className="shrink-0" />
                <span>You are subscribed! Welcome to Techfamz.</span>
              </div>
            ) : (
              <form className="relative group" onSubmit={handleSubscribe}>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com" 
                  required
                  className="w-full h-12 rounded-xl border border-border-glass bg-bg-card/70 py-2 pl-4 pr-12 text-sm text-text-primary transition-all duration-200 outline-none placeholder:text-text-muted hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-[3px] focus-visible:ring-accent-blue-glow-soft shadow-xs"
                />
                <button 
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg bg-accent-blue text-white hover:bg-blue-600 transition-colors shadow-sm"
                  aria-label="Subscribe"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-glass flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} Techfamz Limited. Built for African tech excellence.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="mailto:contact@techfamz.com" 
              className="text-xs text-text-muted hover:text-accent-blue-light transition-colors flex items-center gap-1.5"
            >
              <Mail size={14} />
              contact@techfamz.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
