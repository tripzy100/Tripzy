import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <main className="mx-auto flex max-w-md flex-col items-center justify-center">
        {/* Animated compass frame */}
        <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-muted/40 text-muted-foreground ring-8 ring-muted/10">
          <Compass className="h-8 w-8" />
        </div>

        <span className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          404 Error
        </span>

        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Page not found
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          We couldn't find the page you're looking for. It might have been moved, deleted, or never
          existed in the first place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button variant="default" size="lg">
              Back to Dashboard
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="outline" size="lg">
              Contact Support
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
