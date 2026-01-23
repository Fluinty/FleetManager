import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300",
    {
        variants: {
            variant: {
                default:
                    "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-sm shadow-teal-300/50",
                secondary:
                    "bg-slate-100 text-slate-700 hover:bg-slate-200",
                destructive:
                    "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-sm shadow-red-300/50",
                success:
                    "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm shadow-emerald-300/50",
                warning:
                    "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm shadow-amber-300/50",
                outline:
                    "border-2 border-teal-200 text-teal-700 bg-white/50 backdrop-blur-sm",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
