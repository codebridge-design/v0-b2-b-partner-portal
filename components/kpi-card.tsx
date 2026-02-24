import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string
  change?: string
  changeType?: "positive" | "negative" | "neutral"
  icon: LucideIcon
  className?: string
}

export function KpiCard({ title, value, change, changeType = "neutral", icon: Icon, className }: KpiCardProps) {
  return (
    <div className={cn("rounded-xl border border-border bg-card p-6", className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-secondary p-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {change && (
          <p className={cn(
            "mt-1 text-xs font-medium",
            changeType === "positive" && "text-success",
            changeType === "negative" && "text-destructive",
            changeType === "neutral" && "text-muted-foreground",
          )}>
            {change}
          </p>
        )}
      </div>
    </div>
  )
}
