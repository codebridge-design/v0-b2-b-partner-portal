"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { tickets, type Ticket } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import { Search, Plus, TicketIcon } from "lucide-react"
import { toast } from "sonner"

const categoryOptions = ["All", "billing", "technical", "shipping", "product", "account"]
const statusOptions = ["All", "open", "in-progress", "resolved", "closed"]

export default function TicketsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [createOpen, setCreateOpen] = useState(false)

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase())
      const matchCategory = categoryFilter === "All" || t.category === categoryFilter
      const matchStatus = statusFilter === "All" || t.status === statusFilter
      return matchSearch && matchCategory && matchStatus
    })
  }, [search, categoryFilter, statusFilter])

  return (
    <AppShell section="partner" title="Tickets">
      <PageHeader
        title="Support Tickets"
        description="Create and manage support tickets."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Ticket
          </Button>
        }
      />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary border-0"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categoryOptions.map((c) => (
              <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>{s === "All" ? "All Statuses" : s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ticket list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No tickets found"
          description={search || categoryFilter !== "All" || statusFilter !== "All"
            ? "Try adjusting your search or filter criteria."
            : "No support tickets have been created yet."}
          className="mt-6"
          action={
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Create Ticket
            </Button>
          }
        />
      ) : (
        <div className="mt-4 space-y-2">
          {filtered.map((ticket) => (
            <button
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="w-full text-left rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                    <StatusChip status={ticket.status} />
                    <StatusChip status={ticket.priority} />
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{ticket.subject}</p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="capitalize">{ticket.category}</span>
                    <span>Assigned to {ticket.assignee}</span>
                    <span className="hidden sm:inline">
                      Updated {formatDate(ticket.updatedAt, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Ticket detail panel */}
      <Sheet open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedTicket && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedTicket.subject}</SheetTitle>
                <SheetDescription>{selectedTicket.id}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="flex flex-wrap gap-2">
                  <StatusChip status={selectedTicket.status} />
                  <StatusChip status={selectedTicket.priority} />
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                    {selectedTicket.category}
                  </span>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Description</p>
                    <p className="text-foreground leading-relaxed">{selectedTicket.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground">Assignee</p>
                      <p className="font-medium text-foreground">{selectedTicket.assignee}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium text-foreground">
                        {formatDate(selectedTicket.createdAt, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Updated</p>
                      <p className="font-medium text-foreground">
                        {formatDate(selectedTicket.updatedAt, { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Create ticket dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Support Ticket</DialogTitle>
            <DialogDescription>Describe your issue and we will get back to you as soon as possible.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ticket-subject">Subject</Label>
              <Input id="ticket-subject" placeholder="Brief description of the issue" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue="technical">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["billing", "technical", "shipping", "product", "account"].map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ticket-desc">Description</Label>
              <Textarea id="ticket-desc" placeholder="Provide details about your issue..." rows={4} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Ticket created successfully"); setCreateOpen(false) }}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
