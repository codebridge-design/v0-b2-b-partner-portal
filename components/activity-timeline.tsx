import { cn, formatDate } from "@/lib/utils"
import { FileText, TicketIcon, UserPlus, Settings } from "lucide-react"
import type { Activity } from "@/lib/mock-data"

const typeIcons = {
  request: FileText,
  ticket: TicketIcon,
  user: UserPlus,
  system: Settings,
}

export function ActivityTimeline({ activities, className }: { activities: Activity[]; className?: string }) {
  return (
    <div className={cn("space-y-0", className)}>
      {activities.map((activity, i) => {
        const Icon = typeIcons[activity.type]
        const isLast = i === activities.length - 1
        return (
          <div key={activity.id} className="relative flex gap-4 pb-6">
            {!isLast && (
              <div className="absolute left-[15px] top-8 h-[calc(100%-16px)] w-px bg-border" />
            )}
            <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
              <Icon className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex-1 pt-0.5">
              <p className="text-sm font-medium text-foreground">{activity.action}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{activity.detail}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {activity.user} &middot; {formatDate(activity.timestamp, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
