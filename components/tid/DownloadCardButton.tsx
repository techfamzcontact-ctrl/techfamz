"use client";

import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DownloadCardButtonProps {
  elementId: string;
  fileName?: string;
}

export function DownloadCardButton({
  elementId,
  fileName = "techfamz-identity.png",
}: DownloadCardButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDownload = async () => {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error("Element not found for download");
      return;
    }

    try {
      setIsDownloading(true);
      const canvas = await html2canvas(element, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#060B18", // Match the dark background
        scale: 2, // Higher resolution
      });

      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error generating card image:", err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!mounted) return null;

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      className="flex items-center gap-2"
      variant="cta"
    >
      {isDownloading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Download className="w-4 h-4" />
      )}
      {isDownloading ? "Generating..." : "Download Card"}
    </Button>
  );
}
