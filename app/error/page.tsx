import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageProps {
  searchParams: Promise<{ code?: string }>;
}

export default async function ErrorPage({ searchParams }: PageProps) {
  const { code } = await searchParams;
  const title = code === "FORBIDDEN" ? "Access Denied" : "Something went wrong";
  const message =
    code === "FORBIDDEN"
      ? "You do not have the required permissions to access this page."
      : "An unexpected error occurred. Please try again later.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
      <main className="mx-auto flex max-w-md flex-col items-center justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive ring-8 ring-destructive/5">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <span className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {code || "Error"}
        </span>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{message}</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/">
            <Button variant="default" size="lg">
              Back to Home
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
