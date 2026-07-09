"use client";

import * as React from "react";
import { Upload, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { csvRowSchema } from "../validators";
import { registerVehicle } from "../actions/cars-actions";
import { useToast } from "@/providers/app-provider";

export function CsvImporter({ onImportSuccess }: { onImportSuccess: () => void }) {
  const { showToast } = useToast();
  const [csvText, setCsvText] = React.useState("");
  const [logs, setLogs] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);

  const processImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) return;

    setLoading(true);
    setLogs([]);
    const lines = csvText.split("\n").filter((line) => line.trim());
    let successes = 0;
    const newLogs: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const cols = line.split(",").map((c) => c.trim());

      // Minimum check: plateNumber, vin, brand, model, variant, year, color, transmission, fuelType, mileage, locationCity, seats, doors, dailyRate, securityDeposit, extraKmCharge
      if (cols.length < 16) {
        newLogs.push(`Row ${i + 1}: Malformed columns (expected 16, found ${cols.length})`);
        continue;
      }

      const rawRow = {
        plateNumber: cols[0],
        vin: cols[1],
        brand: cols[2],
        model: cols[3],
        variant: cols[4],
        year: cols[5],
        color: cols[6],
        transmission: cols[7],
        fuelType: cols[8],
        mileage: cols[9],
        locationCity: cols[10],
        seats: cols[11],
        doors: cols[12],
        dailyRate: cols[13],
        securityDeposit: cols[14],
        extraKmCharge: cols[15],
      };

      const result = csvRowSchema.safeParse(rawRow);
      if (!result.success) {
        const errorMsg = result.error.flatten().fieldErrors;
        newLogs.push(`Row ${i + 1} validation failed: ${JSON.stringify(errorMsg)}`);
        continue;
      }

      const dbResult = await registerVehicle(result.data);
      if (dbResult.success) {
        successes++;
      } else {
        newLogs.push(`Row ${i + 1} db insertion failed: ${dbResult.error}`);
      }
    }

    setLoading(false);
    setLogs(newLogs);
    showToast(`Import completed: ${successes} successes, ${newLogs.length} failures`, "info");
    if (successes > 0) {
      setCsvText("");
      onImportSuccess();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={processImport} className="space-y-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase text-muted-foreground">
            Paste CSV Rows (Comma separated values)
          </label>
          <div className="mb-2 rounded bg-muted p-2 font-mono text-[10px] text-muted-foreground">
            plateNumber,vin,brand,model,variant,year,color,transmission,fuelType,mileage,locationCity,seats,doors,dailyRate,securityDeposit,extraKmCharge
          </div>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            rows={6}
            placeholder="KA-03-HA-1234,17CHARVINNUMBERMOC,Mahindra,Thar,LX,2024,Red,AUTOMATIC,PETROL,5000,Ranchi,5,4,2500,5000,15"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 font-mono text-xs text-foreground focus:outline-none"
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          <Upload className="mr-1.5 h-4 w-4" /> Validate & Import Bulk Cars
        </Button>
      </form>

      {logs.length > 0 && (
        <div className="space-y-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
          <span className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
            <AlertTriangle className="h-4 w-4" /> Import Warnings ({logs.length})
          </span>
          <div className="max-h-32 space-y-1 overflow-y-auto font-mono text-[10px] text-muted-foreground">
            {logs.map((log, idx) => (
              <div key={idx} className="border-b border-border/50 pb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
