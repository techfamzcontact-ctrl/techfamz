import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-[120px] w-full rounded-xl border border-border-glass bg-bg-primary/30 px-4 py-3 text-[0.95rem] text-text-primary transition-all duration-200 outline-none placeholder:text-text-muted hover:border-border-glass-hover focus-visible:border-accent-blue focus-visible:ring-[3px] focus-visible:ring-accent-blue-glow-soft disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
