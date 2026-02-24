"use client"

import { use } from "react"
import { AppShell } from "@/components/app-shell"
import { StatusChip } from "@/components/status-chip"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { requests, requestComments } from "@/lib/mock-data"
import { ArrowLeft, Copy, Download, XCircle, Clock, Send } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useState } from "react"

export default function RequestDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const request = requests.find((r) => r.id === id) || requests[0]
  const [comment, setComment] = useState("")

  const timeline = [
    { label: "Request created", date: request.submittedAt, user: request.contact },
    ...(request.status !== "draft" ? [{ label: "Submitted for review", date: request.submittedAt, user: request.contact }] : []),
    ...(request.status === "in-review" || request.status === "approved" || request.status === "rejected"
      ? [{ label: "Moved to review", date: request.submittedAt, user: "David Park" }] : []),
    ...(request.status === "approved" ? [{ label: "Approved", date: request.submittedAt, user: "David Park" }] : []),
    ...(request.status === "rejected" ? [{ label: "Rejected", date: request.submittedAt, user: "David Park" }] : []),
  ]

  return (
    <AppShell section="partner" title={`Request ${request.id}`}>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/requests">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{request.id}</h1>
            <StatusChip status={request.status} />
            <StatusChip status={request.priority} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Submitted on {new Date(request.submittedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Request Overview</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <p className="text-muted-foreground">Company</p>
                <p className="font-medium text-foreground">{request.company}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium text-foreground">{request.contact}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Items</p>
                <p className="font-medium text-foreground">{request.itemCount} products</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Value</p>
                <p className="font-medium text-foreground">${request.total.toLocaleString()}</p>
              </div>
            </div>
            {request.notes && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-muted-foreground text-sm">Notes</p>
                <p className="text-sm text-foreground mt-1">{request.notes}</p>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-sm font-semibold text-foreground">Line Items</h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="hidden sm:table-cell">SKU</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Unit Price</TableHead>
                  <TableHead className="hidden sm:table-cell">Requested</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {request.items.map((item, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-sm font-medium text-foreground">{item.productName}</TableCell>
                    <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">{item.sku}</TableCell>
                    <TableCell className="text-sm text-foreground">{item.qty}</TableCell>
                    <TableCell className="text-sm text-foreground">${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">
                      {item.requestedPrice ? (
                        <span className="text-warning">${item.requestedPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-foreground">
                      ${(item.qty * item.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Comments */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Comments</h3>
            <div className="space-y-4">
              {requestComments.map((c) => (
                <div key={c.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-secondary text-foreground text-xs">{c.user.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{c.user}</span>
                      <StatusChip status={c.role === "admin" ? "active" : "pending"} className="text-[10px]" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(c.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{c.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button size="icon" className="shrink-0 self-end h-10 w-10" onClick={() => { toast.success("Comment sent"); setComment("") }}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Timeline</h3>
            <div className="space-y-3">
              {timeline.map((t, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-card">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{t.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.user} &middot; {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact</h3>
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-secondary text-foreground text-sm">{request.contact.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground">{request.contact}</p>
                <p className="text-xs text-muted-foreground">{request.contactEmail}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{request.company}</p>
          </div>

          {/* Summary */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">${request.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items</span>
                <span className="text-foreground">{request.itemCount}</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">${request.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={() => toast.info("Edit mode opened")}>
                <Copy className="h-3.5 w-3.5" /> Duplicate Request
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" size="sm" onClick={() => toast.success("PDF download started")}>
                <Download className="h-3.5 w-3.5" /> Download PDF
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 text-destructive hover:text-destructive" size="sm" onClick={() => toast.error("Request cancelled")}>
                <XCircle className="h-3.5 w-3.5" /> Cancel Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
