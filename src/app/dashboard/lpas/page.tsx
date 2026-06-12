// ============================================================
// PlanningIntel AI — LPAs Dashboard Page
// ============================================================

"use client";

import { useState } from "react";
import { Globe, Search, CheckCircle2, AlertCircle, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const lpas = [
  { id: "1", name: "Birmingham City Council", region: "West Midlands", status: "active", planStage: "Adopted", sitesOpen: true, scrapes: 98 },
  { id: "2", name: "Greater Manchester Combined Authority", region: "North West", status: "active", planStage: "Reg. 19", sitesOpen: false, scrapes: 95 },
  { id: "3", name: "Cornwall Council", region: "South West", status: "active", planStage: "Under Review", sitesOpen: true, scrapes: 92 },
  { id: "4", name: "Leeds City Council", region: "Yorkshire", status: "active", planStage: "Reg. 18", sitesOpen: true, scrapes: 90 },
  { id: "5", name: "Essex County Council", region: "East of England", status: "active", planStage: "Adopted", sitesOpen: false, scrapes: 97 },
  { id: "6", name: "Cambridgeshire County Council", region: "East of England", status: "active", planStage: "Reg. 19", sitesOpen: false, scrapes: 88 },
];

export default function LPAsPage() {
  const [search, setSearch] = useState("");
  const filtered = lpas.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.region.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Local Planning Authorities</h1>
        <p className="mt-1 text-sm text-gray-500">All 330+ English LPAs — monitor and track planning activity</p>
      </div>
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search LPAs..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map((lpa) => (
              <div key={lpa.id} className="flex items-center gap-4 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Globe className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{lpa.name}</h3>
                  <p className="text-xs text-gray-500">{lpa.region}</p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <Badge variant={lpa.sitesOpen ? "success" : "outline"}>
                    {lpa.sitesOpen ? "Sites Open" : "No Sites"}
                  </Badge>
                  <span className="text-gray-400">{lpa.planStage}</span>
                  <span className="flex items-center gap-1 text-gray-400">
                    {lpa.scrapes >= 95 ? <CheckCircle2 className="h-3 w-3 text-green-500" /> : <AlertCircle className="h-3 w-3 text-amber-500" />}
                    {lpa.scrapes}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}