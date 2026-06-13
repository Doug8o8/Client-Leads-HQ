import Link from "next/link";

export function ReportLoading() {
  return (
    <div className="report-root flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[#8a7e64]">
        <span className="report-serif grid h-12 w-12 animate-pulse place-items-center rounded-xl bg-[#16243f] text-[15px] font-bold text-[#f1d99a]">
          CL
        </span>
        <p className="text-sm font-medium">Preparing your report…</p>
      </div>
    </div>
  );
}

export function ReportNotFound() {
  return (
    <div className="report-root flex min-h-screen items-center justify-center px-6">
      <div className="report-panel max-w-md px-8 py-10 text-center">
        <p className="report-kicker">Report unavailable</p>
        <h1 className="report-serif mt-3 text-2xl font-semibold text-[#16243f]">
          We couldn&apos;t find this report
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#44506b]">
          This report&apos;s project isn&apos;t saved in this browser. Demo data
          lives locally on each device — open the project from the command
          center that created it.
        </p>
        <Link
          href="/app"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#16243f] px-4 py-2 text-sm font-semibold text-[#faf6ec] transition hover:bg-[#1f3157]"
        >
          Back to command center
        </Link>
      </div>
    </div>
  );
}
