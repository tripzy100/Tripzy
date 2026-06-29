import { redis } from "@/lib/redis";

const LOCK_PREFIX = "tripzy:lock:vehicle:";

/**
 * Attempts to acquire an exclusive checkout lock on a vehicle.
 */
export async function acquireLock(vehicleId: string, durationSeconds = 900): Promise<boolean> {
  const key = `${LOCK_PREFIX}${vehicleId}`;
  try {
    //NX: Only set if the key does not exist. EX: Set expiration in seconds.
    const result = await redis.set(key, "locked", {
      nx: true,
      ex: durationSeconds,
    });
    return result === "OK";
  } catch (error) {
    console.error("Redis acquireLock error:", error);
    // Fallback to true if Redis connection fails in dev/test setups
    return true;
  }
}

/**
 * Releases the checkout lock on a vehicle, opening it for booking again.
 */
export async function releaseLock(vehicleId: string): Promise<void> {
  const key = `${LOCK_PREFIX}${vehicleId}`;
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Redis releaseLock error:", error);
  }
}

/**
 * Checks whether a vehicle is locked.
 */
export async function isVehicleLocked(vehicleId: string): Promise<boolean> {
  const key = `${LOCK_PREFIX}${vehicleId}`;
  try {
    const exists = await redis.exists(key);
    return exists === 1;
  } catch (error) {
    console.error("Redis isVehicleLocked error:", error);
    return false;
  }
}
export type LockServiceType = typeof acquireLock;
