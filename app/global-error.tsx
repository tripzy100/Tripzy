"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception to remote capture system (e.g. Sentry)
    console.error("Global crash captured:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground font-sans antialiased">
        <main className="mx-auto flex max-w-md flex-col items-center justify-center p-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="mt-6 font-display text-2xl font-bold tracking-tight">
            System failure encountered
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            A fundamental system runtime error occurred. Our engineering team has been notified.
            Please try resetting the application.
          </p>
          {error.digest && (
            <code className="mt-4 rounded bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
              ID: {error.digest}
            </code>
          )}
          <div className="mt-8 flex gap-4">
            <Button onClick={() => reset()} variant="default" size="lg">
              Reset Session
            </Button>
            <Button onClick={() => window.location.assign("/")} variant="outline" size="lg">
              Return Home
            </Button>
          </div>
        </main>
      </body>
    </html>
  );
}
