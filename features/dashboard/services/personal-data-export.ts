import { db } from "@/lib/db";

/**
 * Compiles privacy compliance report containing profile, reservation, and ledger records.
 */
export async function exportPersonalData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      wallet: {
        include: { transactions: true },
      },
      bookings: {
        include: {
          vehicle: {
            select: { brand: { select: { name: true } }, model: { select: { name: true } } },
          },
        },
      },
    },
  });

  if (!user) throw new Error("User record not found");

  return {
    exportDate: new Date(),
    profile: {
      email: user.email,
      phone: user.phone,
      isKycVerified: user.isKycVerified,
      details: user.profile,
    },
    wallet: user.wallet,
    bookings: user.bookings,
  };
}
export type ExportPersonalDataType = typeof exportPersonalData;
