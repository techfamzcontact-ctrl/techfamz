import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-[14px] border border-transparent bg-clip-padding text-[14px] font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-[3px] focus-visible:ring-accent-blue/50 focus-visible:border-accent-blue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white shadow-[0_0_20px_var(--color-accent-blue-glow)] hover:bg-blue-600 hover:-translate-y-0.5",
        outline:
          "border-border-glass bg-transparent text-text-primary hover:border-accent-blue hover:bg-accent-blue/5",
        secondary:
          "border-border-glass bg-transparent text-text-primary hover:border-accent-blue hover:text-white hover:-translate-y-0.5",
        ghost:
          "rounded-lg hover:bg-white/10 text-text-primary hover:text-white",
        destructive:
          "bg-red-900/50 text-red-200 border border-red-900/50 hover:bg-red-800/80 hover:border-red-500/50",
        link: "text-accent-blue underline-offset-4 hover:underline",
        cta: "bg-cta-yellow text-bg-primary shadow-[0_0_20px_var(--color-cta-yellow-glow)] hover:bg-cta-yellow-hover hover:-translate-y-0.5",
        "outline-glow": "border border-border-glass bg-transparent text-text-primary shadow-[0_0_20px_var(--color-accent-blue-glow-soft)] hover:border-accent-blue hover:shadow-[0_0_30px_var(--color-accent-blue-glow)] hover:-translate-y-0.5",
      },
      size: {
        default: "h-12 px-8",
        sm: "h-10 px-4 text-[13px] rounded-xl",
        lg: "h-14 px-10 text-[16px] rounded-2xl",
        icon: "size-12 rounded-[50px]",
        "icon-sm": "size-10 rounded-[50px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
