// ── Products ──────────────────────────────────────────────
export type Product = {
  id: string
  sku: string
  name: string
  category: string
  brand: string
  stock: number
  stockStatus: "in-stock" | "low-stock" | "out-of-stock"
  unitPrice: number
  moq: number
  status: "active" | "discontinued" | "draft"
}

export const products: Product[] = [
  { id: "p1", sku: "ELC-4821", name: "Industrial Relay Module 24V", category: "Electronics", brand: "Siemens", stock: 1240, stockStatus: "in-stock", unitPrice: 84.5, moq: 10, status: "active" },
  { id: "p2", sku: "HYD-1190", name: "Hydraulic Pressure Gauge 0-400 Bar", category: "Hydraulics", brand: "Parker", stock: 340, stockStatus: "in-stock", unitPrice: 132.0, moq: 5, status: "active" },
  { id: "p3", sku: "PNE-7734", name: "Pneumatic Cylinder 50mm Bore", category: "Pneumatics", brand: "Festo", stock: 18, stockStatus: "low-stock", unitPrice: 296.0, moq: 2, status: "active" },
  { id: "p4", sku: "ELC-5502", name: "Variable Frequency Drive 3HP", category: "Electronics", brand: "ABB", stock: 0, stockStatus: "out-of-stock", unitPrice: 1245.0, moq: 1, status: "active" },
  { id: "p5", sku: "FAS-3318", name: "Stainless Steel Hex Bolt M12x80", category: "Fasteners", brand: "Hilti", stock: 8500, stockStatus: "in-stock", unitPrice: 2.4, moq: 100, status: "active" },
  { id: "p6", sku: "HYD-2240", name: "Hydraulic Hose Assembly 1/2\" 3m", category: "Hydraulics", brand: "Gates", stock: 420, stockStatus: "in-stock", unitPrice: 48.75, moq: 10, status: "active" },
  { id: "p7", sku: "ELC-6610", name: "PLC Controller Unit S7-1200", category: "Electronics", brand: "Siemens", stock: 56, stockStatus: "in-stock", unitPrice: 3420.0, moq: 1, status: "active" },
  { id: "p8", sku: "SAF-1122", name: "Industrial Safety Gloves EN388", category: "Safety", brand: "Honeywell", stock: 2200, stockStatus: "in-stock", unitPrice: 12.5, moq: 50, status: "active" },
  { id: "p9", sku: "PNE-8821", name: "Air Preparation Unit FRL 1/4\"", category: "Pneumatics", brand: "SMC", stock: 8, stockStatus: "low-stock", unitPrice: 189.0, moq: 3, status: "active" },
  { id: "p10", sku: "TOL-4451", name: "Torque Wrench 40-200 Nm", category: "Tools", brand: "Snap-on", stock: 0, stockStatus: "out-of-stock", unitPrice: 485.0, moq: 1, status: "discontinued" },
  { id: "p11", sku: "ELC-7790", name: "Proximity Sensor Inductive 8mm", category: "Electronics", brand: "Omron", stock: 670, stockStatus: "in-stock", unitPrice: 38.0, moq: 10, status: "active" },
  { id: "p12", sku: "HYD-3350", name: "Hydraulic Power Unit 5HP", category: "Hydraulics", brand: "Bosch Rexroth", stock: 12, stockStatus: "low-stock", unitPrice: 4890.0, moq: 1, status: "active" },
]

// ── Request Items ──────────────────────────────────────────
export type RequestItem = {
  productId: string
  productName: string
  sku: string
  qty: number
  unitPrice: number
  requestedPrice: number | null
  comment: string
}

// ── Requests ──────────────────────────────────────────────
export type Request = {
  id: string
  company: string
  contact: string
  contactEmail: string
  submittedAt: string
  status: "draft" | "submitted" | "in-review" | "approved" | "rejected"
  priority: "low" | "medium" | "high" | "urgent"
  total: number
  itemCount: number
  items: RequestItem[]
  notes: string
}

