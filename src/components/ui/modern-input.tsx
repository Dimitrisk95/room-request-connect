
import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModernInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const ModernInput = React.forwardRef<HTMLInputElement, ModernInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-lg border border-white/20 bg-white/10 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-white/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-0 focus-visible:border-purple-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
ModernInput.displayName = "ModernInput"

export { ModernInput }
