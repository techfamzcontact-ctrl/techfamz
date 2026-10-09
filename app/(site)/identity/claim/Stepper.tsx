import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Wizard progress. Steps already reached can be clicked to go back;
 * later steps are disabled until the current one is valid.
 */
export function Stepper({
  steps,
  current,
  maxReached,
  onSelect,
}: {
  steps: readonly { title: string }[];
  current: number;
  maxReached: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav aria-label="Claim progress">
      {/* Compact version for small screens */}
      <div className="sm:hidden">
        <p className="mb-2 text-xs font-medium text-text-muted">
          Step {current + 1} of {steps.length} · <span className="text-text-primary">{steps[current].title}</span>
        </p>
        <div className="flex gap-1" aria-hidden="true">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn("h-1 flex-1 rounded-full", i <= current ? "bg-accent-blue" : "bg-border-glass-hover")}
            />
          ))}
        </div>
      </div>

      {/* Full version */}
      <ol className="hidden items-center sm:flex">
        {steps.map((step, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached;
          return (
            <li key={step.title} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
              <button
                type="button"
                onClick={() => onSelect(i)}
                disabled={!reachable || active}
                aria-current={active ? "step" : undefined}
                aria-label={`Step ${i + 1}: ${step.title}${done ? " (completed)" : ""}`}
                title={active ? undefined : step.title}
                className={cn(
                  "group flex items-center gap-2 rounded-md py-1 pr-1 text-left disabled:cursor-default",
                  reachable && !active && "cursor-pointer"
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                    active && "border-accent-blue bg-accent-blue text-white",
                    done && "border-accent-blue bg-accent-blue-glow-soft text-accent-blue-light",
                    !active && !done && "border-border-glass-hover text-text-muted"
                  )}
                >
                  {done ? <Check size={14} aria-hidden="true" /> : i + 1}
                </span>
                {/* Only the current step is named on screen; the button's aria-label names every step */}
                {active && (
                  <span className="whitespace-nowrap text-xs font-medium text-text-primary" aria-hidden="true">
                    {step.title}
                  </span>
                )}
              </button>
              {i < steps.length - 1 && (
                <div
                  className={cn("mx-3 h-px flex-1", i < current ? "bg-accent-blue" : "bg-border-glass-hover")}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
