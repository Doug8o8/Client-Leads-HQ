"use client";

import { useSyncExternalStore } from "react";
import { getServerTheme, getTheme, setTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const theme = useSyncExternalStore(subscribeTheme, getTheme, getServerTheme);

  const toggle = () => setTheme(theme === "dark" ? "light" : "dark");

  if (compact) {
    return (
      <button
        onClick={toggle}
        aria-label="Toggle theme"
        className="grid h-9 w-9 place-items-center rounded-lg text-muted surface-1-hover hover:text-app"
      >
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      className="app-panel flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition hover:text-app"
      aria-label="Toggle theme"
    >
      <span className="flex items-center gap-2">
        {theme === "dark" ? <MoonIcon /> : <SunIcon />}
        {theme === "dark" ? "Dark mode" : "Light mode"}
      </span>
      <span className="relative h-5 w-9 rounded-full" style={{ backgroundColor: "var(--surface-1)" }}>
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-gold-soft transition-all",
            theme === "dark" ? "left-0.5" : "left-[18px]"
          )}
        />
      </span>
    </button>
  );
}