export const requests: Request[] = [
  {
    id: "RQ-2024-001", company: "Meridian Manufacturing", contact: "Sarah Chen", contactEmail: "s.chen@meridianmfg.com",
    submittedAt: "2024-12-15T09:30:00Z", status: "approved", priority: "high", total: 28450.0, itemCount: 4,
    items: [
      { productId: "p7", productName: "PLC Controller Unit S7-1200", sku: "ELC-6610", qty: 3, unitPrice: 3420.0, requestedPrice: 3200.0, comment: "Volume pricing for Q1 rollout" },
      { productId: "p1", productName: "Industrial Relay Module 24V", sku: "ELC-4821", qty: 50, unitPrice: 84.5, requestedPrice: 78.0, comment: "" },
      { productId: "p11", productName: "Proximity Sensor Inductive 8mm", sku: "ELC-7790", qty: 100, unitPrice: 38.0, requestedPrice: 34.0, comment: "Annual contract pricing" },
      { productId: "p3", productName: "Pneumatic Cylinder 50mm Bore", sku: "PNE-7734", qty: 20, unitPrice: 296.0, requestedPrice: null, comment: "" },
    ],
    notes: "Urgent requirement for new production line setup. Need delivery within 2 weeks."
  },
  {
    id: "RQ-2024-002", company: "Atlas Industrial Solutions", contact: "James Rivera", contactEmail: "j.rivera@atlasind.com",
    submittedAt: "2024-12-18T14:15:00Z", status: "in-review", priority: "medium", total: 12340.0, itemCount: 3,
    items: [
      { productId: "p12", productName: "Hydraulic Power Unit 5HP", sku: "HYD-3350", qty: 2, unitPrice: 4890.0, requestedPrice: 4600.0, comment: "Replacing existing units" },
      { productId: "p2", productName: "Hydraulic Pressure Gauge 0-400 Bar", sku: "HYD-1190", qty: 10, unitPrice: 132.0, requestedPrice: null, comment: "" },
      { productId: "p6", productName: "Hydraulic Hose Assembly 1/2\" 3m", sku: "HYD-2240", qty: 20, unitPrice: 48.75, requestedPrice: 45.0, comment: "Recurring order" },
    ],
    notes: "Replacement parts for hydraulic system overhaul in Plant B."
  },
  {
    id: "RQ-2024-003", company: "Pinnacle Automation Group", contact: "Emily Nakamura", contactEmail: "e.nakamura@pinnacleauto.com",
    submittedAt: "2024-12-20T11:00:00Z", status: "submitted", priority: "low", total: 5675.0, itemCount: 2,
    items: [
      { productId: "p8", productName: "Industrial Safety Gloves EN388", sku: "SAF-1122", qty: 200, unitPrice: 12.5, requestedPrice: 10.5, comment: "Annual bulk safety equipment order" },
      { productId: "p9", productName: "Air Preparation Unit FRL 1/4\"", sku: "PNE-8821", qty: 15, unitPrice: 189.0, requestedPrice: null, comment: "" },
    ],
    notes: "Annual safety equipment refresh for all facilities."
  },
  {
    id: "RQ-2024-004", company: "Vanguard Engineering Corp", contact: "Robert Kim", contactEmail: "r.kim@vanguardeng.com",
    submittedAt: "2024-12-22T08:45:00Z", status: "rejected", priority: "high", total: 48900.0, itemCount: 2,
    items: [
      { productId: "p4", productName: "Variable Frequency Drive 3HP", sku: "ELC-5502", qty: 30, unitPrice: 1245.0, requestedPrice: 950.0, comment: "Need significant volume discount" },
      { productId: "p7", productName: "PLC Controller Unit S7-1200", sku: "ELC-6610", qty: 5, unitPrice: 3420.0, requestedPrice: 2800.0, comment: "" },
    ],
    notes: "Major automation project. Requested pricing is below our cost threshold."
  },
  {
    id: "RQ-2024-005", company: "Cobalt Supply Chain", contact: "Lisa Andersen", contactEmail: "l.andersen@cobaltsupply.com",
    submittedAt: "2024-12-28T16:20:00Z", status: "in-review", priority: "urgent", total: 8920.0, itemCount: 5,
    items: [
      { productId: "p5", productName: "Stainless Steel Hex Bolt M12x80", sku: "FAS-3318", qty: 500, unitPrice: 2.4, requestedPrice: 2.0, comment: "" },
      { productId: "p1", productName: "Industrial Relay Module 24V", sku: "ELC-4821", qty: 30, unitPrice: 84.5, requestedPrice: null, comment: "" },
      { productId: "p8", productName: "Industrial Safety Gloves EN388", sku: "SAF-1122", qty: 100, unitPrice: 12.5, requestedPrice: 11.0, comment: "" },
      { productId: "p11", productName: "Proximity Sensor Inductive 8mm", sku: "ELC-7790", qty: 50, unitPrice: 38.0, requestedPrice: 35.0, comment: "" },
      { productId: "p6", productName: "Hydraulic Hose Assembly 1/2\" 3m", sku: "HYD-2240", qty: 10, unitPrice: 48.75, requestedPrice: null, comment: "" },
    ],
    notes: "Urgent replenishment for warehouse stock. Expedited shipping required."
  },
  {
    id: "RQ-2024-006", company: "Horizon Fabrication Ltd", contact: "Michael Torres", contactEmail: "m.torres@horizonfab.com",
    submittedAt: "2025-01-02T10:00:00Z", status: "draft", priority: "medium", total: 3150.0, itemCount: 2,
    items: [
      { productId: "p3", productName: "Pneumatic Cylinder 50mm Bore", sku: "PNE-7734", qty: 5, unitPrice: 296.0, requestedPrice: null, comment: "" },
      { productId: "p9", productName: "Air Preparation Unit FRL 1/4\"", sku: "PNE-8821", qty: 8, unitPrice: 189.0, requestedPrice: 175.0, comment: "" },
    ],
    notes: ""
  },
]

