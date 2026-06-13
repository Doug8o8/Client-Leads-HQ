"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/app", label: "Dashboard", icon: "grid" },
  { href: "/app/projects/new", label: "New project", icon: "plus" },
  { href: "/app/settings", label: "Settings", icon: "cog" },
];

function NavIcon({ name }: { name: string }) {
  const common = "h-[18px] w-[18px]";
  switch (name) {
    case "grid":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );
    case "plus":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 5v14M5 12h14" strokeLinecap="round" />
        </svg>
      );
    case "cog":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-2.82 1.17V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15H4a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 6 9.4l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 11 4.6V4a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 2.99.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 21.4 11H21a2 2 0 1 1 0 4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell min-h-screen">
      <div className="mx-auto flex max-w-[1400px] gap-0 lg:gap-8 lg:px-6">
        {/* Sidebar (desktop) */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col py-6 lg:flex">
          <Logo />
          <nav className="mt-10 flex flex-col gap-1">
            {NAV.map((item) => {
              const active =
                item.href === "/app"
                  ? pathname === "/app"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    active
                      ? "surface-1 text-app ring-app"
                      : "text-muted surface-1-hover hover:text-app"
                  )}
                >
                  <span className={cn(active ? "text-accent-gold" : "text-faint group-hover:text-muted")}>
                    <NavIcon name={item.icon} />
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            <ThemeToggle />
            <div className="app-panel rounded-2xl p-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <p className="text-xs font-semibold text-app">Demo Mode</p>
              </div>
              <p className="mt-1.5 text-xs text-muted">
                Saved locally in this browser. No account or API needed.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Mobile top bar */}
          <header
            className="sticky top-0 z-20 flex items-center justify-between border-b hairline px-4 py-3 backdrop-blur lg:hidden"
            style={{ backgroundColor: "var(--mobilebar-bg)" }}
          >
            <Logo compact />
            <nav className="flex items-center gap-1">
              <ThemeToggle compact />
              {NAV.map((item) => {
                const active =
                  item.href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-lg",
                      active ? "surface-1 text-accent-gold" : "text-muted"
                    )}
                  >
                    <NavIcon name={item.icon} />
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-0 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
