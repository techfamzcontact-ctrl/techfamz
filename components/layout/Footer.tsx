import Link from "next/link";
import Image from "next/image";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary border-t border-border-glass pt-16 pb-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-16">
          {/* Brand section */}
          <div className="max-w-[360px]">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <Image src="/logo.png" alt="Techfamz logo" width={32} height={32} className="rounded-full object-contain shrink-0" />
              <span className="text-xl font-extrabold tracking-tight text-text-primary">
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
                className="w-10 h-10 rounded-lg border border-border-glass flex items-center justify-center text-text-muted transition-colors duration-150 hover:text-text-primary hover:border-border-glass-hover" 
                aria-label="Twitter / X"
              >
                <Twitter size={16} />
              </a>
              <a 
                href="https://linkedin.com/company/techfamz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg border border-border-glass flex items-center justify-center text-text-muted transition-colors duration-150 hover:text-[#0A66C2] hover:border-[#0A66C2]/40" 
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a 
                href="https://github.com/techfamz" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-lg border border-border-glass flex items-center justify-center text-text-muted transition-colors duration-150 hover:text-text-primary hover:border-border-glass-hover" 
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
                <Link href="/" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/identity" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
                  Developer TID
                </Link>
              </li>
              <li>
                <Link href="/identity/claim" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-1.5 font-medium">
                  Claim Passport <span className="text-[10px] uppercase font-bold text-accent-blue-light bg-accent-blue-glow-soft px-1.5 py-0.5 rounded">Live</span>
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
                  Articles & Insights
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
                  Tech Jobs
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
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
                <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-block">
                  About & Vision
                </Link>
              </li>
              <li>
                <a href="https://chat.whatsapp.com/KLihH50meiH8XxvjGsS1cf" target="_blank" rel="noopener noreferrer" className="text-sm text-text-secondary hover:text-[#1DA851] transition-colors inline-flex items-center gap-1.5">
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
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border-glass flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            © {currentYear} Techfamz Limited. Built for African tech excellence.
          </p>
          <div className="flex items-center gap-6">
            <a 
              href="mailto:contact@techfamz.com" 
              className="text-xs text-text-muted hover:text-text-primary transition-colors flex items-center gap-1.5"
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
