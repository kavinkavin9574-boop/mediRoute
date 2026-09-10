import { Link } from "@tanstack/react-router";
import { Activity, ShieldCheck } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary shadow-soft">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold tracking-tight">MediRoute AI</span>
            <span className="block text-[11px] text-muted-foreground">
              Find the right emergency care, faster.
            </span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-foreground" }}
          >
            Home
          </Link>
          <Link
            to="/search"
            className="rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Emergency Search
          </Link>
          <Link
            to="/results"
            className="hidden rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground sm:block"
            activeProps={{ className: "text-foreground" }}
          >
            Hospitals
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/70 bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-8 text-center text-xs text-muted-foreground">
        <p className="font-medium text-foreground">MediRoute AI — college project prototype</p>
        <p className="mx-auto mt-2 max-w-2xl">
          All hospital, bed and specialist data shown is simulated demo data. This prototype is for
          demonstration purposes and does not replace professional medical advice or emergency
          services. In a real emergency, call your local emergency number.
        </p>
      </div>
    </footer>
  );
}
