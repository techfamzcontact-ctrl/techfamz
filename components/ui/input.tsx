import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-border-glass bg-bg-primary/30 px-4 py-2 text-[0.95rem] text-text-primary transition-all duration-200 outline-none file:inline-flex file:h-12 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-muted hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-[3px] focus-visible:ring-accent-blue-glow-soft disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
