"use client";

// Adapted from Animata Counter (MIT): https://animata.design/docs/text/counter
// Changes: honours prefers-reduced-motion, exposes the final value to screen readers
// (the animated digits are aria-hidden), and defaults to the admin's type styles.

import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface CounterProps {
  /**
   * A function to format the counter value. By default, it will format the
   * number with commas.
   */
  format?: (value: number) => string;

  /**
   * The target value of the counter.
   */
  targetValue: number;

  /**
   * The direction of the counter. If "up", the counter will start from 0 and
   * go up to the target value. If "down", the counter will start from the target
   * value and go down to 0.
   */
  direction?: "up" | "down";

  /**
   * The delay in milliseconds before the counter starts counting.
   */
  delay?: number;

  /**
   * Additional classes for the counter.
   */
  className?: string;
}

export const Formatter = {
  number: (value: number) => Intl.NumberFormat("en-US").format(+value.toFixed(0)),
  compact: (value: number) =>
    Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(+value.toFixed(0)),
};

export default function Counter({
  format = Formatter.number,
  targetValue = 1000,
  direction = "up",
  delay = 0,
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const isGoingUp = direction === "up";
  const finalValue = isGoingUp ? targetValue : 0;
  const motionValue = useMotionValue(isGoingUp ? 0 : targetValue);

  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 80,
  });
  const isInView = useInView(ref, { margin: "0px", once: true });

  useEffect(() => {
    if (!isInView) {
      return;
    }

    if (reduceMotion) {
      // No animation: show the final value straight away
      if (ref.current) ref.current.textContent = format(finalValue);
      return;
    }

    const timer = setTimeout(() => {
      motionValue.set(finalValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [isInView, delay, finalValue, motionValue, reduceMotion, format]);

  useMotionValueEvent(springValue, "change", (value) => {
    if (ref.current && !reduceMotion) {
      ref.current.textContent = format(value);
    }
  });

  const initialDisplay = format(isGoingUp ? 0 : targetValue);

  return (
    <span className={cn("tabular-nums", className)}>
      <span ref={ref} aria-hidden="true">
        {initialDisplay}
      </span>
      <span className="sr-only">{format(finalValue)}</span>
    </span>
  );
}
