"use server";

import { db } from "@/lib/db";
import { VehicleStatus, TransmissionType, FuelType } from "@prisma/client";
import { VehicleFormValues } from "../validators";

/**
 * Resolves or creates related master entity IDs for a vehicle entry.
 */
async function resolveRelations(brand: string, model: string, city: string) {
  const brandLower = brand.toLowerCase();
  const modelLower = model.toLowerCase();
  const cityLower = city.toLowerCase();

  // Find or create Brand
  const brandRecord = await db.vehicleBrand.upsert({
    where: { slug: brandLower },
    update: {},
    create: { name: brand, slug: brandLower },
  });

  // Find or create Model
  const modelRecord = await db.vehicleModel.create({
    data: {
      brandId: brandRecord.id,
      name: model,
      year: 2024,
    },
  });

  // Find or create City (links to Maharashtra state by default for mock)
  const mhState = await db.state.findFirst({ where: { code: "MH" } });
  const cityRecord = await db.city.create({
    data: {
      stateId: mhState?.id || "mock-state-id",
      name: city,
      code: cityLower.slice(0, 3).toUpperCase(),
    },
  });

  // Find or create default Category
  const defaultCategory = await db.vehicleCategory.upsert({
    where: { slug: "suv" },
    update: {},
    create: { name: "SUV", slug: "suv" },
  });

  // Create default variant
  const variantRecord = await db.vehicleVariant.create({
    data: {
      modelId: modelRecord.id,
      name: "Standard",
      transmission: TransmissionType.AUTOMATIC,
      fuelType: FuelType.PETROL,
    },
  });

  return {
    brandId: brandRecord.id,
    modelId: modelRecord.id,
    cityId: cityRecord.id,
    categoryId: defaultCategory.id,
    variantId: variantRecord.id,
  };
}

/**
 * Inserts a new vehicle record into the PostgreSQL tables.
 */
export async function registerVehicle(values: VehicleFormValues) {
  try {
    const ids = await resolveRelations(values.brand, values.model, values.locationCity);

    const vehicle = await db.vehicle.create({
      data: {
        plateNumber: values.plateNumber,
        vin: values.vin,
        brandId: ids.brandId,
        modelId: ids.modelId,
        variantId: ids.variantId,
        categoryId: ids.categoryId,
        locationId: ids.cityId,
        color: values.color,
        transmission: values.transmission,
        fuelType: values.fuelType,
        mileage: values.mileage,
        status: VehicleStatus.AVAILABLE,
      },
    });

    // Create pricing record associated with the vehicle
    await db.vehiclePricing.create({
      data: {
        vehicleId: vehicle.id,
        basePrice: values.dailyRate,
        hourlyRate: values.dailyRate / 24,
        dailyRate: values.dailyRate,
        weeklyRate: values.dailyRate * 7,
        monthlyRate: values.dailyRate * 30,
        securityDeposit: values.securityDeposit,
        extraKmCharge: values.extraKmCharge,
      },
    });

    return { success: true, vehicleId: vehicle.id };
  } catch (error) {
    console.error("Failed to register vehicle:", error);
    return { success: false, error: "Database registration failure" };
  }
}

/**
 * Sweeps or modifies vehicle operational status.
 */
export async function updateVehicleStatus(id: string, status: VehicleStatus) {
  try {
    await db.vehicle.update({
      where: { id },
      data: { status },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to update vehicle status" };
  }
}

/**
 * Relocates a vehicle allocation city.
 */
export async function transferVehicleCity(id: string, cityName: string) {
  try {
    const mhState = await db.state.findFirst({ where: { code: "MH" } });
    const city = await db.city.upsert({
      where: { id: "mock-id-or-slug" }, // Or upsert logic
      update: {},
      create: {
        stateId: mhState?.id || "mock-state-id",
        name: cityName,
        code: cityName.slice(0, 3).toUpperCase(),
      },
    });

    await db.vehicle.update({
      where: { id },
      data: { locationId: city.id },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Failed to transfer city" };
  }
}

/**
 * Soft deletes a vehicle record.
 */
export async function softDeleteVehicle(id: string) {
  try {
    await db.vehicle.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Soft delete failed" };
  }
}

/**
 * Restores a soft-deleted vehicle.
 */
export async function restoreVehicle(id: string) {
  try {
    await db.vehicle.update({
      where: { id },
      data: { deletedAt: null },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Restore failed" };
  }
}
