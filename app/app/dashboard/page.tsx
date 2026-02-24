"use client"

import { AppShell } from "@/components/app-shell"
import { KpiCard } from "@/components/kpi-card"
import { StatusChip } from "@/components/status-chip"
import { ActivityTimeline } from "@/components/activity-timeline"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table"
import { requests, activities } from "@/lib/mock-data"
import {
  FileText, CheckCircle, TicketIcon, DollarSign,
  Plus, Package, ArrowRight,
} from "lucide-react"
import Link from "next/link"

const kpis = [
  { title: "Active Requests", value: "4", change: "+2 this month", changeType: "positive" as const, icon: FileText },
  { title: "Approved Quotes", value: "12", change: "+3 this quarter", changeType: "positive" as const, icon: CheckCircle },
  { title: "Open Tickets", value: "3", change: "1 high priority", changeType: "neutral" as const, icon: TicketIcon },
  { title: "Monthly Spend", value: "$48,920", change: "+12% vs last month", changeType: "positive" as const, icon: DollarSign },
]

export default function PartnerDashboard() {
  const recentRequests = requests.slice(0, 5)

  return (
    <AppShell section="partner" title="Dashboard">
      <PageHeader title="Dashboard" description="Overview of your partner activity and recent operations." />

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent requests */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h3 className="text-sm font-semibold text-foreground">Recent Requests</h3>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/app/requests">
                View all
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead className="hidden sm:table-cell">Company</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRequests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>
                    <Link href={`/app/requests/${req.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                      {req.id}
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{req.company}</TableCell>
                  <TableCell><StatusChip status={req.status} /></TableCell>
                  <TableCell className="text-right text-sm font-medium text-foreground">
                    ${req.total.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/app/requests/new">
                  <Plus className="h-4 w-4" /> New Request
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/app/catalog">
                  <Package className="h-4 w-4" /> Open Catalog
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" asChild>
                <Link href="/app/tickets">
                  <TicketIcon className="h-4 w-4" /> Create Ticket
                </Link>
              </Button>
            </div>
          </div>

          {/* Status distribution */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Request Status</h3>
            <div className="space-y-3">
              {[
                { label: "Approved", count: 1, total: 6, color: "bg-success" },
                { label: "In Review", count: 2, total: 6, color: "bg-warning" },
                { label: "Submitted", count: 1, total: 6, color: "bg-chart-2" },
                { label: "Rejected", count: 1, total: 6, color: "bg-destructive" },
                { label: "Draft", count: 1, total: 6, color: "bg-secondary" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="text-foreground font-medium">{item.count}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${(item.count / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6">
        <h3 className="text-sm font-semibold text-foreground mb-6">Activity Timeline</h3>
        <ActivityTimeline activities={activities.slice(0, 6)} />
      </div>
    </AppShell>
  )
}
