"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="text-text-muted" aria-label="Toggle theme">
        <Sun className="w-[18px] h-[18px]" />
      </Button>
    );
  }

  const isDark = theme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle theme"
      className="text-text-muted hover:text-text-primary transition-colors"
    >
      {isDark ? (
        <Sun className="w-[18px] h-[18px] transition-transform duration-300 hover:rotate-45" />
      ) : (
        <Moon className="w-[18px] h-[18px] transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}