// ── Tickets ──────────────────────────────────────────────
export type Ticket = {
  id: string
  subject: string
  category: "billing" | "technical" | "shipping" | "product" | "account"
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high"
  assignee: string
  createdAt: string
  updatedAt: string
  description: string
}

export const tickets: Ticket[] = [
  { id: "TK-4201", subject: "Invoice discrepancy on order #ORD-8812", category: "billing", status: "open", priority: "high", assignee: "David Park", createdAt: "2024-12-28T09:00:00Z", updatedAt: "2024-12-29T14:30:00Z", description: "The invoice total does not match the agreed pricing in our contract. Please review and issue a corrected invoice." },
  { id: "TK-4202", subject: "Damaged goods received - Hydraulic hoses", category: "shipping", status: "in-progress", priority: "high", assignee: "Maria Santos", createdAt: "2024-12-26T11:30:00Z", updatedAt: "2024-12-28T16:45:00Z", description: "Several hydraulic hoses in our last shipment were damaged during transit. Photos attached. Need replacement shipment." },
  { id: "TK-4203", subject: "Request API access for inventory integration", category: "technical", status: "open", priority: "medium", assignee: "Unassigned", createdAt: "2024-12-30T08:15:00Z", updatedAt: "2024-12-30T08:15:00Z", description: "We need API access to integrate your catalog with our ERP system. Please provide documentation and access credentials." },
  { id: "TK-4204", subject: "Update company billing address", category: "account", status: "resolved", priority: "low", assignee: "David Park", createdAt: "2024-12-20T10:00:00Z", updatedAt: "2024-12-22T09:00:00Z", description: "Please update our billing address to the new headquarters location." },
  { id: "TK-4205", subject: "Product specification mismatch - PLC Unit", category: "product", status: "in-progress", priority: "medium", assignee: "Alex Novak", createdAt: "2024-12-24T14:00:00Z", updatedAt: "2024-12-27T11:20:00Z", description: "The PLC Controller delivered has firmware version 4.2 instead of the listed 4.5. Need firmware update or replacement." },
  { id: "TK-4206", subject: "Bulk order discount not applied", category: "billing", status: "closed", priority: "medium", assignee: "David Park", createdAt: "2024-12-10T09:30:00Z", updatedAt: "2024-12-15T17:00:00Z", description: "Our last bulk order of safety gloves did not include the agreed 15% volume discount." },
]

// ── Users ──────────────────────────────────────────────
export type User = {
  id: string
  name: string
  email: string
  company: string
  role: "partner" | "admin" | "viewer"
  status: "active" | "inactive" | "pending"
  lastActive: string
  avatar?: string
}

