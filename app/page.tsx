import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ButtonLink } from "@/components/ui/primitives";

const FEATURES = [
  {
    title: "Find local leads",
    body: "Define your ICP and prospect signals once. Build a saved prospecting project around the businesses you actually want.",
  },
  {
    title: "Score them honestly",
    body: "Every lead is scored out of 100 across ICP fit, need, verification, decision-maker clarity, outreach, and risk.",
  },
  {
    title: "Verify the sources",
    body: "Confirmed facts, estimates, and AI inferences are clearly separated — so you never pitch on a guess you thought was a fact.",
  },
  {
    title: "Ship a premium report",
    body: "Turn the shortlist into an editorial, print-ready prospecting report your client would be impressed to receive.",
  },
];

export default function LandingPage() {
  return (
    <div className="theme-dark app-shell min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6">
        <Logo />
        <nav className="flex items-center gap-2">
          <Link
            href="/reports/proj_lonestar"
            className="hidden rounded-xl px-4 py-2.5 text-sm font-medium text-muted transition hover:text-white sm:inline-flex"
          >
            View sample report
          </Link>
          <ButtonLink href="/app" variant="secondary">
            Open the app
          </ButtonLink>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        {/* Hero */}
        <section className="relative pt-12 sm:pt-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-soft" />
            AI-powered local prospecting command center
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl">
            Find better local business leads.{" "}
            <span className="text-gold-gradient">Score them. Verify them.</span>{" "}
            Turn them into polished reports.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Client Leads HQ is the research command center for service
            businesses. Go from a target customer description to a verified,
            scored shortlist — and a consulting-grade prospecting report — in one
            clean workflow.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/app" variant="gold" className="px-5 py-3 text-base">
              Create a prospecting report →
            </ButtonLink>
            <ButtonLink
              href="/reports/proj_lonestar"
              variant="secondary"
              className="px-5 py-3 text-base"
            >
              See a sample report
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["100-pt", "Transparent scoring"],
              ["4 tiers", "Verification clarity"],
              ["CSV", "One-click export"],
              ["Print", "PDF-ready reports"],
            ].map(([big, small]) => (
              <div
                key={small}
                className="app-panel rounded-2xl px-4 py-5"
              >
                <p className="text-2xl font-semibold text-white">{big}</p>
                <p className="mt-1 text-xs text-muted">{small}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="mt-24 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="app-panel rounded-2xl p-6">
              <span className="text-sm font-semibold text-gold-soft">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-white">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {f.body}
              </p>
            </div>
          ))}
        </section>

        {/* Trust strip */}
        <section className="mt-20 app-panel rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <h2 className="text-2xl font-semibold text-white">
                Never pitch on a guess you thought was a fact.
              </h2>
              <p className="mt-3 text-sm text-muted">
                The whole product is built around one trust principle: confirmed
                facts, estimates, and AI inferences are always visibly different.
                Your reputation is on the line — the data should earn it.
              </p>
            </div>
            <ButtonLink href="/app" variant="primary" className="shrink-0">
              Open the command center
            </ButtonLink>
          </div>
        </section>

        <footer className="mt-20 border-t hairline py-10 text-sm text-faint">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p>Client Leads HQ — CLHQ · Phase 1 demo (mock data)</p>
            <p>Find better local business leads.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
