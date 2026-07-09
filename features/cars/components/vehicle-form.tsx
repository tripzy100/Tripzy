"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { vehicleFormSchema, type VehicleFormValues } from "../validators";
import { registerVehicle } from "../actions/cars-actions";
import { useToast } from "@/providers/app-provider";

interface VehicleFormProps {
  onSuccess: () => void;
}

export function VehicleForm({ onSuccess }: VehicleFormProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      transmission: "AUTOMATIC",
      fuelType: "PETROL",
      seats: 5,
      doors: 4,
    },
  });

  const onSubmit = async (data: VehicleFormValues) => {
    setLoading(true);
    const result = await registerVehicle(data);
    setLoading(false);

    if (result.success) {
      showToast("Vehicle registered successfully", "success");
      reset();
      onSuccess();
    } else {
      showToast(result.error || "Failed to register vehicle", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Plate & VIN */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Plate Number
          </label>
          <input
            {...register("plateNumber")}
            placeholder="KA-03-HA-1234"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.plateNumber && (
            <p className="mt-1 text-xs text-destructive">{errors.plateNumber.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            VIN (17 chars)
          </label>
          <input
            {...register("vin")}
            placeholder="17-character VIN"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.vin && <p className="mt-1 text-xs text-destructive">{errors.vin.message}</p>}
        </div>

        {/* Brand & Model */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Brand
          </label>
          <input
            {...register("brand")}
            placeholder="Mahindra"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.brand && <p className="mt-1 text-xs text-destructive">{errors.brand.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Model
          </label>
          <input
            {...register("model")}
            placeholder="Thar"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.model && <p className="mt-1 text-xs text-destructive">{errors.model.message}</p>}
        </div>

        {/* Variant & Year */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Variant
          </label>
          <input
            {...register("variant")}
            placeholder="LX Hard Top"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.variant && (
            <p className="mt-1 text-xs text-destructive">{errors.variant.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Year
          </label>
          <input
            type="number"
            {...register("year")}
            placeholder="2024"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.year && <p className="mt-1 text-xs text-destructive">{errors.year.message}</p>}
        </div>

        {/* Color & Mileage */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Color
          </label>
          <input
            {...register("color")}
            placeholder="Red"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.color && <p className="mt-1 text-xs text-destructive">{errors.color.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            City Location
          </label>
          <input
            {...register("locationCity")}
            placeholder="Ranchi"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.locationCity && (
            <p className="mt-1 text-xs text-destructive">{errors.locationCity.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-2">
        {/* Daily Price, Deposit, Extra Charge */}
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Daily Rate
          </label>
          <input
            type="number"
            {...register("dailyRate")}
            placeholder="2500"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.dailyRate && (
            <p className="mt-1 text-xs text-destructive">{errors.dailyRate.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Security Deposit
          </label>
          <input
            type="number"
            {...register("securityDeposit")}
            placeholder="5000"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.securityDeposit && (
            <p className="mt-1 text-xs text-destructive">{errors.securityDeposit.message}</p>
          )}
        </div>

        <div>
          <label className="mb-1 block text-xs font-semibold uppercase text-muted-foreground">
            Extra Km Charge
          </label>
          <input
            type="number"
            {...register("extraKmCharge")}
            placeholder="15"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none"
          />
          {errors.extraKmCharge && (
            <p className="mt-1 text-xs text-destructive">{errors.extraKmCharge.message}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end border-t border-border pt-4">
        <Button type="submit" isLoading={loading}>
          <Plus className="mr-1.5 h-4 w-4" /> Add to Cars
        </Button>
      </div>
    </form>
  );
}
