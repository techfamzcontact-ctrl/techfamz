"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Twitter, Linkedin } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  tid: string;
}

export function ShareButtons({ url, tid }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  const shareText = `I just claimed my Techfamz Identity! TID: ${tid} 🚀 Connect with me on Africa's fastest-growing developer ecosystem.`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareText
  )}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    url
  )}`;

  if (!mounted) return null;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="outline-glow"
        onClick={handleCopy}
        className="flex items-center gap-2"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied!" : "Copy Link"}
      </Button>
      <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline-glow" className="flex items-center gap-2">
          <Twitter className="w-4 h-4" />
          Twitter
        </Button>
      </a>
      <a href={linkedinUrl} target="_blank" rel="noopener noreferrer">
        <Button variant="outline-glow" className="flex items-center gap-2">
          <Linkedin className="w-4 h-4" />
          LinkedIn
        </Button>
      </a>
    </div>
  );
}
