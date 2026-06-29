"use client";

import { useEffect } from "react";
import { AlertOctagon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error boundary caught error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <main className="mx-auto flex max-w-md flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
          <AlertOctagon className="h-8 w-8" />
        </div>

        <span className="mt-6 text-xs font-semibold uppercase tracking-wider text-destructive">
          500 Error
        </span>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Internal Server Error
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          An error occurred on our servers while processing this page. Please try again.
        </p>

        {error.digest && (
          <code className="mt-4 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
            Digest: {error.digest}
          </code>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => reset()} variant="default" size="lg">
            Try Again
          </Button>
          <Button onClick={() => window.location.assign("/")} variant="outline" size="lg">
            Go Home
          </Button>
        </div>
      </main>
    </div>
  );
}
