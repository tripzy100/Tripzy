import { VehicleStatus, TransmissionType, FuelType } from "@prisma/client";

export interface VehicleSpecs {
  engineCapacity?: number;
  horsepower?: number;
  seats: number;
  doors: number;
  luggageCapacity?: number;
  hasAirConditioning: boolean;
  hasGps: boolean;
  hasBluetooth: boolean;
  hasAndroidAuto: boolean;
  hasAppleCarPlay: boolean;
  hasSunroof: boolean;
  hasCruiseControl: boolean;
  hasAbs: boolean;
  hasAirbags: boolean;
  isFastCharging?: boolean;
  rangeKm?: number;
}

export interface VehiclePricingRules {
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  monthlyRate: number;
  basePrice: number;
  securityDeposit: number;
  taxRate: number;
  extraKmCharge: number;
  lateReturnCharge: number;
  cleaningCharge: number;
}

export interface VehicleDocumentStatus {
  insuranceStatus: string;
  insuranceExpiry: Date;
  pollutionStatus: string;
  pollutionExpiry: Date;
  fitnessStatus: string;
  fitnessExpiry: Date;
  rcStatus: string;
}

export interface FleetVehicle {
  id: string;
  plateNumber: string;
  vin: string;
  brand: string;
  model: string;
  variant: string;
  year: number;
  color: string;
  transmission: TransmissionType;
  fuelType: FuelType;
  status: VehicleStatus;
  locationCity: string;
  mileage: number;
  specs: VehicleSpecs;
  pricing: VehiclePricingRules;
  documents: VehicleDocumentStatus;
}
