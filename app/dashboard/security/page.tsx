"use client";

import * as React from "react";
import { Smartphone, History, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/providers/app-provider";
import { getGdprDataReport } from "@/features/dashboard/actions/dashboard-actions";

export default function SecurityDashboardPage() {
  const { showToast } = useToast();
  const [exporting, setExporting] = React.useState(false);
  const [trustedDevices, setTrustedDevices] = React.useState([
    { id: "d1", name: "Dell XPS Laptop (Current)", trusted: true },
    { id: "d2", name: "iPhone 15 Pro", trusted: true },
  ]);

  const toggleTrust = (id: string) => {
    setTrustedDevices((prev) => prev.map((d) => (d.id === id ? { ...d, trusted: !d.trusted } : d)));
    showToast("Device trust settings adjusted", "info");
  };

  const handleDownloadReport = async () => {
    setExporting(true);
    // Since we mock the logged-in user in database, pass a mock UUID check or retrieve first user ID
    const res = await getGdprDataReport("mock-user-id");
    setExporting(false);

    if (res.success) {
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(res.report, null, 2));
      const anchor = document.createElement("a");
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", "tripzy_gdpr_compliance_export.json");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast("GDPR data export downloaded successfully", "success");
    } else {
      // In dev, if ID is mismatch, generate a mock sample download to verify reliability
      const sample = { info: "Compliance download fallback", date: new Date() };
      const dataStr =
        "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sample, null, 2));
      const anchor = document.createElement("a");
      anchor.setAttribute("href", dataStr);
      anchor.setAttribute("download", "tripzy_data_sample.json");
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      showToast("Downloaded placeholder sample report", "info");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-gradient font-display text-2xl font-bold tracking-tight">
          Account Security
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review login timeline histories, configure trusted hardware, and request compliance report
          summaries.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Device Settings */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6 md:col-span-1">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <Smartphone className="h-4.5 w-4.5" /> Trusted Hardware
          </h3>
          <div className="space-y-3">
            {trustedDevices.map((d) => (
              <div key={d.id} className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">{d.name}</span>
                <input
                  type="checkbox"
                  checked={d.trusted}
                  onChange={() => toggleTrust(d.id)}
                  className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Audit logins logs */}
        <div className="space-y-4 rounded-xl border border-border bg-card/30 p-6 md:col-span-2">
          <h3 className="flex items-center gap-1.5 font-display text-base font-semibold">
            <History className="h-4.5 w-4.5" /> Recent Connection Logs
          </h3>
          <div className="divide-y divide-border/60">
            <div className="flex justify-between py-2.5 text-xs">
              <span className="font-semibold text-foreground">
                Login from 103.54.12.8 (Ranchi, IN)
              </span>
              <span className="text-muted-foreground">Today, 2:15 PM</span>
            </div>
            <div className="flex justify-between py-2.5 text-xs">
              <span className="font-semibold text-foreground">API Token verification check</span>
              <span className="text-muted-foreground">Yesterday, 11:42 AM</span>
            </div>
          </div>
        </div>
      </div>

      {/* GDPR privacy card */}
      <div className="flex flex-col items-start justify-between gap-4 space-y-4 rounded-xl border border-border bg-card/45 p-6 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <h3 className="flex items-center gap-1.5 font-display text-base font-bold">
            <Shield className="h-4.5 w-4.5 text-primary" /> GDPR Privacy Compliance
          </h3>
          <p className="max-w-lg text-xs leading-relaxed text-muted-foreground">
            Download a portable, structured JSON document containing your profile information,
            historical bookings metadata, and financial ledger transaction logs.
          </p>
        </div>
        <Button onClick={handleDownloadReport} isLoading={exporting}>
          <Download className="mr-1.5 h-4 w-4" /> Download Personal Data
        </Button>
      </div>
    </div>
  );
}
export type SecurityDashboardPagePropsType = typeof SecurityDashboardPage;
