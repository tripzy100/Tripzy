import { db } from "@/lib/db";

/**
 * Recommends vehicles from the catalog based on past booking histories.
 */
export async function recommendPersonalizedTravel(userId: string) {
  try {
    // 1. Fetch user past bookings to determine category preferences
    const pastBookings = await db.booking.findMany({
      where: { userId },
      include: {
        vehicle: {
          include: { category: true },
        },
      },
      take: 5,
    });

    const isSuvFan = pastBookings.some((b) => b.vehicle?.category?.name === "SUV");

    // 2. Lookup a corresponding vehicle to recommend using AVAILABLE status
    const recommendVehicle = await db.vehicle.findFirst({
      where: {
        category: isSuvFan ? { name: "SUV" } : undefined,
        status: "AVAILABLE",
      },
      include: {
        brand: true,
        model: true,
      },
    });

    if (!recommendVehicle) return { success: false, reason: "No matching vehicles available" };

    return {
      success: true,
      vehicleId: recommendVehicle.id,
      vehicleName: `${recommendVehicle.brand.name} ${recommendVehicle.model.name}`,
      reason: isSuvFan
        ? "Recommended because you enjoy driving comfortable SUVs for roadtrips."
        : "Recommended based on popular choices in your city.",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export type RecommendPersonalizedTravelType = typeof recommendPersonalizedTravel;
