import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-[14px] font-semibold whitespace-nowrap transition-colors duration-150 outline-none select-none focus-visible:ring-[3px] focus-visible:ring-accent-blue/50 focus-visible:border-accent-blue disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-accent-blue text-white hover:bg-blue-600",
        outline:
          "border-border-glass bg-transparent text-text-primary hover:border-border-glass-hover hover:bg-text-primary/5",
        secondary:
          "border-border-glass bg-bg-card text-text-primary hover:border-border-glass-hover",
        ghost:
          "rounded-lg text-text-primary hover:bg-text-primary/5",
        destructive:
          "bg-red-600 text-white hover:bg-red-700",
        link: "text-accent-blue underline-offset-4 hover:underline",
        cta: "bg-cta-yellow text-on-cta hover:bg-cta-yellow-hover",
        "outline-glow": "border border-border-glass bg-transparent text-text-primary hover:border-accent-blue/60 hover:bg-accent-blue-glow-soft",
      },
      size: {
        default: "h-11 px-6",
        xs: "h-8 px-3 text-xs gap-1.5 rounded-md",
        sm: "h-10 px-4 text-[13px]",
        lg: "h-13 px-8 text-[15px]",
        icon: "size-11 rounded-full",
        "icon-sm": "size-10 rounded-full",
        "icon-xs": "size-8 rounded-md",
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
