"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { requests, type Request } from "@/lib/mock-data"
import { formatNumber } from "@/lib/utils"
import { Search, ClipboardList, CheckCircle, XCircle, MessageSquare, Clock } from "lucide-react"
import { toast } from "sonner"

export default function AdminRequestsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [priorityFilter, setPriorityFilter] = useState("All")
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [adminNote, setAdminNote] = useState("")

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      const matchSearch = r.id.toLowerCase().includes(search.toLowerCase()) || r.company.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === "All" || r.status === statusFilter
      const matchPriority = priorityFilter === "All" || r.priority === priorityFilter
      return matchSearch && matchStatus && matchPriority
    })
  }, [search, statusFilter, priorityFilter])

  function handleAction(action: "approve" | "reject" | "request-changes") {
    const labels = { approve: "Approved", reject: "Rejected", "request-changes": "Changes requested" }
    toast.success(`${labels[action]} - ${selectedRequest?.id}`)
    setSelectedRequest(null)
    setAdminNote("")
  }

  return (
    <AppShell section="admin" title="Request Review">
      <PageHeader title="Request Review Queue" description="Review, approve, or reject partner quote requests." />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by ID or company..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-0" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["All", "submitted", "in-review", "approved", "rejected", "draft"].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s === "All" ? "All Statuses" : s.replace("-", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            {["All", "low", "medium", "high", "urgent"].map((p) => (
              <SelectItem key={p} value={p} className="capitalize">{p === "All" ? "All Priorities" : p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={ClipboardList} title="No requests found" description="Try adjusting your search or filter criteria." className="mt-6" />
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Company / Contact</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((r) => (
                  <TableRow key={r.id} className="cursor-pointer" onClick={() => setSelectedRequest(r)}>
                    <TableCell className="text-sm font-medium text-foreground">{r.id}</TableCell>
                    <TableCell>
                      <p className="text-sm font-medium text-foreground">{r.company}</p>
                      <p className="text-xs text-muted-foreground">{r.contact}</p>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(r.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
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
              <button key={r.id} className="w-full text-left p-4 hover:bg-secondary/50" onClick={() => setSelectedRequest(r)}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{r.id}</p>
                    <p className="text-xs text-muted-foreground">{r.company}</p>
                  </div>
                  <StatusChip status={r.status} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                  <StatusChip status={r.priority} />
                  <span className="ml-auto font-medium text-foreground">${formatNumber(r.total)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review drawer */}
      <Sheet open={!!selectedRequest} onOpenChange={() => { setSelectedRequest(null); setAdminNote("") }}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedRequest && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedRequest.id}</SheetTitle>
                <SheetDescription>{selectedRequest.company} &middot; {selectedRequest.contact}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <StatusChip status={selectedRequest.status} />
                  <StatusChip status={selectedRequest.priority} />
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Value</span>
                    <span className="font-medium text-foreground">${formatNumber(selectedRequest.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Items</span>
                    <span className="text-foreground">{selectedRequest.itemCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Submitted</span>
                    <span className="text-foreground">{new Date(selectedRequest.submittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact Email</span>
                    <span className="text-foreground">{selectedRequest.contactEmail}</span>
                  </div>
                </div>

                {/* Line items */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Line Items</p>
                  <div className="space-y-2">
                    {selectedRequest.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-secondary p-3 text-sm">
                        <div>
                          <p className="font-medium text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">{item.sku} &middot; Qty: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">${formatNumber(item.qty * item.unitPrice)}</p>
                          {item.requestedPrice && (
                            <p className="text-xs text-warning">Asked: ${item.requestedPrice.toFixed(2)}/unit</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedRequest.notes && (
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">Partner Notes</p>
                    <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
                  </div>
                )}

                {/* Audit trail */}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-3">Audit Trail</p>
                  <div className="space-y-2">
                    {[
                      { action: "Request submitted", user: selectedRequest.contact, time: selectedRequest.submittedAt },
                      { action: "Assigned to review queue", user: "System", time: selectedRequest.submittedAt },
                    ].map((entry, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-foreground">{entry.action}</p>
                          <p className="text-xs text-muted-foreground">{entry.user} &middot; {new Date(entry.time).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Admin note */}
                <div className="space-y-2">
                  <Label className="text-sm">Admin Notes</Label>
                  <Textarea
                    placeholder="Add internal notes about this request..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-2">
                  <Button className="w-full gap-2" onClick={() => handleAction("approve")}>
                    <CheckCircle className="h-4 w-4" /> Approve
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="gap-2" onClick={() => handleAction("request-changes")}>
                      <MessageSquare className="h-4 w-4" /> Request Changes
                    </Button>
                    <Button variant="outline" className="gap-2 text-destructive hover:text-destructive" onClick={() => handleAction("reject")}>
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AppShell>
  )
}
