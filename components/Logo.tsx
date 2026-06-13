import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  href = "/",
  compact = false,
  className,
}: {
  href?: string;
  compact?: boolean;
  className?: string;
}) {
  return (
    <Link href={href} className={cn("group inline-flex items-center gap-3", className)}>
      <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-gold-soft to-gold-deep text-ink-950 shadow-[0_8px_24px_-8px_rgba(201,162,75,0.7)]">
        <span className="text-[13px] font-black tracking-tight">CL</span>
        <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-md bg-ink-900 text-[8px] font-bold text-accent-gold ring-1 ring-gold/40">
          HQ
        </span>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-app">
            Client Leads HQ
          </span>
          <span className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-faint">
            Prospecting Command
          </span>
        </span>
      )}
    </Link>
  );
}