export const users: User[] = [
  { id: "u1", name: "Sarah Chen", email: "s.chen@meridianmfg.com", company: "Meridian Manufacturing", role: "partner", status: "active", lastActive: "2025-01-03T08:30:00Z" },
  { id: "u2", name: "James Rivera", email: "j.rivera@atlasind.com", company: "Atlas Industrial Solutions", role: "partner", status: "active", lastActive: "2025-01-02T14:15:00Z" },
  { id: "u3", name: "Emily Nakamura", email: "e.nakamura@pinnacleauto.com", company: "Pinnacle Automation Group", role: "partner", status: "active", lastActive: "2024-12-30T11:00:00Z" },
  { id: "u4", name: "Robert Kim", email: "r.kim@vanguardeng.com", company: "Vanguard Engineering Corp", role: "partner", status: "inactive", lastActive: "2024-12-22T08:45:00Z" },
  { id: "u5", name: "Lisa Andersen", email: "l.andersen@cobaltsupply.com", company: "Cobalt Supply Chain", role: "partner", status: "active", lastActive: "2025-01-03T16:20:00Z" },
  { id: "u6", name: "Michael Torres", email: "m.torres@horizonfab.com", company: "Horizon Fabrication Ltd", role: "partner", status: "pending", lastActive: "2025-01-02T10:00:00Z" },
  { id: "u7", name: "David Park", email: "d.park@internal.com", company: "Internal", role: "admin", status: "active", lastActive: "2025-01-03T17:00:00Z" },
  { id: "u8", name: "Maria Santos", email: "m.santos@internal.com", company: "Internal", role: "admin", status: "active", lastActive: "2025-01-03T16:30:00Z" },
  { id: "u9", name: "Alex Novak", email: "a.novak@internal.com", company: "Internal", role: "viewer", status: "active", lastActive: "2025-01-01T12:00:00Z" },
]

// ── Activity Feed ──────────────────────────────────────────
export type Activity = {
  id: string
  action: string
  detail: string
  timestamp: string
  user: string
  type: "request" | "ticket" | "user" | "system"
}

export const activities: Activity[] = [
  { id: "a1", action: "Request approved", detail: "RQ-2024-001 from Meridian Manufacturing approved", timestamp: "2025-01-03T16:30:00Z", user: "David Park", type: "request" },
  { id: "a2", action: "New ticket created", detail: "TK-4201 - Invoice discrepancy on order #ORD-8812", timestamp: "2025-01-03T14:00:00Z", user: "Sarah Chen", type: "ticket" },
  { id: "a3", action: "Request submitted", detail: "RQ-2024-005 from Cobalt Supply Chain submitted for review", timestamp: "2025-01-03T10:20:00Z", user: "Lisa Andersen", type: "request" },
  { id: "a4", action: "User invited", detail: "Michael Torres from Horizon Fabrication Ltd invited to portal", timestamp: "2025-01-02T15:00:00Z", user: "Maria Santos", type: "user" },
  { id: "a5", action: "Request rejected", detail: "RQ-2024-004 from Vanguard Engineering - below cost threshold", timestamp: "2025-01-02T11:30:00Z", user: "David Park", type: "request" },
  { id: "a6", action: "Ticket resolved", detail: "TK-4204 - Company billing address updated", timestamp: "2025-01-01T09:00:00Z", user: "David Park", type: "ticket" },
  { id: "a7", action: "Catalog updated", detail: "12 product prices updated for Q1 2025", timestamp: "2024-12-30T16:00:00Z", user: "Maria Santos", type: "system" },
  { id: "a8", action: "Request moved to review", detail: "RQ-2024-002 from Atlas Industrial now in review", timestamp: "2024-12-29T10:00:00Z", user: "Alex Novak", type: "request" },
]

// ── Comments (for request details) ──────────────────────────
export type Comment = {
  id: string
  user: string
  role: "partner" | "admin"
  content: string
  timestamp: string
}

export const requestComments: Comment[] = [
  { id: "c1", user: "Sarah Chen", role: "partner", content: "We need these items delivered to our Plant A facility by January 15th. Please confirm availability.", timestamp: "2024-12-15T09:35:00Z" },
  { id: "c2", user: "David Park", role: "admin", content: "Confirmed availability for all items. The PLC units are in stock. We can meet the January 15th deadline with express shipping.", timestamp: "2024-12-16T10:20:00Z" },
  { id: "c3", user: "Sarah Chen", role: "partner", content: "Excellent. Please proceed with the order. We accept the revised pricing on the relay modules.", timestamp: "2024-12-16T14:00:00Z" },
  { id: "c4", user: "David Park", role: "admin", content: "Request approved. Order has been processed and shipping is being arranged. You will receive tracking details within 24 hours.", timestamp: "2024-12-17T09:00:00Z" },
]
