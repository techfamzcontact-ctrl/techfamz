"use client";

import { Twitter,X, Linkedin, Facebook, Link as LinkIcon, Check } from "lucide-react";
import { useState, useEffect } from "react";

interface SharePostProps {
  title: string;
  slug: string;
  className?: string;
}

export function SharePost({ title, slug, className }: SharePostProps) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  if (!url) return null; // Wait for hydration

  return (
    <div className={`flex items-center gap-3 border-border-glass ${className || "py-4 mt-6 border-t"}`}>
      <span className="text-sm font-semibold text-text-muted uppercase tracking-wider">Share this post:</span>
      <div className="flex items-center gap-2">
        <a 
          href={shareLinks.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-bg-card border border-border-glass text-text-secondary hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors flex items-center justify-center w-[36px] h-[36px]"
          title="Share on X"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-[18px] h-[18px] fill-current">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 22.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
          </svg>
        </a>
        <a 
          href={shareLinks.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-bg-card border border-border-glass text-text-secondary hover:text-[#0A66C2] hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/10 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin size={18} />
        </a>
        <a 
          href={shareLinks.facebook} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full bg-bg-card border border-border-glass text-text-secondary hover:text-[#1877F2] hover:border-[#1877F2]/30 hover:bg-[#1877F2]/10 transition-colors"
          title="Share on Facebook"
        >
          <Facebook size={18} />
        </a>
        <button 
          onClick={copyToClipboard}
          className="p-2 rounded-full bg-bg-card border border-border-glass text-text-secondary hover:text-accent-blue hover:border-accent-blue/30 hover:bg-accent-blue/10 transition-colors ml-2"
          title="Copy Link"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <LinkIcon size={18} />}
        </button>
      </div>
    </div>
  );
}
