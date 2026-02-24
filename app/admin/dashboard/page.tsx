"use client"

import { AppShell } from "@/components/app-shell"
import { KpiCard } from "@/components/kpi-card"
import { StatusChip } from "@/components/status-chip"
import { ActivityTimeline } from "@/components/activity-timeline"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { requests, activities } from "@/lib/mock-data"
import { formatNumber } from "@/lib/utils"
import {
  ClipboardList,
  Users,
  TicketIcon,
  Package,
  AlertTriangle,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

const kpis = [
  { title: "Pending Approvals", value: "5", change: "+2 since yesterday", changeType: "neutral" as const, icon: ClipboardList },
  { title: "Total Partners", value: "6", change: "+1 this month", changeType: "positive" as const, icon: Users },
  { title: "Open Tickets", value: "3", change: "1 unassigned", changeType: "neutral" as const, icon: TicketIcon },
  { title: "Catalog Products", value: "12", change: "2 low stock alerts", changeType: "negative" as const, icon: Package },
]

const alerts = [
  { message: "3 requests exceed budget threshold of $25,000", type: "warning" },
  { message: "2 products are out of stock and need restocking", type: "error" },
  { message: "1 partner invitation is pending approval", type: "info" },
]

export default function AdminDashboard() {
  const pendingRequests = requests.filter((r) => r.status === "in-review" || r.status === "submitted")

  return (
    <AppShell section="admin" title="Admin Dashboard">
      <PageHeader title="Admin Dashboard" description="Overview of platform operations and pending actions." />

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Pending requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h3 className="text-sm font-semibold text-foreground">Requests Pending Review</h3>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/requests">
                  View all <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
            <div className="divide-y divide-border">
              {pendingRequests.map((r) => (
                <div key={r.id} className="flex items-center justify-between px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{r.id}</span>
                      <StatusChip status={r.status} />
                      <StatusChip status={r.priority} />
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{r.company} &middot; {r.contact}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${formatNumber(r.total)}</p>
                    <p className="text-xs text-muted-foreground">{r.itemCount} items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Partner activity / growth indicator */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Partner Activity</h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { label: "Active This Week", value: "4", total: "6 partners", percent: 67 },
                { label: "Requests This Month", value: "6", total: "vs 3 last month", percent: 100 },
                { label: "Avg. Response Time", value: "1.4d", total: "target: 2 days", percent: 70 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  <div className="mt-2 mx-auto h-1.5 w-full max-w-24 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${stat.percent}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{stat.total}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent admin activity */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Recent Activity</h3>
            <ActivityTimeline activities={activities.slice(0, 5)} />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Alerts</h3>
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className="flex gap-3 rounded-lg bg-secondary p-3">
                  <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${
                    alert.type === "error" ? "text-destructive" : alert.type === "warning" ? "text-warning" : "text-chart-2"
                  }`} />
                  <p className="text-xs text-foreground leading-relaxed">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Request Status Overview</h3>
            <div className="space-y-3">
              {[
                { label: "Approved", count: 1, color: "bg-success" },
                { label: "In Review", count: 2, color: "bg-warning" },
                { label: "Submitted", count: 1, color: "bg-chart-2" },
                { label: "Rejected", count: 1, color: "bg-destructive" },
                { label: "Draft", count: 1, color: "bg-secondary" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${item.color}`} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick nav */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Navigation</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" size="sm" asChild>
                <Link href="/admin/requests"><ClipboardList className="h-3.5 w-3.5" /> Review Queue</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm" asChild>
                <Link href="/admin/users"><Users className="h-3.5 w-3.5" /> Manage Users</Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm" asChild>
                <Link href="/admin/products"><Package className="h-3.5 w-3.5" /> Product Catalog</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
