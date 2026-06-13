import { ButtonLink } from "@/components/ui/primitives";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <Logo />
      <p className="editorial-label mt-10">404</p>
      <h1 className="font-editorial mt-3 text-3xl font-semibold text-app">
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
