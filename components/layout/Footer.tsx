"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-bg-primary overflow-hidden rounded-t-[32px] md:rounded-t-[48px] border-t border-l border-r border-border-glass pt-16 pb-8">
      {/* Decorative top gradient */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent-blue/50 to-transparent" />
      
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-accent-blue-glow opacity-10 blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand section */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="flex items-center justify-center w-[36px] h-[36px] rounded-full border-[1.5px] border-[rgba(255,255,255,0.9)] overflow-hidden bg-[rgba(255,255,255,0.05)] shrink-0 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Techfamz logo" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-text-primary">
                Techfamz
              </span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
              Empowering the next generation of tech talent with curated insights, career resources, and a supportive community.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-blue-light hover:border-accent-blue-glow hover:bg-accent-blue-glow-soft transition-all duration-300" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-blue-light hover:border-accent-blue-glow hover:bg-accent-blue-glow-soft transition-all duration-300" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-bg-card border border-border-glass flex items-center justify-center text-text-muted hover:text-accent-blue-light hover:border-accent-blue-glow hover:bg-accent-blue-glow-soft transition-all duration-300" aria-label="GitHub">
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Articles & Insights
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block relative">
                  Tech Jobs
                  <span className="absolute -top-1 -right-8 px-1.5 py-0.5 rounded text-[0.6rem] font-bold bg-accent-blue/10 text-accent-blue border border-accent-blue/20">NEW</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">Resources</h3>
            <ul className="space-y-4">
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Community Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-text-secondary hover:text-accent-blue-light transition-colors inline-block">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-1">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">Stay Updated</h3>
            <p className="text-sm text-text-secondary mb-4">
              Get the latest tech news, tutorials, and job openings delivered straight to your inbox.
            </p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full h-12 rounded-xl border border-border-glass bg-bg-primary/30 py-2 pl-4 pr-12 text-[0.95rem] text-text-primary transition-all duration-200 outline-none placeholder:text-text-muted hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-[3px] focus-visible:ring-accent-blue-glow-soft"
              />
              <button 
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg bg-accent-blue text-white hover:bg-blue-600 transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-glass/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[0.85rem] text-text-muted">
            © {currentYear} Techfamz Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[0.85rem] text-text-muted hover:text-text-primary transition-colors flex items-center gap-2">
              <Mail size={14} />
              contact@techfamz.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
