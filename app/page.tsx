import Link from "next/link"
import { ArrowRight, FileText, Package, TicketIcon, ShieldCheck, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: FileText,
    title: "Quote Requests",
    description: "Submit and track quote requests with real-time status updates and approval workflows.",
  },
  {
    icon: Package,
    title: "Product Catalog",
    description: "Browse the full product catalog with live pricing, stock levels, and detailed specifications.",
  },
  {
    icon: TicketIcon,
    title: "Support Tickets",
    description: "Create and manage support tickets with priority routing and resolution tracking.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Review",
    description: "Streamlined admin tools for request approvals, user management, and catalog operations.",
  },
]

const steps = [
  { step: "01", title: "Browse Catalog", description: "Explore products with real-time pricing and availability." },
  { step: "02", title: "Submit Request", description: "Create detailed quote requests with your specific requirements." },
  { step: "03", title: "Get Approved", description: "Receive fast approvals and start your order fulfillment." },
]

const trustLabels = ["ISO 9001 Certified", "Enterprise-Grade Security", "99.9% Uptime SLA", "24/7 Support"]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="text-lg font-semibold tracking-tight text-foreground">
            PartnerFlow
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/login">
                Open Demo
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-24 pb-20 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground">
            B2B Partner Portal
            <ChevronRight className="h-3 w-3" />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            Streamline your partner operations
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground text-pretty">
            A unified platform for managing quote requests, product catalogs, and support workflows. Built for teams that move fast.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">
                Open Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
            >
              <div className="mb-4 inline-flex rounded-lg bg-secondary p-2.5">
                <f.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">How it works</h2>
            <p className="mt-3 text-muted-foreground">Three simple steps to get started</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
                  <span className="text-sm font-semibold text-primary">{s.step}</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustLabels.map((label) => (
              <span key={label} className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl text-balance">
            Ready to streamline your workflow?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Get started with the partner portal demo and explore the full feature set.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">PartnerFlow &middot; Portfolio Demo</span>
          <span className="text-xs text-muted-foreground">Built with Next.js & shadcn/ui</span>
        </div>
      </footer>
    </div>
  )
}
