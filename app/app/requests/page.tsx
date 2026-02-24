"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { requests } from "@/lib/mock-data"
import { formatNumber, formatDate } from "@/lib/utils"
import { Search, Plus, FileText, ArrowUpDown } from "lucide-react"

const statusTabs = ["all", "in-review", "approved", "rejected", "submitted", "draft"] as const

export default function RequestsPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState<string>("all")

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch =
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.company.toLowerCase().includes(search.toLowerCase())
      const matchTab = tab === "all" || r.status === tab
      return matchSearch && matchTab
    })
  }, [search, tab])

  return (
    <AppShell section="partner" title="Requests">
      <PageHeader
        title="Quote Requests"
        description="Manage and track your quote requests."
        action={
          <Button asChild>
            <Link href="/app/requests/new">
              <Plus className="mr-2 h-4 w-4" /> New Request
            </Link>
          </Button>
        }
      />

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList>
          {statusTabs.map((s) => (
            <TabsTrigger key={s} value={s} className="capitalize">
              {s === "all" ? "All" : s.replace("-", " ")}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="mt-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by ID or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-secondary border-0"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No requests found"
          description={tab !== "all" ? `No requests with status "${tab.replace("-", " ")}".` : "Try a different search term."}
          className="mt-6"
          action={
            <Button asChild>
              <Link href="/app/requests/new">
                <Plus className="mr-2 h-4 w-4" /> Create Request
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          {/* Desktop */}
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Company / Contact</TableHead>
                  <TableHead>
                    <span className="flex items-center gap-1">
                      Submitted <ArrowUpDown className="h-3 w-3" />
                    </span>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => {}}>
                    <TableCell>
                      <Link href={`/app/requests/${r.id}`} className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                        {r.id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">{r.company}</p>
                        <p className="text-xs text-muted-foreground">{r.contact}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(r.submittedAt, { month: "short", day: "numeric", year: "numeric" })}
                    </TableCell>
                    <TableCell><StatusChip status={r.status} /></TableCell>
                    <TableCell><StatusChip status={r.priority} /></TableCell>
                    <TableCell className="text-right text-sm font-medium text-foreground">${formatNumber(r.total)}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">{r.itemCount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((r) => (
              <Link key={r.id} href={`/app/requests/${r.id}`} className="block p-4 hover:bg-secondary/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.id}</p>
                    <p className="text-xs text-muted-foreground">{r.company}</p>
                  </div>
                  <StatusChip status={r.status} />
                </div>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{formatDate(r.submittedAt, { month: "short", day: "numeric" })}</span>
                  <StatusChip status={r.priority} />
                  <span className="ml-auto font-medium text-foreground">${formatNumber(r.total)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  )
}
