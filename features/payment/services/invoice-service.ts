import { db } from "@/lib/db";
import { InvoiceStatus } from "@prisma/client";

/**
 * Generates an Invoice record in PostgreSQL for a completed booking transaction.
 * Accepts an optional Prisma transaction client (`dbClient`) to ensure atomic rollback.
 */
export async function createInvoice(bookingId: string, discount = 0, dbClient: any = db) {
  const booking = await dbClient.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) throw new Error("Booking not found");

  const subtotal = Number(booking.totalAmount);
  const tax = Number(booking.taxAmount);
  const total = subtotal + tax - discount + Number(booking.securityDeposit);

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${booking.bookingNumber}`;

  const invoice = await dbClient.invoice.create({
    data: {
      invoiceNumber,
      bookingId,
      subtotal,
      discount,
      tax,
      total,
      status: InvoiceStatus.PAID,
    },
  });

  return invoice;
}
export type CreateInvoiceType = typeof createInvoice;
