"use client"

import { useState, useMemo } from "react"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { StatusChip } from "@/components/status-chip"
import { EmptyState } from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { users } from "@/lib/mock-data"
import { formatDate } from "@/lib/utils"
import { Search, UserPlus, Users, MoreHorizontal, Pencil, Ban, Mail } from "lucide-react"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [inviteOpen, setInviteOpen] = useState(false)

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.company.toLowerCase().includes(search.toLowerCase())
      const matchRole = roleFilter === "All" || u.role === roleFilter
      const matchStatus = statusFilter === "All" || u.status === statusFilter
      return matchSearch && matchRole && matchStatus
    })
  }, [search, roleFilter, statusFilter])

  return (
    <AppShell section="admin" title="Users">
      <PageHeader
        title="User Management"
        description="Manage partner and admin user accounts."
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" /> Invite User
          </Button>
        }
      />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-secondary border-0" />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-secondary border-0"><SelectValue placeholder="Role" /></SelectTrigger>
          <SelectContent>
            {["All", "partner", "admin", "viewer"].map((r) => (
              <SelectItem key={r} value={r} className="capitalize">{r === "All" ? "All Roles" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-36 bg-secondary border-0"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            {["All", "active", "inactive", "pending"].map((s) => (
              <SelectItem key={s} value={s} className="capitalize">{s === "All" ? "All Statuses" : s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No users found" description="Try adjusting your search or filter criteria." className="mt-6" />
      ) : (
        <div className="mt-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-secondary text-foreground text-xs">
                            {u.name.split(" ").map((n) => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">{u.name}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{u.company}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground capitalize">
                        {u.role}
                      </span>
                    </TableCell>
                    <TableCell><StatusChip status={u.status} /></TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(u.lastActive, { month: "short", day: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info("Edit role")}>
                            <Pencil className="mr-2 h-3.5 w-3.5" /> Edit Role
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => toast.info("Invite resent")}>
                            <Mail className="mr-2 h-3.5 w-3.5" /> Resend Invite
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => toast.error("User disabled")}>
                            <Ban className="mr-2 h-3.5 w-3.5" /> Disable User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Mobile */}
          <div className="md:hidden divide-y divide-border">
            {filtered.map((u) => (
              <div key={u.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-secondary text-foreground text-xs">
                        {u.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  <StatusChip status={u.status} />
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground pl-11">
                  <span>{u.company}</span>
                  <span className="capitalize">{u.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Invite dialog */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join the partner portal.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input id="invite-email" type="email" placeholder="user@company.com" />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select defaultValue="partner">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-company">Company</Label>
              <Input id="invite-company" placeholder="Company name" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={() => { toast.success("Invitation sent"); setInviteOpen(false) }}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
