"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Panel } from "@/components/ui/primitives";
import { createProject } from "@/lib/store/store";
import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, title: "Business profile", hint: "Who you are" },
  { id: 2, title: "Target customer", hint: "Who you want" },
  { id: 3, title: "Prospect signals", hint: "What good looks like" },
  { id: 4, title: "Report settings", hint: "What you'll ship" },
];

interface FormState {
  businessName: string;
  website: string;
  industry: string;
  location: string;
  targetDescription: string;
  idealIndustries: string;
  companySize: string;
  geography: string;
  idealSignals: string;
  badFitSignals: string;
  services: string;
  reportName: string;
  goal: string;
  leadsDesired: number;
}

const INITIAL: FormState = {
  businessName: "Lone Star Legacy Insurance",
  website: "https://lonestarlegacy.example.com",
  industry: "Life & business insurance",
  location: "Austin, TX",
  targetDescription:
    "Owner-operated small businesses with partners, key employees, or recent loans that create continuity exposure.",
  idealIndustries: "Specialty trades, Professional services, Manufacturing, Multi-location retail",
  companySize: "8–75 employees",
  geography: "Greater Austin & Central Texas",
  idealSignals:
    "2+ owners, named key employee, recent SBA/commercial loan, 5+ years in business",
  badFitSignals: "Solo gig, national franchise, pre-revenue startup, in-house benefits team",
  services: "Key person insurance, Buy-sell funding, Loan protection, Owner & executive life",
  reportName: "Central Texas SMB Prospecting Report — Q2",
  goal: "Identify 10 high-fit owner-led businesses to approach for key-person and buy-sell coverage.",
  leadsDesired: 10,
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-app">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-faint">{hint}</span>}
      <div className="mt-2">{children}</div>
    </label>
  );
}

const inputCls =
  "app-input w-full rounded-xl px-3.5 py-2.5 text-sm transition";

function toList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function NewProjectWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const finish = () => {
    setSubmitting(true);
    // Persist the project locally and route to its command center.
    // It's seeded with a starter set of demo leads so the full workflow
    // (leads → report → CSV) is immediately explorable.
    const id = createProject({
      business: {
        businessName: form.businessName,
        website: form.website,
        industry: form.industry,
        location: form.location,
      },
      target: {
        description: form.targetDescription,
        idealIndustries: toList(form.idealIndustries),
        companySize: form.companySize,
        geography: form.geography,
      },
      signals: {
        idealSignals: toList(form.idealSignals),
        badFitSignals: toList(form.badFitSignals),
        services: toList(form.services),
      },
      report: {
        reportName: form.reportName,
        goal: form.goal,
        leadsDesired: form.leadsDesired,
      },
    });
    router.push(`/app/projects/${id}`);
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-gold-soft">
          New prospecting project
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-app sm:text-3xl">
          Set up your research
        </h1>
        <p className="mt-2 text-sm text-muted">
          Tell the command center who you are and who you&apos;re after. This
          demo is pre-filled with a Texas life-insurance scenario — edit freely.
        </p>
      </div>

      {/* Stepper */}
      <ol className="mb-8 grid grid-cols-4 gap-2">
        {STEPS.map((s) => {
          const state =
            s.id === step ? "active" : s.id < step ? "done" : "todo";
          return (
            <li key={s.id} className="flex flex-col gap-2">
              <div
                className={cn(
                  "h-1 rounded-full",
                  state === "todo" ? "bg-[color:var(--line)]" : "bg-gold-soft"
                )}
              />
              <div>
                <p
                  className={cn(
                    "text-xs font-semibold",
                    state === "active"
                      ? "text-app"
                      : state === "done"
                      ? "text-gold-soft"
                      : "text-faint"
                  )}
                >
                  {s.id}. {s.title}
                </p>
                <p className="hidden text-[11px] text-faint sm:block">
                  {s.hint}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <Panel className="p-6 sm:p-8">
        {step === 1 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Business name">
              <input className={inputCls} value={form.businessName} onChange={(e) => set("businessName", e.target.value)} />
            </Field>
            <Field label="Website">
              <input className={inputCls} value={form.website} onChange={(e) => set("website", e.target.value)} />
            </Field>
            <Field label="Industry">
              <input className={inputCls} value={form.industry} onChange={(e) => set("industry", e.target.value)} />
            </Field>
            <Field label="Location">
              <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-5">
            <Field label="Target customer description">
              <textarea rows={3} className={inputCls} value={form.targetDescription} onChange={(e) => set("targetDescription", e.target.value)} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Ideal industries" hint="Comma-separated">
                <input className={inputCls} value={form.idealIndustries} onChange={(e) => set("idealIndustries", e.target.value)} />
              </Field>
              <Field label="Company size">
                <input className={inputCls} value={form.companySize} onChange={(e) => set("companySize", e.target.value)} />
              </Field>
            </div>
            <Field label="Geography">
              <input className={inputCls} value={form.geography} onChange={(e) => set("geography", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-5">
            <Field label="Ideal prospect signals" hint="What makes a great fit — comma-separated">
              <textarea rows={2} className={inputCls} value={form.idealSignals} onChange={(e) => set("idealSignals", e.target.value)} />
            </Field>
            <Field label="Bad-fit signals" hint="Disqualifiers — comma-separated">
              <textarea rows={2} className={inputCls} value={form.badFitSignals} onChange={(e) => set("badFitSignals", e.target.value)} />
            </Field>
            <Field label="Services being sold" hint="Comma-separated">
              <textarea rows={2} className={inputCls} value={form.services} onChange={(e) => set("services", e.target.value)} />
            </Field>
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-5">
            <Field label="Report name">
              <input className={inputCls} value={form.reportName} onChange={(e) => set("reportName", e.target.value)} />
            </Field>
            <Field label="Goal of the report">
              <textarea rows={2} className={inputCls} value={form.goal} onChange={(e) => set("goal", e.target.value)} />
            </Field>
            <Field label="Number of leads desired">
              <input
                type="number"
                min={1}
                max={50}
                className={cn(inputCls, "max-w-[140px]")}
                value={form.leadsDesired}
                onChange={(e) => set("leadsDesired", Number(e.target.value))}
              />
            </Field>

            <div className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-sm text-gold-soft">
              This project will be saved locally in your browser and seeded with
              a starter set of demo leads, so you can explore the full leads →
              report → export flow right away.
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between border-t hairline pt-6">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            ← Back
          </Button>
          {step < 4 ? (
            <Button variant="primary" onClick={next}>
              Continue →
            </Button>
          ) : (
            <Button variant="gold" onClick={finish} disabled={submitting}>
              {submitting ? "Opening…" : "Finish & open project"}
            </Button>
          )}
        </div>
      </Panel>
    </div>
  );
}
