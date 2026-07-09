import Link from "next/link";
import { db } from "@/lib/db";
import { Clock, CalendarRange } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function CustomerBookingsPage() {
  const user = await db.user.findFirst({
    include: {
      bookings: {
        orderBy: { createdAt: "desc" },
        include: {
          vehicle: { include: { brand: true, model: true } },
          invoices: true,
        },
      },
    },
  });

  if (!user) {
    return <div className="text-sm text-muted-foreground">Session expired. Please seed.</div>;
  }

  const bookings = user.bookings;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          My Rental Directory
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review details of upcoming bookings, trip extensions, and invoice downloads.
        </p>
      </div>

      <div className="grid gap-4">
        {bookings.length > 0 ? (
          bookings.map((b: any) => (
            <div
              key={b.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-card/30 p-6 sm:flex-row sm:items-center"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      b.status === "CONFIRMED"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" /> {b.bookingNumber}
                  </span>
                </div>
                <h3 className="font-display text-base font-semibold text-foreground">
                  {b.vehicle.brand.name} {b.vehicle.model.name}
                </h3>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CalendarRange className="h-3.5 w-3.5" />
                  <span>
                    {new Date(b.pickupDate).toLocaleDateString()} to{" "}
                    {new Date(b.returnDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Link href={`/bookings/${b.id}`}>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </Link>
                {b.invoices && b.invoices.length > 0 && (
                  <Link href={`/bookings/${b.id}`}>
                    <Button size="sm" variant="ghost">
                      Invoice
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-xs text-muted-foreground">
            No booking reservations logged. Try checking out availability in the car catalog.
          </div>
        )}
      </div>
    </div>
  );
}
export type CustomerBookingsPagePropsType = typeof CustomerBookingsPage;
