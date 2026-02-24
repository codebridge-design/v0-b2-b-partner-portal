"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Package,
  FileText,
  TicketIcon,
  Users,
  ShieldCheck,
  ClipboardList,
  X,
} from "lucide-react"

const partnerNav = [
  { label: "Dashboard", href: "/app/dashboard", icon: LayoutDashboard },
  { label: "Catalog", href: "/app/catalog", icon: Package },
  { label: "Requests", href: "/app/requests", icon: FileText },
  { label: "Tickets", href: "/app/tickets", icon: TicketIcon },
]

const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Requests", href: "/admin/requests", icon: ClipboardList },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Products", href: "/admin/products", icon: Package },
]

interface AppSidebarProps {
  section: "partner" | "admin"
  open: boolean
  onClose: () => void
}

export function AppSidebar({ section, open, onClose }: AppSidebarProps) {
  const pathname = usePathname()
  const nav = section === "admin" ? adminNav : partnerNav

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-6">
          <Link href="/" className="text-base font-semibold tracking-tight text-sidebar-foreground">
            PartnerFlow
          </Link>
          <button onClick={onClose} className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section label */}
        <div className="px-6 pt-6 pb-2">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {section === "admin" ? "Admin" : "Partner Portal"}
          </span>
        </div>

        {/* Nav items */}
        <nav className="flex-1 space-y-1 px-3">
          {nav.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Switch section */}
        <div className="border-t border-sidebar-border p-4">
          <Link
            href={section === "admin" ? "/app/dashboard" : "/admin/dashboard"}
            className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2.5 text-xs font-medium text-sidebar-accent-foreground transition-colors hover:bg-sidebar-accent/80"
          >
            <ShieldCheck className="h-4 w-4" />
            Switch to {section === "admin" ? "Partner Portal" : "Admin Area"}
          </Link>
        </div>
      </aside>
    </>
  )
}
