import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { Panel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Sign in — Client Leads HQ",
};

export default function SignInPage() {
  return (
    <Panel className="p-7 sm:p-9">
      <p className="editorial-label">Welcome back</p>
      <div className="rule-gold mt-3" />
      <h1 className="font-editorial mt-4 text-2xl font-semibold text-app">
        Sign in to your command center
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Pick up where you left off — your projects, leads, and reports.
      </p>
      <div className="mt-7">
        <AuthForm mode="sign-in" />
      </div>
    </Panel>
  );
}
