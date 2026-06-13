import { ButtonLink } from "@/components/ui/primitives";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="mt-10 text-sm font-semibold uppercase tracking-[0.22em] text-gold-soft">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-white">
        We couldn&apos;t find that page
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted">
        The project or report you&apos;re looking for doesn&apos;t exist in this
        demo workspace.
      </p>
      <div className="mt-8 flex gap-3">
        <ButtonLink href="/app" variant="gold">
          Go to dashboard
        </ButtonLink>
        <ButtonLink href="/" variant="secondary">
          Back home
        </ButtonLink>
      </div>
    </div>
  );
}
