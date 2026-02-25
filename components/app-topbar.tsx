"use client"

import { useState } from "react"
import { Bell, Menu, Search, LogOut, FileText, TicketCheck, UserPlus, Settings, Check } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const notifications = [
  {
    id: "n1",
    type: "request" as const,
    title: "New request submitted",
    detail: "RQ-2024-005 from Cobalt Supply Chain - $8,920 (Urgent)",
    timestamp: "2025-01-03T10:20:00Z",
    read: false,
    href: "/app/requests",
  },
  {
    id: "n2",
    type: "ticket" as const,
    title: "Ticket requires attention",
    detail: "TK-4201 - Invoice discrepancy on order #ORD-8812",
    timestamp: "2025-01-03T14:00:00Z",
    read: false,
    href: "/app/tickets",
  },
  {
    id: "n3",
    type: "request" as const,
    title: "Request approved",
    detail: "RQ-2024-001 from Meridian Manufacturing has been approved",
    timestamp: "2025-01-03T16:30:00Z",
    read: false,
    href: "/app/requests",
  },
  {
    id: "n4",
    type: "user" as const,
    title: "New partner invited",
    detail: "Michael Torres from Horizon Fabrication Ltd joined the portal",
    timestamp: "2025-01-02T15:00:00Z",
    read: true,
    href: "/admin/users",
  },
  {
    id: "n5",
    type: "request" as const,
    title: "Request rejected",
    detail: "RQ-2024-004 from Vanguard Engineering - below cost threshold",
    timestamp: "2025-01-02T11:30:00Z",
    read: true,
    href: "/app/requests",
  },
  {
    id: "n6",
    type: "system" as const,
    title: "Catalog updated",
    detail: "12 product prices updated for Q1 2025",
    timestamp: "2024-12-30T16:00:00Z",
    read: true,
    href: "/app/catalog",
  },
]

const typeIcon: Record<string, React.ReactNode> = {
  request: <FileText className="h-4 w-4" />,
  ticket: <TicketCheck className="h-4 w-4" />,
  user: <UserPlus className="h-4 w-4" />,
  system: <Settings className="h-4 w-4" />,
}

const typeBg: Record<string, string> = {
  request: "bg-primary/15 text-primary",
  ticket: "bg-warning/15 text-warning",
  user: "bg-chart-2/15 text-chart-2",
  system: "bg-muted text-muted-foreground",
}

interface AppTopbarProps {
  title: string
  onMenuClick: () => void
}

export function AppTopbar({ title, onMenuClick }: AppTopbarProps) {
  const [items, setItems] = useState(notifications)
  const unreadCount = items.filter((n) => !n.read).length

  function markAllRead() {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  function markRead(id: string) {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-md px-6">
      <button
        onClick={onMenuClick}
        className="rounded-md p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      <h2 className="text-sm font-semibold text-foreground truncate">{title}</h2>

      <div className="ml-auto flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            className="w-56 pl-9 h-9 bg-secondary border-0 text-sm"
          />
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-9 w-9" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96 p-0">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <Check className="h-3 w-3" />
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {items.map((n) => (
                <DropdownMenuItem key={n.id} asChild className="p-0 focus:bg-transparent">
                  <Link
                    href={n.href}
                    onClick={() => markRead(n.id)}
                    className="flex items-start gap-3 px-4 py-3 border-b border-border/50 hover:bg-secondary/50 transition-colors w-full cursor-pointer"
                  >
                    <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeBg[n.type]}`}>
                      {typeIcon[n.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm leading-tight ${n.read ? "text-muted-foreground" : "font-medium text-foreground"}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground truncate">{n.detail}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground/70">
                        {formatDate(n.timestamp, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}
            </div>
            {unreadCount === 0 && (
              <div className="px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">All caught up</p>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-9 rounded-full p-0">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-foreground text-xs font-medium">DP</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">David Park</p>
              <p className="text-xs text-muted-foreground">d.park@internal.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/app/dashboard">Partner Portal</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/admin/dashboard">Admin Area</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login" className="flex items-center gap-2">
                <LogOut className="h-3.5 w-3.5" />
                Sign Out
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
