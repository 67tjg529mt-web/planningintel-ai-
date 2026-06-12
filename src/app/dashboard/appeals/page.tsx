// ============================================================
// PlanningIntel AI — Appeals Dashboard Page
// Bloomberg Terminal-inspired high-density display
// ============================================================

"use client";

import { useState } from "react";
import { Search, Scale, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Appeal {
  id: string;
  caseRef: string;
  lpa: string;
  siteAddress: string;
  description: string;
  status: "allowed" | "dismissed" | "pending";
  decisionDate: string | null;
  aiSummary: string;
}

const appeals: Appeal[] = [
  {
    id: "1",
    caseRef: "APP/K2420/W/25/3345678",
    lpa: "Leeds City Council",
    siteAddress: "Land off Kirkstall Road, Leeds, LS4 2AB",
    description: "Appeal against refusal of 48 residential dwellings (outline with all matters reserved)",
    status: "allowed",
    decisionDate: "2026-05-28",
    aiSummary: "Appeal allowed on grounds of housing land supply shortfall. Council could not demonstrate 5-year supply. Costs awarded to appellant.",
  },
  {
    id: "2",
    caseRef: "APP/B4560/W/25/3390123",
    lpa: "Birmingham City Council",
    siteAddress: "123 Bordesley Green, Birmingham, B9 5NA",
    description: "Appeal against refusal of change of use from office (E) to residential (C3)",
    status: "dismissed",
    decisionDate: "2026-06-02",
    aiSummary: "Dismissed due to loss of employment land contrary to Policy EC4. Insufficient marketing evidence provided.",
  },
  {
    id: "3",
    caseRef: "APP/C3456/W/25/3412345",
    lpa: "Cornwall Council",
    siteAddress: "Trevarthian Farm, St Austell, PL25 4EJ",
    description: "Appeal against enforcement notice for unauthorised agricultural worker's dwelling",
    status: "pending",
    decisionDate: null,
    aiSummary: "Hearing listed for July 2026. Key issue: whether functional need for agricultural dwelling exists.",
  },
  {
    id: "4",
    caseRef: "APP/D1234/W/25/3423456",
    lpa: "Cambridgeshire County Council",
    siteAddress: "Cambridge Science Park, Milton Road, Cambridge, CB4 0WN",
    description: "Appeal against refusal of 12,000sqm office/lab space (Use Class E(g))",
    status: "allowed",
    decisionDate: "2026-05-15",
    aiSummary: "Allowed. Inspector found economic benefits outweighed landscape harm. Conditions imposed re: travel plan.",
  },
  {
    id: "5",
    caseRef: "APP/E5678/W/25/3434567",
    lpa: "Essex County Council",
    siteAddress: "Land adj. A127, Basildon, SS15 6QE",
    description: "Appeal against refusal of 150-bed hotel with restaurant and conference facilities",
    status: "dismissed",
    decisionDate: "2026-04-20",
    aiSummary: "Dismissed due to conflict with Green Belt policy. Very special circumstances not demonstrated.",
  },
  {
    id: "6",
    caseRef: "APP/F9012/W/25/3445678",
    lpa: "Greater Manchester Combined Authority",
    siteAddress: "Salford Quays, Manchester, M50 3SN",
    description: "Appeal against refusal of 32-storey residential tower (286 units)",
    status: "pending",
    decisionDate: null,
    aiSummary: "Inquiry scheduled for September 2026. Main issues: impact on townscape, affordable housing provision, highway safety.",
  },
  {
    id: "7",
    caseRef: "APP/G3456/W/25/3456789",
    lpa: "Bristol City Council",
    siteAddress: "Former petrol station, 85 Gloucester Road, Bristol, BS7 8AS",
    description: "Appeal against refusal of 12 affordable apartments (Prior Approval Class MA)",
    status: "allowed",
    decisionDate: "2026-06-10",
    aiSummary: "Prior Approval deemed not required. Office-to-residential permitted development rights engaged. Affordable housing secured via S106.",
  },
  {
    id: "8",
    caseRef: "APP/H7890/W/25/3467890",
    lpa: "Birmingham City Council",
    siteAddress: "Unit 4, Small Business Park, Digbeth, Birmingham, B5 6DT",
    description: "Appeal against refusal of rooftop solar array (0.5MW)",
    status: "dismissed",
    decisionDate: "2026-03-15",
    aiSummary: "Dismissed due to impact on adjacent listed building setting. Heritage harm outweighed renewable energy benefits.",
  },
];

const statusConfig: Record<string, { label: string; variant: "success" | "danger" | "warning" }> = {
  allowed: { label: "Allowed", variant: "success" },
  dismissed: { label: "Dismissed", variant: "danger" },
  pending: { label: "Pending", variant: "warning" },
};

export default function AppealsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "allowed" | "dismissed" | "pending">("all");

  const filtered = appeals
    .filter((a) => filter === "all" || a.status === filter)
    .filter(
      (a) =>
        a.lpa.toLowerCase().includes(search.toLowerCase()) ||
        a.caseRef.toLowerCase().includes(search.toLowerCase()) ||
        a.siteAddress.toLowerCase().includes(search.toLowerCase())
    );

  const allowedPct = Math.round((appeals.filter(a => a.status === "allowed").length / appeals.length) * 100);
  const dismissedPct = Math.round((appeals.filter(a => a.status === "dismissed").length / appeals.length) * 100);
  const pendingPct = Math.round((appeals.filter(a => a.status === "pending").length / appeals.length) * 100);

  return (
    <div className="p-4 lg:p-6">
      {/* Bloomberg-style header bar */}
      <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded bg-gray-800 text-white dark:bg-gray-700">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              Appeals Monitor
            </h1>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {appeals.length} Cases Tracked &middot; Last updated {new Date().toLocaleDateString("en-GB")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(["all", "allowed", "dismissed", "pending"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-[11px] font-medium uppercase tracking-wider transition-colors ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              }`}
            >
              {f === "all" ? "ALL" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal-style stat bar */}
      <div className="mb-5 grid grid-cols-4 gap-[1px] bg-gray-200 dark:bg-gray-800">
        {[
          { label: "TOTAL", value: appeals.length, color: "text-blue-600 dark:text-blue-400" },
          { label: "ALLOWED", value: appeals.filter(a => a.status === "allowed").length, color: "text-green-600 dark:text-green-400" },
          { label: "DISMISSED", value: appeals.filter(a => a.status === "dismissed").length, color: "text-red-600 dark:text-red-400" },
          { label: "PENDING", value: appeals.filter(a => a.status === "pending").length, color: "text-yellow-600 dark:text-yellow-400" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white px-3 py-2 dark:bg-gray-950">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              {stat.label}
            </p>
            <p className={`data-value text-lg font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Distribution bar */}
      <div className="mb-5 flex h-5 w-full overflow-hidden rounded-sm">
        <div className="bg-green-500 transition-all" style={{ width: `${allowedPct}%` }} title={`Allowed: ${allowedPct}%`} />
        <div className="bg-red-500 transition-all" style={{ width: `${dismissedPct}%` }} title={`Dismissed: ${dismissedPct}%`} />
        <div className="bg-yellow-500 transition-all" style={{ width: `${pendingPct}%` }} title={`Pending: ${pendingPct}%`} />
      </div>
      <div className="mb-5 flex gap-4 text-[10px] text-gray-500">
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-green-500" /> Allowed {allowedPct}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-red-500" /> Dismissed {dismissedPct}%</span>
        <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-sm bg-yellow-500" /> Pending {pendingPct}%</span>
      </div>

      {/* Search */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by LPA, case ref, or site address..."
            className="h-8 border-gray-200 pl-8 text-xs dark:border-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Appeals list - Bloomberg data row style */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((appeal) => (
              <div
                key={appeal.id}
                className="data-row group cursor-pointer"
              >
                {/* Status dot + Case ref column */}
                <div className="flex w-48 shrink-0 items-center gap-2">
                  <span className={`status-dot ${appeal.status}`} />
                  <span className="data-value text-[11px] font-medium text-gray-900 dark:text-gray-100">
                    {appeal.caseRef.slice(-8)}
                  </span>
                </div>

                {/* LPA column */}
                <div className="w-40 shrink-0 text-[11px] text-gray-600 dark:text-gray-400">
                  {appeal.lpa}
                </div>

                {/* Site address column */}
                <div className="flex-1 min-w-0 truncate text-[11px] text-gray-700 dark:text-gray-300">
                  {appeal.siteAddress}
                </div>

                {/* Decision date column */}
                <div className="w-24 shrink-0 text-center text-[11px] text-gray-500 dark:text-gray-400">
                  {appeal.decisionDate || "—"}
                </div>

                {/* Status badge column */}
                <div className="w-20 shrink-0 text-right">
                  <Badge variant={statusConfig[appeal.status]?.variant} className="text-[10px] px-1.5 py-0">
                    {statusConfig[appeal.status]?.label}
                  </Badge>
                </div>

                {/* Expand indicator */}
                <div className="ml-2 shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <ArrowUpRight className="h-3 w-3 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected appeal detail (first one by default) */}
      <Card className="mt-4">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`status-dot ${appeals[0].status}`} />
                <span className="data-value text-xs font-bold text-gray-900 dark:text-gray-100">
                  {appeals[0].caseRef}
                </span>
                <Badge variant={statusConfig[appeals[0].status]?.variant} className="text-[10px]">
                  {statusConfig[appeals[0].status]?.label}
                </Badge>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                {appeals[0].description}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{appeals[0].lpa} &middot; {appeals[0].siteAddress}</p>
              <div className="rounded-sm border-l-2 border-blue-500 bg-blue-50 px-3 py-2 dark:bg-blue-900/20">
                <p className="text-xs font-medium text-blue-700 dark:text-blue-300 mb-0.5">AI Analysis</p>
                <p className="text-xs text-gray-700 dark:text-gray-300">{appeals[0].aiSummary}</p>
              </div>
              {appeals[0].decisionDate && (
                <p className="mt-2 text-[10px] text-gray-400">Decision date: {appeals[0].decisionDate}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}