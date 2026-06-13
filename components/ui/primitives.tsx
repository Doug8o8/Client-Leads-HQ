import Link from "next/link";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("app-panel rounded-2xl shadow-panel", className)}>
      {children}
    </div>
  );
}

export function PageHeader({
  kicker,
  title,
  subtitle,
  actions,
}: {
  kicker?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {kicker && (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-soft">
            {kicker}
          </p>
        )}
        <h1 className="text-2xl font-semibold tracking-tight text-app sm:text-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm text-muted">{subtitle}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: "gold" | "electric" | "emerald" | "default";
}) {
  const accentText =
    accent === "gold"
      ? "text-gold-soft"
      : accent === "electric"
      ? "text-electric-soft"
      : accent === "emerald"
      ? "text-emerald-300"
      : "text-app";
  return (
    <Panel className="p-5">
      <p className="text-xs font-medium uppercase tracking-wider text-faint">
        {label}
      </p>
      <p className={cn("mt-3 text-3xl font-semibold tabular-nums", accentText)}>
        {value}
      </p>
      {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
    </Panel>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost" | "gold";

const BUTTON_STYLES: Record<ButtonVariant, string> = {
  primary:
    "bg-electric text-white hover:bg-electric-soft shadow-[0_10px_30px_-10px_rgba(61,139,255,0.7)]",
  gold: "bg-gradient-to-br from-gold-soft to-gold-deep text-ink-950 hover:brightness-105 shadow-[0_10px_30px_-10px_rgba(201,162,75,0.7)]",
  secondary: "surface-1 text-app ring-app surface-1-hover",
  ghost: "text-muted hover:text-app surface-1-hover",
};

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed";

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  target,
}: {
  href: string;
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  target?: string;
}) {
  return (
    <Link
      href={href}
      target={target}
      className={cn(BUTTON_BASE, BUTTON_STYLES[variant], className)}
    >
      {children}
    </Link>
  );
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={cn(BUTTON_BASE, BUTTON_STYLES[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
