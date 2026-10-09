"use client";

// Adapted from Animata Donut Chart (MIT): https://animata.design/docs/graphs/donut-chart
// Changes: theme-aware meter colours (fill = series blue, track = lighter step of the same
// ramp), an accessible label, and the animation respects prefers-reduced-motion via CSS.

import { type ReactNode, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface DonutChartProps {
  size: number;
  /** 0–100 */
  progress: number;
  /** Accessible description, e.g. "18 of 20 posts published (90%)" */
  label: string;
  trackClassName?: string;
  progressClassName?: string;
  circleWidth?: number;
  progressWidth?: number;
  rounded?: boolean;
  className?: string;
  children?: ReactNode;
}

export default function DonutChart({
  size,
  progress,
  label,
  progressClassName = "text-[#2a78d6] dark:text-[#3987e5]",
  trackClassName = "text-[#cde2fb] dark:text-[#184f95]",
  circleWidth = 10,
  progressWidth = 10,
  rounded = true,
  className,
  children,
}: DonutChartProps) {
  const [shouldUseValue, setShouldUseValue] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // This is a hack to force the animation to run for the first time.
      setShouldUseValue(true);
    }, 250);
    return () => clearTimeout(timeout);
  }, []);

  const clamped = Math.min(100, Math.max(0, progress));
  const radius = size / 2 - Math.max(progressWidth, circleWidth) / 2;
  const circumference = Math.PI * radius * 2;
  const offset = shouldUseValue ? circumference * ((100 - clamped) / 100) : circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        style={{ transform: "rotate(-90deg)" }}
        role="img"
        aria-label={label}
      >
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={`${circleWidth}px`}
          className={trackClassName}
        />
        <circle
          r={radius}
          cx={size / 2}
          cy={size / 2}
          stroke="currentColor"
          className={cn("transition-[stroke-dashoffset] duration-700 ease-out", progressClassName)}
          strokeWidth={`${progressWidth}px`}
          strokeLinecap={rounded && clamped > 0 ? "round" : "butt"}
          fill="transparent"
          strokeDasharray={`${circumference}px`}
          strokeDashoffset={`${offset}px`}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  );
}
