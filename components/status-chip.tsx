import { cn } from "@/lib/utils"

type StatusType =
  | "draft" | "submitted" | "in-review" | "approved" | "rejected"
  | "open" | "in-progress" | "resolved" | "closed"
  | "active" | "inactive" | "pending" | "discontinued"
  | "in-stock" | "low-stock" | "out-of-stock"
  | "low" | "medium" | "high" | "urgent"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  draft: { label: "Draft", className: "bg-secondary text-muted-foreground" },
  submitted: { label: "Submitted", className: "bg-chart-2/15 text-chart-2" },
  "in-review": { label: "In Review", className: "bg-warning/15 text-warning" },
  approved: { label: "Approved", className: "bg-success/15 text-success" },
  rejected: { label: "Rejected", className: "bg-destructive/15 text-destructive" },
  open: { label: "Open", className: "bg-chart-2/15 text-chart-2" },
  "in-progress": { label: "In Progress", className: "bg-warning/15 text-warning" },
  resolved: { label: "Resolved", className: "bg-success/15 text-success" },
  closed: { label: "Closed", className: "bg-secondary text-muted-foreground" },
  active: { label: "Active", className: "bg-success/15 text-success" },
  inactive: { label: "Inactive", className: "bg-secondary text-muted-foreground" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning" },
  discontinued: { label: "Discontinued", className: "bg-destructive/15 text-destructive" },
  "in-stock": { label: "In Stock", className: "bg-success/15 text-success" },
  "low-stock": { label: "Low Stock", className: "bg-warning/15 text-warning" },
  "out-of-stock": { label: "Out of Stock", className: "bg-destructive/15 text-destructive" },
  low: { label: "Low", className: "bg-secondary text-muted-foreground" },
  medium: { label: "Medium", className: "bg-chart-2/15 text-chart-2" },
  high: { label: "High", className: "bg-warning/15 text-warning" },
  urgent: { label: "Urgent", className: "bg-destructive/15 text-destructive" },
}

export function StatusChip({ status, className }: { status: StatusType; className?: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-secondary text-muted-foreground" }
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
      config.className,
      className
    )}>
      {config.label}
    </span>
  )
}
