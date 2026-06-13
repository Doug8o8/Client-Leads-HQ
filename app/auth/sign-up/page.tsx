import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/AuthForm";
import { Panel } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Create account — Client Leads HQ",
};

export default function SignUpPage() {
  return (
    <Panel className="p-7 sm:p-9">
      <p className="editorial-label">Get started</p>
      <div className="rule-gold mt-3" />
      <h1 className="font-editorial mt-4 text-2xl font-semibold text-app">
        Create your workspace
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        A personal organization is created for you automatically — invite a team
        later.
      </p>
      <div className="mt-7">
        <AuthForm mode="sign-up" />
      </div>
    </Panel>
  );
}
