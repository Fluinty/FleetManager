import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-11 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-base text-slate-800 shadow-sm transition-all duration-300",
                    "placeholder:text-slate-400",
                    "focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/10",
                    "hover:border-slate-300",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }
