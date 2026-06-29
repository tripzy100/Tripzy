import { z } from "zod";
import { VehicleStatus, TransmissionType, FuelType } from "@prisma/client";

export const vehicleFormSchema = z.object({
  plateNumber: z.string().min(6, "Plate number must be at least 6 characters").max(12),
  vin: z.string().min(17, "VIN must be exactly 17 characters").max(17),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().min(1, "Variant is required"),
  year: z.coerce.number().int().min(2010).max(new Date().getFullYear() + 1),
  color: z.string().min(1, "Color is required"),
  transmission: z.nativeEnum(TransmissionType),
  fuelType: z.nativeEnum(FuelType),
  mileage: z.coerce.number().int().nonnegative(),
  locationCity: z.string().min(1, "City location is required"),
  seats: z.coerce.number().int().min(2).max(10),
  doors: z.coerce.number().int().min(2).max(6),
  dailyRate: z.coerce.number().positive("Daily rate must be positive"),
  securityDeposit: z.coerce.number().nonnegative(),
  extraKmCharge: z.coerce.number().nonnegative(),
});

export type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export const csvRowSchema = z.object({
  plateNumber: z.string().min(6).max(12),
  vin: z.string().min(17).max(17),
  brand: z.string(),
  model: z.string(),
  variant: z.string(),
  year: z.coerce.number().int(),
  color: z.string(),
  transmission: z.nativeEnum(TransmissionType),
  fuelType: z.nativeEnum(FuelType),
  mileage: z.coerce.number().int(),
  locationCity: z.string(),
  seats: z.coerce.number().int(),
  doors: z.coerce.number().int(),
  dailyRate: z.coerce.number(),
  securityDeposit: z.coerce.number(),
  extraKmCharge: z.coerce.number(),
});

export const searchFilterSchema = z.object({
  brand: z.string().optional(),
  city: z.string().optional(),
  fuelType: z.nativeEnum(FuelType).optional(),
  transmission: z.nativeEnum(TransmissionType).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  seats: z.coerce.number().optional(),
  status: z.nativeEnum(VehicleStatus).optional(),
});

export type SearchFilters = z.infer<typeof searchFilterSchema>;
