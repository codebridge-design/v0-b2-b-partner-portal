"use client"

import { useState } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
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
import { products } from "@/lib/mock-data"
import { Trash2, Plus, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

type FormItem = {
  productId: string
  productName: string
  qty: number
  unitPrice: number
  comment: string
}

export default function NewRequestPage() {
  const [company, setCompany] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [priority, setPriority] = useState("medium")
  const [notes, setNotes] = useState("")
  const [items, setItems] = useState<FormItem[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  function addItem() {
    setItems([...items, { productId: "", productName: "", qty: 1, unitPrice: 0, comment: "" }])
  }

  function updateItem(index: number, field: keyof FormItem, value: string | number) {
    const next = [...items]
    if (field === "productId") {
      const product = products.find((p) => p.id === value)
      if (product) {
        next[index] = { ...next[index], productId: product.id, productName: product.name, unitPrice: product.unitPrice }
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (next[index] as any)[field] = value
    }
    setItems(next)
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index))
  }

  const estimatedTotal = items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)

  function validate() {
    const errs: Record<string, string> = {}
    if (!company.trim()) errs.company = "Company name is required"
    if (!contactName.trim()) errs.contactName = "Contact name is required"
    if (!contactEmail.trim()) errs.contactEmail = "Email is required"
    else if (!contactEmail.includes("@")) errs.contactEmail = "Enter a valid email"
    if (items.length === 0) errs.items = "Add at least one product"
    items.forEach((item, i) => {
      if (!item.productId) errs[`item_${i}`] = "Select a product"
      if (item.qty < 1) errs[`item_qty_${i}`] = "Quantity must be at least 1"
    })
    return errs
  }

  function handleSubmit() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) {
      toast.error("Please fix the errors before submitting")
      return
    }
    setSubmitted(true)
    toast.success("Request submitted successfully")
  }

  function handleSaveDraft() {
    toast.success("Draft saved")
  }

  if (submitted) {
    return (
      <AppShell section="partner" title="New Request">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-success/15 p-4 mb-6">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-foreground">Request Submitted</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md">
            Your quote request has been submitted and is now pending review. You will be notified when it is processed.
          </p>
          <div className="mt-8 flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/app/requests">View All Requests</Link>
            </Button>
            <Button onClick={() => { setSubmitted(false); setItems([]); setCompany(""); setContactName(""); setContactEmail(""); setContactPhone(""); setNotes("") }}>
              New Request
            </Button>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell section="partner" title="New Request">
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/requests">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requests
          </Link>
        </Button>
      </div>
      <PageHeader title="New Quote Request" description="Fill in the details below to submit a new quote request." />

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2 space-y-8">
          {/* Company Info */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Company Information</h3>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => { setCompany(e.target.value); setErrors((p) => ({ ...p, company: "" })) }}
                  placeholder="Enter company name"
                  className={errors.company ? "border-destructive" : ""}
                />
                {errors.company && <p className="text-xs text-destructive">{errors.company}</p>}
              </div>
            </div>
          </section>

          {/* Contact Details */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Contact Details</h3>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    value={contactName}
                    onChange={(e) => { setContactName(e.target.value); setErrors((p) => ({ ...p, contactName: "" })) }}
                    placeholder="Enter contact name"
                    className={errors.contactName ? "border-destructive" : ""}
                  />
                  {errors.contactName && <p className="text-xs text-destructive">{errors.contactName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => { setContactEmail(e.target.value); setErrors((p) => ({ ...p, contactEmail: "" })) }}
                    placeholder="you@company.com"
                    className={errors.contactEmail ? "border-destructive" : ""}
                  />
                  {errors.contactEmail && <p className="text-xs text-destructive">{errors.contactEmail}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPhone">Phone (optional)</Label>
                <Input id="contactPhone" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+1 (555) 000-0000" />
              </div>
            </div>
          </section>

          {/* Request Details */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Request Details</h3>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Product Selection */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Products</h3>
              <Button variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Product
              </Button>
            </div>
            {errors.items && <p className="text-xs text-destructive mb-3">{errors.items}</p>}
            <div className="space-y-3">
              {items.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
                  <p className="text-sm text-muted-foreground">No products added yet. Click "Add Product" to begin.</p>
                </div>
              ) : (
                items.map((item, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 space-y-3">
                        <Select value={item.productId} onValueChange={(v) => updateItem(i, "productId", v)}>
                          <SelectTrigger className={errors[`item_${i}`] ? "border-destructive" : ""}>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.filter((p) => p.status === "active").map((p) => (
                              <SelectItem key={p.id} value={p.id}>{p.name} ({p.sku})</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`item_${i}`] && <p className="text-xs text-destructive">{errors[`item_${i}`]}</p>}
                        <div className="grid gap-3 sm:grid-cols-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Quantity *</Label>
                            <Input
                              type="number"
                              min={1}
                              value={item.qty}
                              onChange={(e) => updateItem(i, "qty", parseInt(e.target.value) || 1)}
                              className={errors[`item_qty_${i}`] ? "border-destructive" : ""}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Unit Price</Label>
                            <Input value={`$${item.unitPrice.toFixed(2)}`} disabled />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Line Total</Label>
                            <Input value={`$${(item.qty * item.unitPrice).toFixed(2)}`} disabled />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Comment (optional)</Label>
                          <Input
                            placeholder="Special pricing notes, delivery requirements..."
                            value={item.comment}
                            onChange={(e) => updateItem(i, "comment", e.target.value)}
                          />
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={() => removeItem(i)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Notes & Attachments */}
          <section>
            <h3 className="text-sm font-semibold text-foreground mb-4">Notes & Attachments</h3>
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Delivery requirements, special terms, etc."
                  rows={4}
                />
              </div>
              <div className="rounded-lg border border-dashed border-border p-6 text-center">
                <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                <p className="text-xs text-muted-foreground mt-1">PDF, XLSX, CSV up to 10MB</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h3 className="text-sm font-semibold text-foreground mb-4">Request Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <StatusChip status="draft" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium text-foreground">{items.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Priority</span>
                  <StatusChip status={priority as "low" | "medium" | "high" | "urgent"} />
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Estimated Total</span>
                  <span className="text-lg font-semibold text-foreground">${estimatedTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button className="w-full" onClick={handleSubmit}>Submit Request</Button>
              <Button variant="outline" className="w-full" onClick={handleSaveDraft}>Save as Draft</Button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
