"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { products } from "@/lib/mock-data"
import { Search, Plus, Package, Upload, Download, Trash2 } from "lucide-react"
import { toast } from "sonner"

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]

export default function AdminProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [addOpen, setAddOpen] = useState(false)

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCategory = categoryFilter === "All" || p.category === categoryFilter
      return matchSearch && matchCategory
    })
  }, [search, categoryFilter])

  function toggleSelect(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  function toggleAll() {
    if (filtered.every((p) => selected.has(p.id))) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((p) => p.id)))
    }
  }

  return (
    <AppShell section="admin" title="Products">
      <PageHeader
        title="Product Management"
        description="Manage your product catalog, pricing, and inventory."
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => toast.info("CSV import dialog")}>
              <Upload className="mr-2 h-4 w-4" /> Import CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast.success("Export started")}>
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        }
      />

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mt-4 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3">
          <span className="text-sm font-medium text-foreground">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { toast.success(`${selected.size} products updated`); setSelected(new Set()) }}>
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" onClick={() => { toast.error(`${selected.size} products deleted`); setSelected(new Set()) }}>
              <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-0" />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0"><SelectValue placeholder="Category" /></SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="No products found" description="Try adjusting your search or filter criteria." className="mt-6" />
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">
                    <Checkbox checked={filtered.length > 0 && filtered.every((p) => selected.has(p.id))} onCheckedChange={toggleAll} aria-label="Select all" />
                  </TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} aria-label={`Select ${p.name}`} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                    <TableCell className="font-medium text-foreground text-sm">{p.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground">{p.stock.toLocaleString()}</span>
                        <StatusChip status={p.stockStatus} />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-medium text-foreground">${p.unitPrice.toFixed(2)}</TableCell>
                    <TableCell><StatusChip status={p.status} /></TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => setAddOpen(true)}>Edit</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((p) => (
              <div key={p.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                  </div>
                  <StatusChip status={p.status} />
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{p.category}</span>
                  <StatusChip status={p.stockStatus} />
                  <span className="ml-auto font-medium text-foreground">${p.unitPrice.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Product Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Fill in the product details below.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="product-sku">SKU</Label>
                <Input id="product-sku" placeholder="ELC-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input id="product-name" placeholder="Product name" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select defaultValue="Electronics">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Electronics", "Hydraulics", "Pneumatics", "Fasteners", "Safety", "Tools"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-brand">Brand</Label>
                <Input id="product-brand" placeholder="Brand name" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="product-price">Unit Price ($)</Label>
                <Input id="product-price" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-stock">Stock</Label>
                <Input id="product-stock" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-moq">MOQ</Label>
                <Input id="product-moq" type="number" placeholder="1" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue="active">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Product saved"); setAddOpen(false) }}>Save Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
