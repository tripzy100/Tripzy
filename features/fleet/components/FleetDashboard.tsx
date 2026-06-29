"use client";

import * as React from "react";
import { Plus, Upload, Trash2, RefreshCw, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { VehicleForm } from "./vehicle-form";
import { CsvImporter } from "./csv-importer";
import { softDeleteVehicle, updateVehicleStatus } from "../actions/fleet-actions";
import { useToast } from "@/providers/app-provider";

interface DashboardVehicle {
  id: string;
  plateNumber: string;
  brand: { name: string };
  model: { name: string };
  city: { name: string };
  status: string;
}

export function FleetDashboard({ initialVehicles }: { initialVehicles: DashboardVehicle[] }) {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = React.useState(initialVehicles);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isCsvOpen, setIsCsvOpen] = React.useState(false);

  const refreshList = () => {
    window.location.reload();
  };

  const handleDelete = async (id: string, plate: string) => {
    const result = await softDeleteVehicle(id);
    if (result.success) {
      showToast(`Vehicle ${plate} soft deleted`, "success");
      setVehicles((prev) => prev.filter((v) => v.id !== id));
    }
  };

  const handleStatusChange = async (id: string, status: any, plate: string) => {
    const result = await updateVehicleStatus(id, status);
    if (result.success) {
      showToast(`Vehicle ${plate} status updated to ${status}`, "success");
      setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Fleet Operations Console</h1>
        <div className="flex gap-3">
          <Button onClick={() => setIsCsvOpen(true)} variant="outline">
            <Upload className="mr-1.5 h-4 w-4" /> Bulk Import
          </Button>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="mr-1.5 h-4 w-4" /> Add Vehicle
          </Button>
        </div>
      </div>

      {/* Fleet table */}
      <div className="rounded-xl border border-border bg-card/30 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase text-muted-foreground">
              <th className="p-4">Vehicle Specs</th>
              <th className="p-4">Plate Number</th>
              <th className="p-4">Location</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground/80">
            {vehicles.map((car) => (
              <tr key={car.id} className="hover:bg-muted/10 transition-colors">
                <td className="p-4 font-semibold text-foreground">
                  {car.brand.name} {car.model.name}
                </td>
                <td className="p-4 font-mono text-xs">{car.plateNumber}</td>
                <td className="p-4">{car.city.name}</td>
                <td className="p-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    car.status === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Button
                    onClick={() => handleStatusChange(car.id, car.status === "AVAILABLE" ? "MAINTENANCE" : "AVAILABLE", car.plateNumber)}
                    variant="outline"
                    size="sm"
                  >
                    <Wrench className="mr-1 h-3.5 w-3.5" /> Toggle Maintenance
                  </Button>
                  <Button onClick={() => handleDelete(car.id, car.plateNumber)} variant="destructive" size="sm">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* dialog forms */}
      <Dialog isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Register Fleet Vehicle">
        <VehicleForm onSuccess={() => { setIsFormOpen(false); refreshList(); }} />
      </Dialog>

      <Dialog isOpen={isCsvOpen} onClose={() => setIsCsvOpen(false)} title="Import Fleet CSV">
        <CsvImporter onImportSuccess={() => { setIsCsvOpen(false); refreshList(); }} />
      </Dialog>
    </div>
  );
}
