"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
} from "@/components/ui/dialog"
import { products, type Product } from "@/lib/mock-data"
import { formatNumber } from "@/lib/utils"
import { Search, Package, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react"
import { toast } from "sonner"

const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))]
const brands = ["All", ...Array.from(new Set(products.map((p) => p.brand)))]
const stockStatuses = ["All", "in-stock", "low-stock", "out-of-stock"]

const PAGE_SIZE = 8

export default function CatalogPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [brand, setBrand] = useState("All")
  const [stockFilter, setStockFilter] = useState("All")
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [page, setPage] = useState(1)
  const [detailProduct, setDetailProduct] = useState<Product | null>(null)
  const [sortField, setSortField] = useState<"name" | "unitPrice" | "stock">("name")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
      const matchCategory = category === "All" || p.category === category
      const matchBrand = brand === "All" || p.brand === brand
      const matchStock = stockFilter === "All" || p.stockStatus === stockFilter
      return matchSearch && matchCategory && matchBrand && matchStock
    })
    result.sort((a, b) => {
      const av = a[sortField]
      const bv = b[sortField]
      if (typeof av === "string" && typeof bv === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av)
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number)
    })
    return result
  }, [search, category, brand, stockFilter, sortField, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function toggleSort(field: "name" | "unitPrice" | "stock") {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  function toggleSelect(id: string) {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  function toggleAll() {
    if (paged.every((p) => selected.has(p.id))) {
      const next = new Set(selected)
      paged.forEach((p) => next.delete(p.id))
      setSelected(next)
    } else {
      const next = new Set(selected)
      paged.forEach((p) => next.add(p.id))
      setSelected(next)
    }
  }

  return (
    <AppShell section="partner" title="Catalog">
      <PageHeader
        title="Product Catalog"
        description="Browse products, check availability, and add items to your request."
      />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 bg-secondary border-0"
          />
        </div>
        <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={brand} onValueChange={(v) => { setBrand(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            {brands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={stockFilter} onValueChange={(v) => { setStockFilter(v); setPage(1) }}>
          <SelectTrigger className="w-full sm:w-40 bg-secondary border-0">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            {stockStatuses.map((s) => (
              <SelectItem key={s} value={s}>{s === "All" ? "All Stock" : s.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description="Try adjusting your search or filter criteria."
          className="mt-6"
        />
      ) : (
        <>
          <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10">
                      <Checkbox
                        checked={paged.length > 0 && paged.every((p) => selected.has(p.id))}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                        Product {sortField === "name" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("stock")} className="flex items-center gap-1 hover:text-foreground">
                        Stock {sortField === "stock" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </TableHead>
                    <TableHead>
                      <button onClick={() => toggleSort("unitPrice")} className="flex items-center gap-1 hover:text-foreground">
                        Price {sortField === "unitPrice" ? (sortDir === "asc" ? "↑" : "↓") : ""}
                      </button>
                    </TableHead>
                    <TableHead>MOQ</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-20"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paged.map((p) => (
                    <TableRow key={p.id} className="cursor-pointer" onClick={() => setDetailProduct(p)}>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={selected.has(p.id)} onCheckedChange={() => toggleSelect(p.id)} aria-label={`Select ${p.name}`} />
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{p.sku}</TableCell>
                      <TableCell className="font-medium text-foreground text-sm">{p.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.category}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.brand}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground">{formatNumber(p.stock)}</span>
                          <StatusChip status={p.stockStatus} />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-foreground">${p.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{p.moq}</TableCell>
                      <TableCell><StatusChip status={p.status} /></TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 gap-1.5 text-xs"
                          onClick={() => toast.success(`${p.name} added to request`)}
                        >
                          <ShoppingCart className="h-3.5 w-3.5" />
                          Add
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {paged.map((p) => (
                <div key={p.id} className="p-4 space-y-2" onClick={() => setDetailProduct(p)}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{p.sku}</p>
                    </div>
                    <StatusChip status={p.stockStatus} />
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{p.category}</span>
                    <span>{p.brand}</span>
                    <span className="ml-auto font-medium text-foreground">${p.unitPrice.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              Showing {(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} products
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(page - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Product Detail Dialog */}
      <Dialog open={!!detailProduct} onOpenChange={() => setDetailProduct(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{detailProduct?.name}</DialogTitle>
            <DialogDescription>{detailProduct?.sku} &middot; {detailProduct?.brand}</DialogDescription>
          </DialogHeader>
          {detailProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Category</p>
                  <p className="font-medium text-foreground">{detailProduct.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Unit Price</p>
                  <p className="font-medium text-foreground">${detailProduct.unitPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stock</p>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{formatNumber(detailProduct.stock)}</span>
                    <StatusChip status={detailProduct.stockStatus} />
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">MOQ</p>
                  <p className="font-medium text-foreground">{detailProduct.moq} units</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1 gap-1.5" onClick={() => { toast.success(`${detailProduct.name} added to request`); setDetailProduct(null) }}>
                  <ShoppingCart className="h-4 w-4" />
                  Add to Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
